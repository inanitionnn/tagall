import { signOut } from "next-auth/react";
import { Header } from "~/app/_components/ui";

export default function Collections() {
  return (
    <div className="space-y-8">
      <div className="flex items-end gap-16">
        <Header vtag="h2" className="leading-tight">
          Collections
        </Header>
        <button onClick={() => signOut()}>Sign out</button>
      </div>{" "}
    </div>
  );
}
