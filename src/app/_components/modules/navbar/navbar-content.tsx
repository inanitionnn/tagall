"use client";
import React, { type ComponentPropsWithRef } from "react";
import { Avatar, AvatarFallback, AvatarImage, Header } from "../../ui";
import { cn } from "~/lib";
import { LogIn, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { NavbarButton } from "./navbar-button";
import { NAVBAR_LINKS } from "~/constants";

type Props = ComponentPropsWithRef<"div">;

const NavbarContent = (props: Props) => {
  const { className, ...restProps } = props;
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-4 p-6",
        className,
      )}
      {...restProps}
    >
      <Header vtag="h4">Tagall</Header>
      <div className="flex flex-col gap-4">
        {Object.values(NAVBAR_LINKS).map((value) => (
          <NavbarButton
            key={value.href}
            icon={<value.icon />}
            pathname={value.href}
            title={value.title}
            isActive={pathname === value.href}
          />
        ))}
      </div>

      {session?.user.id ? (
        <NavbarButton
          icon={
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
          }
          pathname={"/profile"}
          title={session?.user.name ?? "Profile"}
          isActive={pathname === "/profile"}
        />
      ) : (
        <NavbarButton
          isLink={false}
          icon={<LogIn />}
          pathname={"/login"}
          title={"Login"}
          isActive={true}
          onClick={() => signIn("google")}
        />
      )}
    </div>
  );
};

export { NavbarContent };
