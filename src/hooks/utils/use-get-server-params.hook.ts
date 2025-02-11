"use server";
import { headers } from "next/headers";

export const useGetServerParams = <T extends Record<string, any>>(): T => {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";
  const searchParams = new URLSearchParams(header_url.split("?")[1]);

  const queryParams: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    try {
      queryParams[key] = JSON.parse(value);
    } catch {
      queryParams[key] = value;
    }
  });

  return queryParams as T;
};
