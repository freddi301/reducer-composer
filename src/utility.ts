export type Values<O> = O[keyof O];
export type ArrayValues<A> = A extends Array<infer Value> ? Value : unknown;

export type Reducer<State, Action extends { type: string; payload?: any }> = (
  state: State,
  action: Action
) => State;

export type ActionOfReducer<R extends Reducer<any, any>> = Parameters<R>[1];
export type StateOfReducer<R extends Reducer<any, any>> = Parameters<R>[0];

export function ignore<State>(state: State, action?: any) {
  return state;
}
