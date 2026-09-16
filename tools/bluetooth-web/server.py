#!/usr/bin/env python3
"""Minimal LAN Bluetooth control surface backed by BlueZ bluetoothctl."""

from __future__ import annotations

import json
import re
import subprocess
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

HOST = "0.0.0.0"
PORT = 9988
ROOT = Path(__file__).resolve().parent
BLUETOOTH_ADDRESS = re.compile(r"^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$", re.IGNORECASE)
PACTL_PATH = "/usr/bin/pactl"



def bluetoothctl(*arguments: str, timeout: int = 15) -> str:
    completed = subprocess.run(
        ["/usr/bin/bluetoothctl", *arguments],
        check=False,
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    output = (completed.stdout + completed.stderr).strip()
    if completed.returncode:
        raise RuntimeError(output or "蓝牙命令执行失败")
    return output

def pactl(*arguments: str, json_output: bool = False, timeout: int = 10) -> object:
    command = [PACTL_PATH]
    if json_output:
        command.extend(["--format=json"])
    command.extend(arguments)
    completed = subprocess.run(command, check=False, capture_output=True, text=True, timeout=timeout)
    output = (completed.stdout + completed.stderr).strip()
    if completed.returncode:
        raise RuntimeError(output or "音频命令执行失败")
    return json.loads(completed.stdout) if json_output else output


def audio_devices(kind: str) -> list[dict[str, object]]:
    rows = pactl("list", kind, json_output=True)
    assert isinstance(rows, list)
    devices = []
    for row in rows:
        volume = row.get("volume", {})
        percentages = []
        for channel in volume.values():
            value = str(channel.get("value_percent", "0%")).rstrip("%")
            if value.isdigit():
                percentages.append(int(value))
        description = row.get("description")
        if not description or description == "(null)":
            address = row.get("properties", {}).get("device.string", "")
            if BLUETOOTH_ADDRESS.fullmatch(address):
                info = bluetoothctl("info", address)
                description = property_value(info, "Alias") or property_value(info, "Name")
                if description and kind == "sources":
                    description += " · 系统声音内录"
            if not description or description == "(null)":
                description = row.get("name", "未知音频设备")
        devices.append({
            "name": row.get("name", ""),
            "description": description,
            "state": row.get("state", "UNKNOWN"),
            "mute": bool(row.get("mute", False)),
            "volume": round(sum(percentages) / len(percentages)) if percentages else 0,
        })
    return devices


def audio_state() -> dict[str, object]:
    info = pactl("info", json_output=True)
    assert isinstance(info, dict)
    return {
        "server": info.get("server_name", "未知音频服务"),
        "defaultSink": info.get("default_sink_name", ""),
        "defaultSource": info.get("default_source_name", ""),
        "sinks": audio_devices("sinks"),
        "sources": audio_devices("sources"),
    }


def set_audio(payload: dict[str, object]) -> str:
    action = payload.get("action")
    state = audio_state()
    if action == "set_default_sink":
        name = payload.get("name")
        if not isinstance(name, str) or name not in {item["name"] for item in state["sinks"]}:
            raise ValueError("无效的音频输出")
        return str(pactl("set-default-sink", name))
    if action == "set_default_source":
        name = payload.get("name")
        if not isinstance(name, str) or name not in {item["name"] for item in state["sources"]}:
            raise ValueError("无效的音频输入")
        return str(pactl("set-default-source", name))
    if action in {"set_sink_volume", "set_source_volume"}:
        name = payload.get("name")
        volume = payload.get("volume")
        collection = state["sinks"] if action == "set_sink_volume" else state["sources"]
        if not isinstance(name, str) or name not in {item["name"] for item in collection}:
            raise ValueError("无效的音频设备")
        if not isinstance(volume, int) or not 0 <= volume <= 150:
            raise ValueError("音量必须在 0 到 150 之间")
        target = "set-sink-volume" if action == "set_sink_volume" else "set-source-volume"
        return str(pactl(target, name, f"{volume}%"))
    if action in {"set_sink_mute", "set_source_mute"}:
        name = payload.get("name")
        enabled = payload.get("enabled")
        collection = state["sinks"] if action == "set_sink_mute" else state["sources"]
        if not isinstance(name, str) or name not in {item["name"] for item in collection} or not isinstance(enabled, bool):
            raise ValueError("无效的静音设置")
        target = "set-sink-mute" if action == "set_sink_mute" else "set-source-mute"
        return str(pactl(target, name, "1" if enabled else "0"))
    raise ValueError("不支持的音频操作")


def property_value(output: str, name: str) -> str | None:
    prefix = f"{name}:"
    for line in output.splitlines():
        line = line.strip()
        if line.lower().startswith(prefix.lower()):
            return line[len(prefix) :].strip()
    return None


def property_enabled(output: str, name: str) -> bool:
    return property_value(output, name) == "yes"


def device_rows(output: str) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for line in output.splitlines():
        parts = line.strip().split(maxsplit=2)
        if len(parts) >= 2 and parts[0] == "Device" and BLUETOOTH_ADDRESS.fullmatch(parts[1]):
            rows.append((parts[1].upper(), parts[2] if len(parts) == 3 else parts[1]))
    return rows


def bluetooth_state() -> dict[str, object]:
    controller = bluetoothctl("show")
    paired = {address for address, _ in device_rows(bluetoothctl("devices", "Paired"))}
    devices = []
    for address, name in device_rows(bluetoothctl("devices")):
        try:
            info = bluetoothctl("info", address)
        except RuntimeError:
            continue
        devices.append(
            {
                "address": address,
                "name": name,
                "paired": address in paired or property_enabled(info, "Paired"),
                "connected": property_enabled(info, "Connected"),
                "trusted": property_enabled(info, "Trusted"),
            }
        )
    return {
        "alias": property_value(controller, "Alias") or "Bluetooth",
        "powered": property_enabled(controller, "Powered"),
        "discoverable": property_enabled(controller, "Discoverable"),
        "pairable": property_enabled(controller, "Pairable"),
        "discovering": property_enabled(controller, "Discovering"),
        "devices": devices,
    }


def run_action(payload: dict[str, object]) -> str:
    action = payload.get("action")
    if not isinstance(action, str):
        raise ValueError("缺少操作类型")

    if action in {"set_power", "set_discoverable", "set_pairable"}:
        enabled = payload.get("enabled")
        if not isinstance(enabled, bool):
            raise ValueError("缺少开关状态")
        command = {
            "set_power": "power",
            "set_discoverable": "discoverable",
            "set_pairable": "pairable",
        }[action]
        return bluetoothctl(command, "on" if enabled else "off")

    if action == "scan":
        return bluetoothctl("--timeout", "8", "scan", "on", timeout=12)

    address = payload.get("address")
    if action not in {"pair", "connect", "disconnect", "trust", "remove"} or not isinstance(address, str) or not BLUETOOTH_ADDRESS.fullmatch(address):
        raise ValueError("无效的蓝牙设备地址")

    if action == "pair":
        return bluetoothctl("--timeout", "30", "pair", address, timeout=35)
    return bluetoothctl(action, address)


class BluetoothHandler(BaseHTTPRequestHandler):
    server_version = "QmTuiBluetooth/1.0"

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        try:
            if path == "/api/state":
                self.respond_json(HTTPStatus.OK, bluetooth_state())
            elif path == "/api/audio":
                self.respond_json(HTTPStatus.OK, audio_state())
            elif path in {"/", "/index.html"}:
                self.respond_file("index.html", "text/html; charset=utf-8")
            elif path == "/app.js":
                self.respond_file("app.js", "application/javascript; charset=utf-8")
            elif path == "/style.css":
                self.respond_file("style.css", "text/css; charset=utf-8")
            else:
                self.respond_json(HTTPStatus.NOT_FOUND, {"error": "not found"})
        except (RuntimeError, subprocess.TimeoutExpired, ValueError) as error:
            self.respond_json(HTTPStatus.SERVICE_UNAVAILABLE, {"ok": False, "error": str(error)})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path not in {"/api/action", "/api/audio/action"}:
            self.respond_json(HTTPStatus.NOT_FOUND, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 4096:
                raise ValueError("请求体无效")
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict):
                raise ValueError("请求体无效")
            if path == "/api/audio/action":
                message = set_audio(payload)
                response_state = audio_state()
            else:
                message = run_action(payload)
                response_state = bluetooth_state()
            self.respond_json(HTTPStatus.OK, {"ok": True, "message": message, "state": response_state})
        except (ValueError, json.JSONDecodeError) as error:
            self.respond_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
        except (RuntimeError, subprocess.TimeoutExpired) as error:
            self.respond_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})

    def respond_file(self, name: str, content_type: str) -> None:
        try:
            content = (ROOT / name).read_bytes()
        except FileNotFoundError:
            self.respond_json(HTTPStatus.NOT_FOUND, {"error": "not found"})
            return
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def respond_json(self, status: HTTPStatus, value: object) -> None:
        content = json.dumps(value, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, _format: str, *_args: object) -> None:
        pass


if __name__ == "__main__":
    ThreadingHTTPServer((HOST, PORT), BluetoothHandler).serve_forever()
