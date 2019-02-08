import { Values, DeepReadonly } from "./utility";

export function createReducer<State>() {
  return <
    Handlers extends Record<
      string,
      (state: DeepReadonly<State>, payload: any) => DeepReadonly<State>
    >
  >(
    handlers: Handlers
  ) => {
    return (
      state: DeepReadonly<State>,
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
      Object.prototype.hasOwnProperty.call(handlers, action.type)
        ? handlers[action.type](state, action.payload)
        : state;
  };
}
