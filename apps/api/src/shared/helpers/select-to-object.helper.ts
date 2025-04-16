/**
 * Convierte un array de strings en un objeto de selección compatible con TypeORM.
 * @param selectArray - Array de strings que representan los campos a seleccionar.
 * @returns Un objeto de selección compatible con TypeORM.
 */
export function convertSelectToObject(select?: string): any {
  if (!select) return;

  const selectArray = select?.split(',');
  if (!selectArray || selectArray.length === 0) return {};

  const selectObject = {};

  selectArray.forEach((path) => {
    const keys = path.split('.');
    let currentLevel = selectObject;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentLevel[key] = true;
      } else {
        if (!currentLevel[key] || typeof currentLevel[key] !== 'object') {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  });

  return selectObject;
}

/**
 * Extrae las relaciones necesarias a partir de un array de strings.
 * @param selectArray - Array de strings que representan los campos a seleccionar.
 * @returns Un array de relaciones necesarias.
 */
function convertSelectToRelationsArray(select: string): string[] {
  if (!select) return;

  const selectArray = select.split(',');
  const relationsSet = new Set<string>();

  selectArray.forEach((path) => {
    const keys = path.split('.');

    keys.forEach((_key, index) => {
      if (index < keys.length - 1) {
        const relationPath = keys.slice(0, index + 1).join('.');
        relationsSet.add(relationPath);
      }
    });
  });

  return Array.from(relationsSet);
}

/**
 * Convierte un array de relaciones en un objeto anidado con `true` al final de cada relación.
 * @param relationsArray - Array de strings que representan las relaciones.
 * @returns Un objeto anidado con `true` al final de cada relación.
 */
export function convertSelectToRelationsObject(select: string) {
  if (!select) return;

  const relationsArray = convertSelectToRelationsArray(select);

  const relationsObject = {};

  relationsArray.forEach((path) => {
    const keys = path.split('.');
    let currentLevel = relationsObject;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentLevel[key] = true;
      } else {
        if (!currentLevel[key] || typeof currentLevel[key] !== 'object') {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  });

  return relationsObject;
}
