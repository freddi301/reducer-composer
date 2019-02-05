import { Values } from "./UtilityTypes";

export function createReducer<
  State,
  Handlers extends Record<string, (state: State, payload: any) => State>
>(initial: State, handlers: Handlers) {
  return (
    state: State = initial,
    action: Values<
      {
        [Type in keyof Handlers]: Parameters<
          Handlers[Type]
        >[1] extends undefined
          ? { type: Type; payload?: undefined }
          : { type: Type; payload: Parameters<Handlers[Type]>[1] }
      }
    >
  ) =>
    action.type in handlers
      ? handlers[action.type](state, action.payload)
      : state;
}