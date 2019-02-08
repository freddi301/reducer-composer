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
export function get<Attribute extends string>(attribute: Attribute) {
  return <Value>(object: { [K in Attribute]: Value }) => object[attribute];
}

export interface DeepReadonlyArray<A> extends ReadonlyArray<DeepReadonly<A>> {}

export type DeepReadonlyObject<A> = {
  readonly [K in keyof A]: DeepReadonly<A[K]>
};

export type DeepReadonly<A> = A extends Array<infer B>
  ? DeepReadonlyArray<B>
  : DeepReadonlyObject<A>;
