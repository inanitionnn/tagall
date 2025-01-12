export type FilterFieldsType = {
  id: string;
  name: string;
  priority: number;
  fields: {
    value: string;
    id: string;
  }[];
};
