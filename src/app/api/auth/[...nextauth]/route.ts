import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

// Force dynamic so Next.js does not try to statically resolve this catch-all route at build
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
