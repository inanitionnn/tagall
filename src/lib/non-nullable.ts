export function NonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

export function Truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}
