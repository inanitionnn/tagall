"use client";

import { api } from "../../trpc/react";

export const useGetPublicUser = () => {
  return api.user.getPublicUser.useQuery();
};
