import { Reducer } from "./utility";

export function createKeyedByReducer<
  State,
  Action extends {
    type: string;
    payload: Record<string, any>;
  }
>(
  keySelector: (action: Action) => string,
  reducer: Reducer<State, Action>
): Reducer<Record<string, State>, Action> {
  return (state, action) => {
    const key = keySelector(action);
    return {
      ...state,
      [key]: reducer(state[key as string], action)
    };
  };
}