import { Suspense } from "react";
import { Navbar } from "../_components/modules";
import Loaging from "../loading";
import { api } from "../../trpc/server";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void api.user.getUser.prefetch();
  return (
    <>
      <Navbar>
        <Suspense fallback={<Loaging />}>{children}</Suspense>
      </Navbar>
    </>
  );
}
