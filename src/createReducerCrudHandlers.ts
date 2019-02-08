import { DeepReadonly } from "./utility";

export function createReducerCrudHandlers<Entity, EntityPayload, KeyPayload>(
  entitySelector: (payload: EntityPayload) => [string, Entity],
  keySelector: (payload: KeyPayload) => string
) {
  const withEntity = (
    f: (
      record: DeepReadonly<Record<string, Entity>>,
      key: string,
      entity: DeepReadonly<Entity>
    ) => DeepReadonly<Record<string, Entity>>
  ) => (
    record: DeepReadonly<Record<string, Entity>>,
    payload: EntityPayload
  ) => {
    const [key, entity] = entitySelector(payload);
    return f(record, key, (entity as unknown) as DeepReadonly<Entity>);
  };
  const withKey = (
    f: (
      record: DeepReadonly<Record<string, Entity>>,
      key: string
    ) => DeepReadonly<Record<string, Entity>>
  ) => (record: DeepReadonly<Record<string, Entity>>, payload: KeyPayload) =>
    f(record, keySelector(payload));
  return {
    create: withEntity((state, key, entity) => {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        throw new Error();
      }
      return { ...state, [key]: entity };
    }),
    update: withEntity((state, key, entity) => {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        return { ...state, [key]: entity };
      }
      throw new Error();
    }),
    delete: withKey((state, key) => {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        const { [key]: removed, ...rest } = state;
        return rest as DeepReadonly<Record<string, Entity>>;
      }
      throw new Error();
    }),
    upsert: withEntity((state, key, entity) => {
      return { ...state, [key]: entity };
    }),
    discard: withKey((state, key) => {
      const { [key]: removed, ...rest } = state;
      return rest as DeepReadonly<Record<string, Entity>>;
    })
  };
}
