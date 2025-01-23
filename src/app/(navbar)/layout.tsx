import { Suspense } from "react";
import { Navbar } from "../_components/modules";
import LoadingPage from "../loading";
import { api } from "../../trpc/server";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void api.user.getUser.prefetch();
  return (
    <>
      <Navbar>
        <Suspense fallback={<LoadingPage />}>{children}</Suspense>
      </Navbar>
    </>
  );
}
