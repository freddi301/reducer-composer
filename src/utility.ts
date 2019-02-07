export type Values<O> = O[keyof O];

export type Reducer<State, Action extends { type: string; payload?: any }> = (
  state: State,
  action: Action
) => State;

export type ActionOfReducer<R extends Reducer<any, any>> = Parameters<R>[1];
export type StateOfReducer<R extends Reducer<any, any>> = ReturnType<R>;

export function ignore<State>(state: State) {
  return state;
}
