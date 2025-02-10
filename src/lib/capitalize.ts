export const capitalize = (val: string | number | null) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};
