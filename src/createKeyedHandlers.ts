export function createKeyedHandlers<
  KeyAttribute extends string,
  State,
  Handlers extends Record<string, (state: State, payload: any) => State>
>(
  keyAttribute: KeyAttribute,
  handlers: Handlers & Record<string, (state: State, payload: any) => State>
) {
  const keyedHandlers = {} as {
    [K in keyof Handlers]: (
      state: Record<string, State>,
      payload: Parameters<Handlers[K]>[1] & { [K in KeyAttribute]: string }
    ) => Record<string, State>
  };
  for (const [handlerName, handler] of Object.entries(handlers)) {
    keyedHandlers[handlerName] = (
      state,
      { [keyAttribute]: key, ...payload }
    ) => ({ ...state, [key]: handler(state[key as string], payload) });
  }
  return keyedHandlers;
}
