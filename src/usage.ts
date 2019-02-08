import {
  createReducer,
  createCombinedReducer,
  StateOfReducer,
  ActionOfReducer,
  createKeyedReducer,
  createReducerSequence,
  createReducerOnAction,
  Reducer,
  createBatchReducer,
  ignore,
  createReducerCrudHandlers
} from "reducer-composer";

// createReducer

interface User {
  id: string;
  name: string;
  birth: Date;
}
const userInitialState: User = {
  id: "",
  name: "",
  birth: new Date()
};
const userReducer = createReducer<User>()({
  USER_CHANGE_NAME(user, { name }: { name: string }) {
    return { ...user, name };
  },
  USER_CHANGE_BIRTH(user, { birth }: { birth: Date }) {
    return { ...user, birth };
  }
});
userReducer(userInitialState, {
  type: "USER_CHANGE_BIRTH",
  payload: { birth: new Date() }
});
userReducer(userInitialState, {
  type: "USER_CHANGE_NAME",
  payload: { name: "John" }
});

type Click = number;
const clickInitialState: Click = 0;
const clickReducer = createReducer<Click>()({
  CLICK(clicks) {
    return clicks + 1;
  },
  CLICK_SET(_, { clicks }: { clicks: number }) {
    return clicks;
  }
});
clickReducer(clickInitialState, { type: "CLICK" });
clickReducer(clickInitialState, { type: "CLICK_SET", payload: { clicks: 42 } });

// createCombinedReducer

const userClickReducer = createCombinedReducer({
  user: userReducer,
  click: clickReducer
});
type UserClickState = StateOfReducer<typeof userClickReducer>;
type UserClickAction = ActionOfReducer<typeof userClickReducer>;
const userClickInitialState: UserClickState = {
  click: clickInitialState,
  user: userInitialState
};
userClickReducer(userClickInitialState, {
  type: "CLICK_SET",
  payload: { clicks: 42 }
});
userClickReducer(userClickInitialState, {
  type: "USER_CHANGE_NAME",
  payload: { name: "John" }
});
const nestedUserClickReducer = createCombinedReducer({
  nested: userClickReducer
});

// createBatchReducer

const userClickBatchReducer = createBatchReducer("CLICKS", userClickReducer);
userClickBatchReducer(userClickInitialState, { type: "CLICK" });
userClickBatchReducer(userClickInitialState, {
  type: "CLICKS",
  payload: [
    { type: "CLICK" },
    { type: "USER_CHANGE_NAME", payload: { name: "Doe" } }
  ]
});

// keyedReducer

const usersReducer = createKeyedReducer("id", userReducer);
usersReducer(
  {},
  { type: "USER_CHANGE_NAME", payload: { id: "42", name: "John Doe" } }
);

// createReducerSequence

const usersInitialState: Record<string, User> = {};
const usersReducerWithAdd = createReducerSequence(
  usersReducer,
  createReducer<Record<string, User>>()({
    USER_ADD(state, user: User) {
      return { ...state, [user.id]: user };
    }
  })
);
usersReducerWithAdd(
  {},
  { type: "USER_CHANGE_NAME", payload: { id: "42", name: "John Doe" } }
);
usersReducerWithAdd(
  {},
  { type: "USER_ADD", payload: { id: "42", name: "John", birth: new Date() } }
);

const multitenantUsersReducer = createKeyedReducer(
  "company",
  usersReducerWithAdd
);
multitenantUsersReducer(
  {},
  {
    type: "USER_ADD",
    payload: { id: "42", birth: new Date(), company: "galaxy", name: "John" }
  }
);
multitenantUsersReducer(
  {},
  {
    type: "USER_CHANGE_BIRTH",
    payload: { id: "42", company: "galaxy", birth: new Date() }
  }
);

// createReducerOnAction

type UsersWithAddAction = ActionOfReducer<typeof usersReducerWithAdd>;
const usersActionCounterReducer = createReducerOnAction<
  number,
  UsersWithAddAction
>()({
  USER_ADD(count) {
    return count + 1;
  },
  USER_CHANGE_BIRTH: ignore,
  USER_CHANGE_NAME: ignore
});
usersActionCounterReducer(0, {
  type: "USER_ADD",
  payload: { id: "42", name: "John", birth: new Date() }
});

// createReducerCrudHandlers

interface Car {
  id: string;
  name: string;
  km: number;
}
const carCrud = createReducerCrudHandlers(
  (payload: Car) => [payload.id, payload],
  (payload: { id: string }) => payload.id
);
const carReducer = createReducer<Record<string, Car>>()({
  CAR_ADD: carCrud.create,
  CAR_UPDATE: carCrud.update,
  CAR_DESTROY: carCrud.discard
});

interface Rent {
  id: string;
  user: string;
  car: string;
  date: Date;
}
const rentReducer = createReducer<Rent>()({
  RENT_CHANGE_USER(state, { user }: { user: string }) {
    return { ...state, user };
  }
});
const rentKeyedReducer = createKeyedReducer("id", rentReducer);
const rentsCrud = createReducerCrudHandlers<Rent, Rent, { id: string }>(
  rent => [rent.id, rent],
  ({ id }) => id
);
const rentsCrudReducer = createReducer<Record<string, Rent>>()({
  RENT: rentsCrud.create,
  RENT_CANCEL: rentsCrud.delete
});
const rentsReducer = createReducerSequence(rentKeyedReducer, rentsCrudReducer);

const carRentCompanyReducer = createCombinedReducer({
  users: usersReducerWithAdd,
  cars: carReducer,
  rents: rentsReducer
});
type CarRentCompanyState = StateOfReducer<typeof carRentCompanyReducer>;
const carRentCompanyInitialState: CarRentCompanyState = {
  users: {},
  cars: {},
  rents: {}
};
type CarRentCompanyAction = ActionOfReducer<typeof carRentCompanyReducer>;
const carWishDispatch = (_: CarRentCompanyAction) => {
  return;
};
carWishDispatch({
  type: "USER_ADD",
  payload: { id: "42", birth: new Date(), name: "John" }
});
carWishDispatch({
  type: "CAR_ADD",
  payload: { id: "74", km: 0, name: "Delorean" }
});
carWishDispatch({
  type: "RENT",
  payload: { id: "89", car: "74", date: new Date(), user: "42" }
});
carWishDispatch({
  type: "RENT_CHANGE_USER",
  payload: { id: "89", user: "56" }
});
const getRentData = (
  { cars, rents, users }: CarRentCompanyState,
  rentId: string
) => {
  const { id, date, user, car } = rents[rentId];
  return { id, date, car: cars[car], user: users[user] };
};

const postCondition: Reducer<CarRentCompanyState, CarRentCompanyAction> = (
  state = carRentCompanyInitialState
) => {
  const { cars, rents, users } = state;
  for (const { id, car, user } of Object.values(rents)) {
    if (!cars[car]) {
      throw new Error(`missing car: ${car} for rent: ${id}`);
    }
    if (!users[user]) {
      throw new Error(`missing user: ${user} for rent: ${id}`);
    }
  }
  return state;
};
function get<Key extends string>(key: Key) {
  return <Value, O extends { [K in Key]: Value }>(o: O) => o[key];
}
const precondition = createReducerOnAction<
  CarRentCompanyState,
  CarRentCompanyAction
>()({
  CAR_DESTROY(state, { id }) {
    const { rents } = state;
    const referencedRents = Object.values(rents)
      .filter(({ car }) => car === id)
      .map(get("id"));
    if (referencedRents.length) {
      throw new Error(
        `Cannot destroy Car: ${id} because it is referenced by rents: ${referencedRents.join(
          ", "
        )}`
      );
    }
    return state;
  },
  CAR_ADD: ignore,
  CAR_UPDATE: ignore,
  RENT: ignore,
  RENT_CANCEL: ignore,
  RENT_CHANGE_USER: ignore,
  USER_ADD: ignore,
  USER_CHANGE_BIRTH: ignore,
  USER_CHANGE_NAME: ignore
});

const safeCarRentCompanyReducer = createReducerSequence(
  precondition,
  carRentCompanyReducer,
  postCondition
);

const transactionalSafeCarRentCompanyReducer = createBatchReducer(
  "CAR_TRANSACTION",
  safeCarRentCompanyReducer
);

transactionalSafeCarRentCompanyReducer(carRentCompanyInitialState, {
  type: "CAR_TRANSACTION",
  payload: [
    {
      type: "USER_ADD",
      payload: { id: "2", name: "Batman", birth: new Date() }
    },
    { type: "CAR_ADD", payload: { id: "1", name: "Bat-mobile", km: 0 } },
    {
      type: "RENT",
      payload: { id: "3", date: new Date(), car: "1", user: "2" }
    }
  ]
});

// crazy stuff down here

const referentialIntegrity = guarantees<CarRentCompanyState>()
  .dictionary(s => s.rents) // autocompletion works
  .field(get("car")) // correctly typechecks every step
  .refers.to.dictionary(get("cars")) // fluent API
  .key();

export function guarantees<State>() {
  return {
    dictionary<OriginItem>(
      originDictionarySelector: (state: State) => Record<string, OriginItem>
    ) {
      return {
        field(originFieldSelector: (item: OriginItem) => string) {
          return {
            refers: {
              to: {
                dictionary<DestinationItem>(
                  destinationDictionarySelector: (
                    state: State
                  ) => Record<string, DestinationItem>
                ) {
                  return {
                    key() {
                      return (
                        state: State
                      ):
                        | { type: "ok" }
                        | {
                            type: "error";
                            message: string;
                            missing: Record<string, string>;
                          } => {
                        const origin = originDictionarySelector(state);
                        const destination = destinationDictionarySelector(
                          state
                        );
                        const missingForeignKeys = Object.entries(
                          origin
                        ).reduce((memo, [originKey, originItem]) => {
                          const originValue = originFieldSelector(originItem);
                          const isMissing = originValue in destination;
                          if (isMissing) {
                            return { ...memo, [originKey]: originValue };
                          } else {
                            return memo;
                          }
                        }, {});
                        if (Object.keys(missingForeignKeys).length) {
                          return {
                            type: "error",
                            message: "referential integrity corrupted",
                            missing: missingForeignKeys
                          };
                        } else {
                          return { type: "ok" };
                        }
                      };
                    }
                  };
                }
              }
            }
          };
        }
      };
    }
  };
}
