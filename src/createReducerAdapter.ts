import { Reducer } from "./utility";

export function createReducerAdapter<
  State,
  Action extends { type: string; payload?: any }
>(reducer: Reducer<State, Action>) {
  return <Adapters extends Record<string, (payload: any) => Action>>(
    adapters: Adapters
  ) => {
    return (
      state: State,
      action:
        | Exclude<Action, { type: keyof Adapters }>
        | {
            [Type in keyof Adapters]: {
              type: Type;
              payload: Parameters<Adapters[Type]>[0];
            }
          }[keyof Adapters]
    ) => {
      if (Object.prototype.hasOwnProperty.call(adapters, action.type)) {
        return reducer(state, adapters[action.type](action));
      } else {
        return reducer(state, action as Action);
      }
    };
  };
}
