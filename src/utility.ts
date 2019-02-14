export type Values<O> = O[keyof O];

export type Reducer<State, Action extends { type: string; payload?: any }> = (
  state: State,
  action: Action
) => State;

export type ActionOfReducer<R extends Reducer<any, any>> = Parameters<R>[1];
export type StateOfReducer<R extends Reducer<any, any>> = ReturnType<R>;

export interface DeepReadonlyArray<A> extends ReadonlyArray<DeepReadonly<A>> {}
export type DeepReadonlyObject<A> = {
  readonly [K in keyof A]: DeepReadonly<A[K]>
};
export type DeepReadonly<A> = A extends Array<infer B>
  ? DeepReadonlyArray<B>
  : DeepReadonlyObject<A>;

export function ignore<State>(state: State) {
  return state;
}

export function get<Attribute extends string>(attribute: Attribute) {
  return <Value>(object: { [K in Attribute]: Value }) => object[attribute];
}

export function actionOfType<ActionType extends string>(
  actionType: ActionType
) {
  return <Payload>(payload: Payload) => ({ type: actionType, payload });
}

export function runActionsOnReducer<
  State,
  Action extends { type: string; payload?: any }
>(reducer: Reducer<State, Action>, state: State, actions: Action[]) {
  return actions.reduce(reducer, state);
}

export class Description<Desc> {
  private constructor(private description: Desc) {}
}
export function description<Desc>() {
  return <Item>(item: Item) => item as Description<Desc> & Item;
}
export type DescriptionOf<
  Item extends Description<any>
> = Item extends Description<infer Desc> ? Desc : unknown;
