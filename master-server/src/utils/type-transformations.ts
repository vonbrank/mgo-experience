export type ReturnPromiseType<T> = T extends (...args: infer Args) => infer Ret
  ? (...args: Args) => Promise<Ret>
  : never;
