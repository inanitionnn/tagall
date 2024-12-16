import { z } from "zod";

export const DeleteFromCollectionInputSchema = z.string().cuid();
