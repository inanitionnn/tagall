import { getServerAuthSession } from "../../../server/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sesstion = await getServerAuthSession();
  if (!sesstion?.user) {
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
}
