import { type z } from 'zod';
import { type AddToCollectionInputSchema } from '../schemas';

export type AddToCollectionInputType = z.infer<
  typeof AddToCollectionInputSchema
>;
