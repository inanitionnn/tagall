"use client";

import { signIn } from "next-auth/react";
import { Header } from "../../ui";
import { CloudinaryImage, CardContainer } from "../../shared";
import type { User } from "@prisma/client";
import type { ItemsStatsType } from "../../../../server/api/modules/item/types";
import { ProfileStatusStats } from "../profile/profile-status-stats";
import { ProfileRateStats } from "../profile/profile-rate-stats";

type Props = {
  user: User;
  stats: ItemsStatsType | undefined;
  isStatsLoading: boolean;
};

export const PublicUserHeader = (props: Props) => {
  const { user, stats, isStatsLoading } = props;

  const handleAvatarClick = () => {
    void signIn("google");
  };

  return (
    <CardContainer className="flex flex-col gap-4 p-8">
      {/* User Info */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div
          onClick={handleAvatarClick}
          className="flex-shrink-0 cursor-default"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleAvatarClick();
            }
          }}
        >
          {user.image ? (
            <CloudinaryImage
              publicId={user.image}
              folder="profile"
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-primary" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Header vtag="h4">{user.name}</Header>
        </div>
      </div>

      {/* Stats Section */}
      {stats && !isStatsLoading && (  
        <div className="gap-4 flex ">
          <ProfileStatusStats all={stats.all} statusStats={stats.status} />
          <ProfileRateStats rateStats={stats.rate} />
        </div>
      )}
    </CardContainer>
  );
};
