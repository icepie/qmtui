// 浏览器里没有 Tauri 运行时：用可容忍的代理兜底，让 UI 能跑起来（不改变任何业务语义）。
export const noopAsync = async () => undefined;
export const unlisten = () => {};

export const tolerant = () =>
  new Proxy(function tolerantStub() {}, {
    get: (_target, key) => {
      if (key === 'then' || key === Symbol.toPrimitive || typeof key === 'symbol') return undefined;
      return tolerant();
    },
    apply: () => Promise.resolve(undefined),
    construct: () => ({}),
  });
