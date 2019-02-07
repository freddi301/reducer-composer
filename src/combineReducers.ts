import { Reducer, Values } from "./utility";
import { createReducer } from "./createReducer";

export function combineReducers<
  Reducers extends Record<string, Reducer<any, any>>
>(
  reducers: Reducers &
    {
      [K in keyof Reducers]: Reducer<
        Parameters<Reducers[K]>[0],
        Values<
          {
            [I in keyof Reducers]: Extract<
              Parameters<Reducers[I]>[1],
              { type: Parameters<Reducers[K]>[1]["type"]; payload?: any }
            >
          }
        >
      >
    }
): Reducer<
  { [K in keyof Reducers]: Parameters<Reducers[K]>[0] },
  Values<{ [K in keyof Reducers]: Parameters<Reducers[K]>[1] }>
> {
  return (state, action) => {
    const result = {} as { [K in keyof Reducers]: Parameters<Reducers[K]>[0] };
    for (const key of Object.keys(reducers) as Array<keyof Reducers>) {
      result[key] = reducers[key](state[key], action);
    }
    return result as any;
  };
}
