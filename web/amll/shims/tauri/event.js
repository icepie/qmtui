export const TauriEvent = new Proxy({}, { get: (_t, key) => `tauri://${String(key).toLowerCase()}` });
export const listen = async () => () => {};
export const emit = async () => {};
