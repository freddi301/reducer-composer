import { createReducer } from "./createReducer";
import { DeepReadonly } from "./utility";

export function createReducerOnAction<
  State,
  Action extends { type: string; payload?: any }
>() {
  return <
    Handlers extends {
      [Type in Action["type"]]: (
        state: DeepReadonly<State>,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => DeepReadonly<State>
    }
  >(
    handlers: Handlers
  ) =>
    createReducer<State>()(handlers as {
      [Type in keyof Handlers]: (
        state: DeepReadonly<State>,
        payload: Extract<Action, { type: Type }>["payload"]
      ) => DeepReadonly<State>
    });
}
