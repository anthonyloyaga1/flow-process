export function entityHasDifferences<DTO, ENTITY>(updateDto: DTO, entity: ENTITY) {
  const updatedData = Object.assign({}, entity, updateDto);
  return JSON.stringify(updatedData) !== JSON.stringify(entity);
}

export function updateData<DTO, ENTITY>(updateDto: DTO, entity: ENTITY) {
  return Object.assign(entity, updateDto);
}
