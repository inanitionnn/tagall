import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { GetAll, GetUserCollections } from './services';

export const CollectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(GetAll),
  getUserCollections: protectedProcedure.query(GetUserCollections),
});
