import { Reducer } from "./utility";

export function keyedReducer<
  KeyAttribute extends string,
  State,
  Action extends { type: string; payload: Record<string, any> }
>(
  keyAttribute: KeyAttribute,
  reducer: Reducer<State, Action>
): Reducer<
  Record<string, State>,
  Action & { payload: { [K in KeyAttribute]: string } }
> {
  return (state, action) => {
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

export function keyedByReducer<
  State,
  Action extends { type: string; payload: Record<string, any> }
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
