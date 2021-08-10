export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const assignDefined = (target?: unknown, source?: unknown) => {
  if (!isObject(target) || !isObject(source)) return;

  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined) return;
    target[key] = value;
  });
};
