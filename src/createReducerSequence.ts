import { Reducer } from "./utility";

export function createReducerSequence<
  State,
  Reducers extends Reducer<any, any>[]
>(
  ...reducers: Reducers &
    Reducer<State, any>[] &
    {
      [K in keyof Reducers]: Reducers[K] extends Reducer<State, infer Action>
        ? Reducer<
            State,
            Extract<
              Parameters<Reducers[number]>[1],
              { type: Action["type"]; payload?: any }
            >
          >
        : unknown
    }
): Reducer<State, Parameters<Reducers[number]>[1]> {
  return (state, action) =>
    reducers.reduce((state, reducer) => reducer(state, action), state);
}
