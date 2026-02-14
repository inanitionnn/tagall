"use client";

import { api } from "../../trpc/react";

export const useGetPublicUserCollections = () => {
  return api.collection.getPublicUserCollections.useQuery();
};
