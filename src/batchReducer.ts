import { Reducer } from "./utility";

export function batchReducer<
  ActionType extends string,
  State,
  Action extends { type: string; payload?: any }
>(
  actionType: ActionType,
  reducer: Reducer<State, Action>
): Reducer<
  State,
  | { type: ActionType; payload: Array<Action> }
  | Exclude<Action, { type: ActionType }>
> {
  return (state, action) =>
    action.type === actionType
      ? action.payload.reduce(reducer, state)
      : reducer(state, action as Action);
}
