import type { ItemStatus } from "@prisma/client";

export type ItemsDateStatsType = {
  month: string;
  created: number;
  updated: number;
};

export type ItemsStatusStatsType = {
  status: ItemStatus;
  count: number;
};

export type ItemsRateStatsType = {
  rate: number;
  count: number;
};

export type ItemsStatsType = {
  date: ItemsDateStatsType[];
  status: ItemsStatusStatsType[];
  rate: ItemsRateStatsType[];
  all: number;
};
