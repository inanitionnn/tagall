"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  session: Session | null | undefined;
};
export function Wrapper(props: Props) {
  const { children, session } = props;
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
