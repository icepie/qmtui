// 浏览器里直接用原生 fetch（跨域由对端 CORS 决定）
export const fetch = (...args) => globalThis.fetch(...args);
