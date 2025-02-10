export const isLetter = (char: string): boolean => {
  return /^[a-zA-Zа-яА-Я]$/.test(char);
};
