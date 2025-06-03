export const field_metadata = new Map<string, Record<string, unknown>>();

export function ESField(options: Record<string, unknown>) {
  return function (target: object, propertyKey: string) {
    const class_name = target.constructor.name;

    if (!field_metadata.has(class_name)) {
      field_metadata.set(class_name, {});
    }
    field_metadata.get(class_name)![propertyKey] = options;
  };
}
