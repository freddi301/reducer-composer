import { createReducer } from "./createReducer";

export function createReducerOnAction<
  Action extends { type: string; payload?: any }
>() {
  return <
    State,
    Handlers extends {
      [Type in Action["type"]]: (
        state: State,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => State
    },
    Effective extends Partial<Handlers>
  >(
    initial: State,
    handlers: Effective
  ) =>
    createReducer(initial, handlers as {
      [Type in keyof Effective]: (
        state: State,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => State
    });
}
