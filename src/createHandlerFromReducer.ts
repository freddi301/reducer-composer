import { Reducer } from "./utility";

export function createHandlerFromReducer<
  State,
  Action extends { type: string; payload?: any }
>(reducer: Reducer<State, Action>) {
  return <ActionType extends Action["type"]>(actionType: ActionType) => (
    state: State,
    payload: Extract<Action, { type: ActionType }>["payload"]
  ) =>
    reducer(state, { type: actionType, payload } as Extract<
      Action,
      { type: ActionType }
    >);
}
