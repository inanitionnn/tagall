"use client";
import { api } from "~/trpc/react";
import { TagCategoryBlock } from "./tag-category-block";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";

const TagCategoryList = () => {
  const [categories] = api.tagCategory.getAll.useSuspenseQuery();
  const parent = useRef(null);

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);
  return (
    <div ref={parent} className="flex flex-col gap-6">
      {categories.map((category) => (
        <TagCategoryBlock key={category.id} {...category} />
      ))}
    </div>
  );
};

export { TagCategoryList };
