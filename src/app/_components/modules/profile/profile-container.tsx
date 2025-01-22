"use client";

import { api } from "../../../../trpc/react";
import { ProfileUpdateUserModal } from "./profile-update-user-modal";

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6 p-8">
      <ProfileUpdateUserModal user={user} />
    </div>
  );
}
export { ProfileContainer };
