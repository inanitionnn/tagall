import Link from "next/link";
import { Button, Paragraph } from "../../ui";
import { cn } from "~/lib/utils";

type NavbarButtonProps = {
  title: string;
  icon: React.ReactNode;
  pathname: string;
  isActive: boolean;
};

const NavbarButton = (props: NavbarButtonProps) => {
  const { icon, pathname, title, isActive } = props;
  return (
    <Link
      className="w-full"
      href={{
        pathname: pathname,
      }}
    >
      <Button
        size={"navbar"}
        variant={isActive ? "default" : "ghost"}
        className="w-full justify-start gap-4"
      >
        {icon}
        <Paragraph
          vsize={"base"}
          className={cn(
            "truncate text-wrap text-start font-medium leading-tight",
            {
              "font-semibold": isActive,
            },
          )}
        >
          {title}
        </Paragraph>
      </Button>
    </Link>
  );
};

export { NavbarButton };
