export function createBatchHandler<State, Payload>(
  handler: (state: State, payload: Payload) => State
) {
  return (state: State, payload: Array<Payload>) =>
    payload.reduce(handler, state);
}
