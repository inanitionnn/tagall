"use client";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";
import { CreateTagDrawer } from "./create-tag-drawer";
import { TagMenu } from "./tag-menu";

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
        <TagMenu key={tag.id} {...tag} />
      ))}
      <CreateTagDrawer tagCategoryId={tagCategoryId} />
    </div>
  );
};

export { TagList };
