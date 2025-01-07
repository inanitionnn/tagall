import { type z } from 'zod';
import { type DeleteFromCollectionInputSchema } from '../schemas';

export type DeleteFromCollectionInputType = z.infer<
  typeof DeleteFromCollectionInputSchema
>;
