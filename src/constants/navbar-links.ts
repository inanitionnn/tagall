import { Folders, House, LibraryBig, type LucideIcon, Tags } from "lucide-react";

type NavbarLinkType = {
  icon: LucideIcon;
  title: string;
  href: string;
};

const NAVBAR_LINKS: NavbarLinkType[] = [
  {
    icon: House,
    href: "/",
    title: "Home",
  },
  {
    icon: LibraryBig,
    href: "/collections",
    title: "Collections",
  },
  {
    icon: Folders,
    href: "/groups",
    title: "Groups",
  },
  {
    icon: Tags,
    href: "/tags",
    title: "Tags",
  },
];

export { NAVBAR_LINKS };
