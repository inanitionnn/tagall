import { cn } from "~/lib";
import { Header, Paragraph, Wrapper } from "../../ui";
import { Bot, BotMessageSquare, Flag, Plus } from "lucide-react";
import { TAG_ICONS } from "~/constants/tag-icons";
import { forwardRef } from "react";
import { TagList } from "./tag-list";
import { TagCategoryMenu } from "./tag-category-menu";

type Props = {
  id: string;
  autoAddToElement: boolean;
  autoAddTags: boolean;
  name: string;
  tags: {
    name: string;
    tagCategoryId: string;
    id: string;
    createdAt: Date;
  }[];
  icon: string | null;
  priority: number;
};

const TagCategoryBlock = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, autoAddTags, autoAddToElement, name, icon, tags, priority } =
    props;
  const Icon = icon ? (TAG_ICONS[icon] ?? null) : null;
  return (
    <Wrapper ref={ref}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="min-h-6 min-w-6 md:min-h-8 md:min-w-8" />}
            <Header vtag="h5">{name}</Header>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Flag size={16} />
              <Paragraph vsize={"base"}>{priority}</Paragraph>
            </div>
            {autoAddToElement && (
              <>
                <Paragraph vsize={"base"} className="text-border">
                  |
                </Paragraph>
                <div className="flex items-center gap-1">
                  <BotMessageSquare size={16} />
                  <Paragraph vsize={"base"}>To Elements</Paragraph>
                </div>
              </>
            )}
            {autoAddTags && (
              <>
                <Paragraph vsize={"base"} className="text-border">
                  |
                </Paragraph>
                <div className="flex items-center gap-1">
                  <Bot size={16} />
                  <Paragraph vsize={"base"}>New tags</Paragraph>
                </div>
              </>
            )}
          </div>
        </div>

        <TagCategoryMenu {...props} icon={Icon} />
      </div>
      <TagList tags={tags} tagCategoryId={id} />
    </Wrapper>
  );
});

export { TagCategoryBlock };
