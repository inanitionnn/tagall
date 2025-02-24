import type { ReadonlyURLSearchParams } from "next/navigation";

export const mergeSearchParams = (
  newParams: object,
  searchParams?: ReadonlyURLSearchParams,
) => {
  const newSearchParams = new URLSearchParams(
    searchParams ? searchParams.toString() : "",
  );

  Object.entries(newParams).forEach(([key, value]) => {
    if (!value) {
      newSearchParams.delete(key);
    } else if (typeof value === "object") {
      newSearchParams.set(key, JSON.stringify(value));
    } else {
      newSearchParams.set(key, String(value));
    }
  });

  const search = newSearchParams.toString();

  return search ? `?${search}` : "";
};
