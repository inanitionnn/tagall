import { RATING_NAMES } from "./rate-names.const";

export const TIER_ROWS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const;

export const TIER_LABELS: Record<number, string> = {
  10: `10 - ${RATING_NAMES[10]}`,
  9: `9 - ${RATING_NAMES[9]}`,
  8: `8 - ${RATING_NAMES[8]}`,
  7: `7 - ${RATING_NAMES[7]}`,
  6: `6 - ${RATING_NAMES[6]}`,
  5: `5 - ${RATING_NAMES[5]}`,
  4: `4 - ${RATING_NAMES[4]}`,
  3: `3 - ${RATING_NAMES[3]}`,
  2: `2 - ${RATING_NAMES[2]}`,
  1: `1 - ${RATING_NAMES[1]}`,
  0: `Pool - ${RATING_NAMES[0]}`,
} as const;
