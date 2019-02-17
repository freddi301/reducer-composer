export function createHandlers<State>() {
  return <
    Handlers extends Record<string, (state: State, payload?: any) => State>
  >(
    handlers: Handlers
  ): {
    [K in keyof Handlers]: (
      state: State,
      payload: Parameters<Handlers[K]>[1]
    ) => State
  } => handlers;
}
