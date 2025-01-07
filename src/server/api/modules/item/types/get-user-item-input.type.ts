import { type z } from 'zod';
import { type GetUserItemInputSchema } from '../schemas';

export type GetUserItemInputType = z.infer<typeof GetUserItemInputSchema>;
