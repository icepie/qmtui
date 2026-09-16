const elements = {
  summary: document.querySelector('#summary'),
  deviceStatus: document.querySelector('#deviceStatus'),
  deviceList: document.querySelector('#deviceList'),
  notice: document.querySelector('#notice'),
  refresh: document.querySelector('#refresh'),
  scan: document.querySelector('#scan'),
  switches: document.querySelectorAll('.switch'),
  audioStatus: document.querySelector('#audioStatus'),
  defaultSink: document.querySelector('#defaultSink'),
  defaultSource: document.querySelector('#defaultSource'),
  sinkControls: document.querySelector('#sinkControls'),
  sourceControls: document.querySelector('#sourceControls'),
};

let state = null;
let audioState = null;
let actionInProgress = false;
const stateKeys = {
  set_power: 'powered',
  set_discoverable: 'discoverable',
  set_pairable: 'pairable',
};

function setNotice(message = '', error = false) {
  elements.notice.textContent = message;
  elements.notice.classList.toggle('error', error);
}

function actionButton(label, action, address) {
  const button = document.createElement('button');
  button.textContent = label;
  button.onclick = () => runBluetoothAction({ action, address });
  return button;
}

function renderBluetooth(nextState) {
  state = nextState;
  elements.summary.textContent = `${state.alias || 'Bluetooth'} · ${state.powered ? '已开启' : '已关闭'}${state.discoverable ? ' · 可被发现' : ''}${state.pairable ? ' · 可配对' : ''}`;
  elements.deviceStatus.textContent = state.discovering ? '正在扫描附近的设备…' : `共 ${state.devices.length} 个已保存或已发现设备`;
  for (const button of elements.switches) {
    const key = stateKeys[button.dataset.action];
    button.classList.toggle('on', Boolean(state[key]));
    button.setAttribute('aria-pressed', String(Boolean(state[key])));
  }

  elements.deviceList.replaceChildren();
  if (!state.devices.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '尚未发现设备。点击“扫描设备”开始查找。';
    elements.deviceList.append(empty);
    return;
  }

  for (const device of state.devices) {
    const row = document.createElement('article');
    row.className = 'device';
    const main = document.createElement('div');
    main.className = 'device-main';
    const indicator = document.createElement('span');
    indicator.className = `indicator${device.connected ? ' connected' : ''}`;
    const title = document.createElement('div');
    title.innerHTML = '<div class="device-name"></div><div class="device-address"></div>';
    title.querySelector('.device-name').textContent = device.name;
    title.querySelector('.device-address').textContent = `${device.address}${device.connected ? ' · 已连接' : device.paired ? ' · 已配对' : ''}`;
    main.append(indicator, title);
    const actions = document.createElement('div');
    actions.className = 'device-actions';
    if (!device.paired) actions.append(actionButton('配对', 'pair', device.address));
    if (device.paired && !device.trusted) actions.append(actionButton('信任', 'trust', device.address));
    actions.append(actionButton(device.connected ? '断开' : '连接', device.connected ? 'disconnect' : 'connect', device.address));
    if (device.paired) actions.append(actionButton('移除', 'remove', device.address));
    row.append(main, actions);
    elements.deviceList.append(row);
  }
}

function fillDeviceSelect(select, devices, selected) {
  select.replaceChildren();
  for (const device of devices) {
    const option = document.createElement('option');
    option.value = device.name;
    option.textContent = `${device.description}${device.name === selected ? ' · 当前' : ''}`;
    option.selected = device.name === selected;
    select.append(option);
  }
  select.disabled = !devices.length;
}

function renderAudioControls(container, device, kind) {
  container.replaceChildren();
  if (!device) {
    container.textContent = '没有可用设备';
    return;
  }
  const range = document.createElement('input');
  range.type = 'range';
  range.min = '0';
  range.max = '150';
  range.value = String(device.volume);
  range.setAttribute('aria-label', `${device.description} 音量`);
  const value = document.createElement('span');
  value.className = 'volume-value';
  value.textContent = `${device.volume}%`;
  range.oninput = () => { value.textContent = `${range.value}%`; };
  range.onchange = () => runAudioAction({ action: `set_${kind}_volume`, name: device.name, volume: Number(range.value) });
  const mute = document.createElement('button');
  mute.textContent = device.mute ? '取消静音' : '静音';
  mute.onclick = () => runAudioAction({ action: `set_${kind}_mute`, name: device.name, enabled: !device.mute });
  container.append(range, value, mute);
}

function renderAudio(nextState) {
  audioState = nextState;
  elements.audioStatus.textContent = nextState.server;
  fillDeviceSelect(elements.defaultSink, nextState.sinks, nextState.defaultSink);
  fillDeviceSelect(elements.defaultSource, nextState.sources, nextState.defaultSource);
  renderAudioControls(elements.sinkControls, nextState.sinks.find((device) => device.name === nextState.defaultSink), 'sink');
  renderAudioControls(elements.sourceControls, nextState.sources.find((device) => device.name === nextState.defaultSource), 'source');
}

async function loadStates() {
  await Promise.all([
    ['/api/state', renderBluetooth, elements.summary],
    ['/api/audio', renderAudio, elements.audioStatus],
  ].map(async ([path, render, status]) => {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '无法读取系统状态');
      render(result);
    } catch (error) {
      status.textContent = error.message || '无法读取系统状态';
    }
  }));
}

async function runAction(path, payload, render) {
  setNotice('正在执行操作…');
  actionInProgress = true;
  document.querySelectorAll('button, select, input').forEach((control) => { control.disabled = true; });
  try {
    const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || '操作失败');
    render(result.state);
    setNotice(result.message || '操作完成');
  } catch (error) {
    setNotice(error.message || '操作失败', true);
  } finally {
    actionInProgress = false;
    await loadStates().catch(() => {});
    document.querySelectorAll('button, select, input').forEach((control) => { control.disabled = false; });
  }
}

const runBluetoothAction = (payload) => runAction('/api/action', payload, renderBluetooth);
const runAudioAction = (payload) => runAction('/api/audio/action', payload, renderAudio);

elements.refresh.onclick = () => loadStates().catch((error) => setNotice(error.message, true));
elements.scan.onclick = () => runBluetoothAction({ action: 'scan' });
for (const button of elements.switches) {
  button.onclick = () => runBluetoothAction({ action: button.dataset.action, enabled: !state[stateKeys[button.dataset.action]] });
}
elements.defaultSink.onchange = () => runAudioAction({ action: 'set_default_sink', name: elements.defaultSink.value });
elements.defaultSource.onchange = () => runAudioAction({ action: 'set_default_source', name: elements.defaultSource.value });
loadStates().catch((error) => setNotice(error.message, true));
setInterval(() => {
  if (!actionInProgress && document.visibilityState === 'visible') loadStates().catch(() => {});
}, 3000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !actionInProgress) loadStates().catch(() => {});
});
