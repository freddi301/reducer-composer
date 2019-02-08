import { DeepReadonly } from "./utility";

export function createBatchHandler<State, Payload>(
  handler: (state: DeepReadonly<State>, payload: Payload) => DeepReadonly<State>
) {
  return (state: DeepReadonly<State>, payload: Array<Payload>) =>
    payload.reduce(handler, state);
}
