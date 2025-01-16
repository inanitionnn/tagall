"use client";

import { signOut } from "next-auth/react";
import { api } from "../../../../trpc/react";

export default function Profile() {
  const {} = api.parse.getDetails.useQuery();
  return <button onClick={() => signOut()}>logout</button>;
}
