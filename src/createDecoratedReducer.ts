import { Reducer } from "./utility";

export function createDecoratedReducer<
  State,
  Action extends { type: string; payload?: any }
>(
  decorator: (
    reducer: Reducer<State, Action>
  ) => (state: State, action: Action) => State,
  reducer: Reducer<State, Action>
) {
  return decorator(reducer);
}
