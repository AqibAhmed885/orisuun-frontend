export const ensurePdfJsPromiseCompat = () => {
  const PromiseAny = Promise as any;

  if (typeof PromiseAny.withResolvers !== 'function') {
    PromiseAny.withResolvers = () => {
      let resolve!: (value: unknown) => void;
      let reject!: (reason?: unknown) => void;

      const promise = new Promise<unknown>((res, rej) => {
        resolve = res;
        reject = rej;
      });

      return { promise, resolve, reject };
    };
  }

  if (typeof PromiseAny.try !== 'function') {
    PromiseAny.try = (callback: (...args: any[]) => unknown, ...args: any[]) =>
      Promise.resolve().then(() => callback(...args));
  }
};
