export function crud<KeyAttribute extends string>(keyAttribute: KeyAttribute) {
  return <Entity extends { [K in KeyAttribute]: string }>() => {
    return {
      create(state: Record<string, Entity>, entity: Entity) {
        if (entity[keyAttribute] in state) {
          throw new Error();
        }
        return { ...state, [entity[keyAttribute]]: entity };
      },
      update(state: Record<string, Entity>, entity: Entity) {
        if (entity[keyAttribute] in state) {
          return { ...state, [entity[keyAttribute]]: entity };
        }
        throw new Error();
      },
      delete(
        state: Record<string, Entity>,
        entity: { [K in KeyAttribute]: string }
      ) {
        if (entity[keyAttribute] in state) {
          const { [entity[keyAttribute]]: removed, ...rest } = state;
          return rest as Record<string, Entity>;
        }
        throw new Error();
      },
      upsert(state: Record<string, Entity>, entity: Entity) {
        return { ...state, [entity[keyAttribute]]: entity };
      },
      discard(
        state: Record<string, Entity>,
        entity: { [K in KeyAttribute]: string }
      ) {
        const { [entity[keyAttribute]]: removed, ...rest } = state;
        return rest as Record<string, Entity>;
      }
    };
  };
}
