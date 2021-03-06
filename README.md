# reducer-composer

Compose your reducers **effortlessly**, with **intellisense** and **strict type-checking**.

## Usage

[![Edit reducer-composer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/52zq6r02ln?hidenavigation=1&view=editor)

```typescript
import {
  createReducer,
  createCombinedReducer,
  createReducerSequence,
  createBatchReducer,
  createKeyedReducer,
  createReducerCrudHandlers,
  createReducerOnAction,
  ActionOfReducer,
  ignore
} from "reducer-composer";

interface User {
  id: string;
  name: string;
  birth: Date;
}

const user = createReducer<User>()({
  USER_CHANGE_NAME(user, { name }: { name: string }) {
    return { ...user, name };
  },
  USER_CHANGE_BIRTH(user, { birth }: { birth: Date }) {
    return { ...user, birth };
  }
});

const click = createReducer<number>()({
  CLICK(clicks) {
    return clicks + 1;
  },
  CLICK_SET(_, { clicks }: { clicks: number }) {
    return clicks;
  }
});

const userClick = createCombinedReducer({
  user,
  click
});

const userClickBatchReducer = createBatchReducer("CLICKS", userClick);

const usersReducer = createKeyedReducer("id", user);

const companyUsers = createReducerSequence(
  usersReducer,
  createReducer<Record<string, User>>()({
    USER_ADD(state, user: User) {
      return { ...state, [user.id]: user };
    }
  })
);

const usersCounter = createReducerOnAction<
  number,
  ActionOfReducer<typeof companyUsers>
>()({
  USER_ADD(count) {
    return count + 1;
  },
  USER_CHANGE_BIRTH: ignore,
  USER_CHANGE_NAME: ignore
});

interface Car {
  id: string;
  name: string;
  km: number;
}
const carCrud = createReducerCrudHandlers(
  (payload: Car) => [payload.id, payload],
  (payload: { id: string }) => payload.id
);
const car = createReducer<Record<string, Car>>()({
  CAR_ADD: carCrud.create,
  CAR_UPDATE: carCrud.update,
  CAR_DESTROY: carCrud.discard
});
```

[more usage](src/usage.ts)

## Todo

[ ] remove deprecated methods
[ ] change createReducer signature in favor of createHandlers
[ ] documentation
[ ] dtslint tests
[ ] jest tests
[ ] performance tests

## License MIT
