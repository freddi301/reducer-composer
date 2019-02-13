import { Reducer } from "./utility";

/**
 * @todo filter unknown actions, cannot be called with unknown actions (cannot be used as is in createCombinedReducer)
 */
export function createKeyedByReducer<
  State,
  Action extends {
    type: string;
    payload: Record<string, any>;
  }
>(
  keySelector: (action: Action) => string | number,
  reducer: Reducer<State, Action>
): Reducer<Record<string, State>, Action> {
  return (state = {}, action) => {
    const key = keySelector(action);
    return {
      ...state,
      [key]: reducer(state[key as string], action)
    };
  };
}
