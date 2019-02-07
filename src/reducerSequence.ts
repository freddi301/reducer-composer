import { Reducer, ActionOfReducer, ArrayValues } from "./utility";

export function reducerSequence<
  State,
  Reducers extends Array<Reducer<State, any>>
>(reducers: Reducers & Array<Reducer<State, any>>) {
  return (state: State, action: ActionOfReducer<ArrayValues<Reducers>>) =>
    reducers.reduce((state, reducer) => reducer(state, action), state);
}
