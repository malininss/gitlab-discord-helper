const toCamelCase = (s: string) =>
  s.replace(/(_\w)/g, (m) => m[1].toUpperCase());

export const transformKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamelCase);
  }

  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        transformKeysToCamelCase(value),
      ])
    );
  }

  return obj;
};
