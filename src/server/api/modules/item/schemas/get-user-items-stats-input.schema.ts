import { z } from "zod";

export const GetUserItemsStatsInputSchema = z
  .array(z.string().cuid())
  .default([]);
