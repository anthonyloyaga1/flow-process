export function parseToCamelCase(data: any[]): any[] {
  return data.map((item) => {
    const newItem = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newItem[camelCaseKey] = item[key];
      }
    }
    return newItem;
  });
}
