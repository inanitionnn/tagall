"use client";

import { signOut } from "next-auth/react";

export default function Profile() {
  return <button onClick={() => signOut()}>logout</button>;
}
