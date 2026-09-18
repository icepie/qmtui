import { isQmtuiCommand, runQmtuiCommand } from "../../src/utils/qmtui-library.ts";
import { tolerant } from "./tolerant.js";

// 浏览器里没有 Tauri 后端：
//  - 库/歌单相关命令由 qmtui-library 映射到 qmtui 的 HTTP 接口；
//  - 其余命令返回可容忍对象（属性/调用都安全，await 得到自身）。
export const invoke = async (command, args) => {
	if (isQmtuiCommand(command)) return runQmtuiCommand(command, args);
	return tolerant();
};
export const convertFileSrc = (filePath) => filePath;
export class Channel {
	onmessage = null;
	toJSON() {
		return "";
	}
}
