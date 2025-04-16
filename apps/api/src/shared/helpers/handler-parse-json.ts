export function parseOrNull(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

export function stringifyOrNull(json: any) {
  try {
    return JSON.stringify(json);
  } catch (error) {
    return null;
  }
}
