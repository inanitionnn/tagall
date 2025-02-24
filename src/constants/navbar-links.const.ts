import {
  BadgePlus,
  CodeXml,
  Dices,
  House,
  Tags,
  type LucideIcon,
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
    icon: BadgePlus,
    href: "/add",
    title: "Add",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    icon: Dices,
    href: "/random",
    title: "Random",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    icon: CodeXml,
    href: "/parse",
    title: "Parse",
  },
  {
    type: "divider",
  },
  {
    type: "link",
    icon: Tags,
    href: "/tag",
    title: "Tags",
  },
];

export { NAVBAR_LINKS };
