export function createKeyedByHandlers<
  KeyComponents extends {},
  State,
  Handlers extends Record<
    string,
    (state: State, payload: KeyComponents) => State
  >
>(
  keyCreator: (keyComponents: KeyComponents) => string,
  handlers: Handlers & Record<string, (state: State, payload: any) => State>
) {
  const keyedByHandlers = {} as {
    [K in keyof Handlers]: (
      state: Record<string, State>,
      payload: Parameters<Handlers[K]>[1] & KeyComponents
    ) => Record<string, State>
  };
  for (const [handlerName, handler] of Object.entries(handlers)) {
    keyedByHandlers[handlerName] = (state, payload) => {
      const key = keyCreator(payload);
      return { ...state, [key]: handler(state[key], payload) };
    };
  }
  return keyedByHandlers;
}
