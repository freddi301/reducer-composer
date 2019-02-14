import { description } from "./utility";
import { createBatchHandler } from "./createBatchHandler";

export function createReducerCrudHandlers<Entity, EntityPayload, KeyPayload>(
  entitySelector: (payload: EntityPayload) => [string | number, Entity],
  keySelector: (payload: KeyPayload) => string | number
) {
  const withEntity = (
    f: (
      record: Record<string, Entity>,
      key: string | number,
      entity: Entity
    ) => Record<string, Entity>
  ) => (record: Record<string, Entity>, payload: EntityPayload) => {
    const [key, entity] = entitySelector(payload);
    return f(record, key, entity);
  };
  const withKey = (
    f: (
      record: Record<string, Entity>,
      key: string | number
    ) => Record<string, Entity>
  ) => (record: Record<string, Entity>, payload: KeyPayload) =>
    f(record, keySelector(payload));
  const create = withEntity((state, key, entity) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      throw new Error();
    }
    return { ...state, [key]: entity };
  });
  const update = withEntity((state, key, entity) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      return { ...state, [key]: entity };
    }
    throw new Error();
  });
  const delet = withKey((state, key) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      const { [key]: removed, ...rest } = state;
      return rest;
    }
    throw new Error();
  });
  const upsert = description<"add item if not exists, update otherwise">()(
    withEntity((state, key, entity) => {
      return { ...state, [key]: entity };
    })
  );
  const discard = description<"remove item if exists, nothing otherwise">()(
    withKey((state, key) => {
      const { [key]: removed, ...rest } = state;
      return rest;
    })
  );
  return {
    create,
    update,
    delete: delet,
    upsert,
    discard,
    batch: {
      create: createBatchHandler(create),
      update: createBatchHandler(update),
      delete: createBatchHandler(delet),
      upsert: createBatchHandler(upsert),
      discard: createBatchHandler(upsert)
    }
  };
}
