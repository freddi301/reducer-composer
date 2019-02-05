import { Reducer } from "./UtilityTypes";

export function batchReducer<
  ActionType extends string,
  State,
  Action extends { type: string; payload?: any }
>(
  actionType: ActionType,
  reducer: Reducer<State, Action>
): Reducer<State, { type: ActionType; payload: Array<Action> } | Action> {
  return (state, action) =>
    action.type === actionType
      ? action.payload.reduce(reducer, state)
      : reducer(state, action as Action);
}
