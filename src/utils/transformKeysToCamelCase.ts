const toCamelCase = (s: string): string =>
  s.replace(/(_\w)/g, (m) => m[1].toUpperCase());

type Transformable = Record<string, unknown> | Record<string, unknown>[];

function isTransformable(obj: unknown): obj is Transformable {
  return (
    (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) ||
    Array.isArray(obj)
  );
}

export const transformKeysToCamelCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamelCase);
  } else if (isTransformable(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        transformKeysToCamelCase(value),
      ])
    );
  }
  return obj;
};
