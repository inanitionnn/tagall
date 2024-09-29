"use client";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";
import { Badge } from "../../ui";
import { CreateTagDrawer } from "./create-tag-drawer";

type Props = {
  tagCategoryId: string;
  tags: {
    name: string;
    tagCategoryId: string;
    id: string;
    createdAt: Date;
  }[];
};

const TagList = (props: Props) => {
  const { tags, tagCategoryId } = props;
  const parent = useRef(null);

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);
  return (
    <div ref={parent} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={"outline"}
          className="hover:cursor-pointer hover:border-transparent hover:bg-destructive hover:text-destructive-foreground"
        >
          {tag.name}
        </Badge>
      ))}
      <CreateTagDrawer tagCategoryId={tagCategoryId} />
    </div>
  );
};

export { TagList };
