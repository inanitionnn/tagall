import { cn } from "~/lib";
import { Button, Header, Paragraph, Wrapper } from "../../ui";
import { Bot, Ellipsis, Flag } from "lucide-react";
import { TAG_ICONS } from "~/constants/tag-icons";
import { forwardRef } from "react";
import { TagList } from "./tag-list";

type Props = {
  id: string;
  isAuto: boolean;
  title: string;
  tags: {
    name: string;
    tagCategoryId: string;
    id: string;
    createdAt: Date;
  }[];
  titleIcon: string | null;
  priority: number;
};

const TagCategoryBlock = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, isAuto, title, titleIcon, tags, priority } = props;
  const Icon = titleIcon ? TAG_ICONS[titleIcon] : null;
  return (
    <Wrapper ref={ref} className={cn({ "rounded-r-none": isAuto })}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={32} />}
          <Header vtag="h5">{title}</Header>
          <Paragraph vsize={"base"} className="text-border">
            |
          </Paragraph>
          <div className="flex items-center gap-1">
            <Flag size={16} />
            <Paragraph vsize={"base"}>{priority}</Paragraph>
          </div>
          {isAuto && (
            <>
              <Paragraph vsize={"base"} className="text-border">
                |
              </Paragraph>
              <div className="flex items-center gap-1">
                <Bot size={16} />
                <Paragraph vsize={"base"}>Auto</Paragraph>
              </div>
            </>
          )}
        </div>
        <Button size="icon" variant={"ghost"} className="h-8">
          <Ellipsis />
        </Button>
      </div>
      <TagList tags={tags} tagCategoryId={id} />
    </Wrapper>
  );
});

export { TagCategoryBlock };
