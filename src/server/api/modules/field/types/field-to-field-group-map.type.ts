import type { FieldGroup } from "@prisma/client";

export type FieldToFieldGroupMapType = Record<
  string,
  Omit<FieldGroup, "isFiltering">
>;
