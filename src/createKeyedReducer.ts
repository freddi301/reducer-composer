import { Reducer } from "./utility";

/**
 * @todo filter unknown actions, cannot be called with unknown actions (cannot be used as is in createCombinedReducer)
 */
export function createKeyedReducer<
  KeyAttribute extends string,
  State,
  Action extends { type: string; payload: Record<string, any> }
>(
  keyAttribute: KeyAttribute,
  reducer: Reducer<State, Action>
): Reducer<
  Record<string, State>,
  Action & { payload: { [K in KeyAttribute]: string | number } }
> {
  return (state = {}, action) => {
    const {
      type,
      payload: { [keyAttribute]: key, ...payload }
    } = action;
    return {
      ...state,
      [key]: reducer(state[key as string], { type, payload } as Action)
    };
  };
}
