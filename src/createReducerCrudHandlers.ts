export function createReducerCrudHandlers<Entity, EntityPayload, KeyPayload>(
  entitySelector: (payload: EntityPayload) => [string, Entity],
  keySelector: (payload: KeyPayload) => string
) {
  const withEntity = (
    f: (
      record: Record<string, Entity>,
      key: string,
      entity: Entity
    ) => Record<string, Entity>
  ) => (record: Record<string, Entity>, payload: EntityPayload) =>
    f(record, ...entitySelector(payload));
  const withKey = (
    f: (record: Record<string, Entity>, key: string) => Record<string, Entity>
  ) => (record: Record<string, Entity>, payload: KeyPayload) =>
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
        return rest as Record<string, Entity>;
      }
      throw new Error();
    }),
    upsert: withEntity((state, key, entity) => {
      return { ...state, [key]: entity };
    }),
    discard: withKey((state, key) => {
      const { [key]: removed, ...rest } = state;
      return rest as Record<string, Entity>;
    })
  };
}
