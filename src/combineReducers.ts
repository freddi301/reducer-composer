import { Reducer, Values } from "./UtilityTypes";

export function combineReducers<
  Reducers extends {
    [K in keyof Reducers]: Reducer<
      Parameters<Reducers[K]>[0],
      Parameters<Reducers[K]>[1]
    >
  }
>(
  reducers: Reducers
): Reducer<
  { [K in keyof Reducers]: Exclude<Parameters<Reducers[K]>[0], undefined> },
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
