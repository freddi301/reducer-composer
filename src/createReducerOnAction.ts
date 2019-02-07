import { createReducer } from "./createReducer";

export function createReducerOnAction<
  State,
  Action extends { type: string; payload?: any }
>() {
  return <
    Handlers extends {
      [Type in Action["type"]]: (
        state: State,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => State
    }
  >(
    handlers: Handlers
  ) =>
    createReducer<State>()(handlers as {
      [Type in keyof Handlers]: (
        state: State,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => State
    });
}
