import { Reducer } from "./utility";

export function withInitialState<
  State,
  Action extends { type: string; payload?: any }
>(initial: State, reducer: Reducer<State, Action>) {
  return (state: State = initial, action: Action) => reducer(state, action);
}
