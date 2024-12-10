import { api, HydrateClient } from "../../../trpc/server";
import { AddContainer } from "../../_components/modules";

export default async function Add() {
  void api.collection.getAll.prefetch();

  return (
    <HydrateClient>
      <AddContainer />
    </HydrateClient>
  );
}
