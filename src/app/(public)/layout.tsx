import { getServerAuthSession } from "../../server/auth";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  
  // If user is already authenticated, redirect to auth home
  if (session?.user) {
    redirect("/home");
  }
  
  return <>{children}</>;
}
