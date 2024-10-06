import {
  BadgePlus,
  Dices,
  Folders,
  House,
  LibraryBig,
  type LucideIcon,
  Tags,
} from "lucide-react";

type NavbarLinkType =
  | {
      type: "link";
      icon: LucideIcon;
      title: string;
      href: string;
    }
  | {
      type: "divider";
    };

const NAVBAR_LINKS: NavbarLinkType[] = [
  {
    type: "link",
    icon: House,
    href: "/",
    title: "Home",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    icon: LibraryBig,
    href: "/collections",
    title: "Collections",
  },
  {
    type: "link",
    icon: Folders,
    href: "/groups",
    title: "Groups",
  },
  {
    type: "link",
    icon: Tags,
    href: "/tags",
    title: "Tags",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    icon: BadgePlus,
    href: "/create",
    title: "Create",
  },
  {
    type: "link",
    icon: Dices,
    href: "/random",
    title: "Random",
  },
];

export { NAVBAR_LINKS };
