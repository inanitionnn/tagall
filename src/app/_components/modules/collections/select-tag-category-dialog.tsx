"use client";
import { Button, Dialog, DialogContent, DialogTrigger, Header } from "../../ui";
import { Plus } from "lucide-react";
import { TAG_ICONS } from "~/constants/tag-icons.const";
import { type Dispatch, type SetStateAction, useState } from "react";
import { api } from "~/trpc/react";

type Props = {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};

const SelectTagCategoryDialog = (props: Props) => {
  const { selectedCategories, setSelectedCategories } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [categories] = api.tagCategory.getAll.useSuspenseQuery();

  const onSelectCategory = (categoryId: string) => {
    const categoriesSet = new Set(selectedCategories);
    if (categoriesSet.has(categoryId)) {
      categoriesSet.delete(categoryId);
    } else {
      categoriesSet.add(categoryId);
    }
    setSelectedCategories(Array.from(categoriesSet));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size={"icon"} type="button">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <Header vtag="h3" className="text-center">
          Tag Categories
        </Header>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const Icon = category.icon ? TAG_ICONS[category.icon] : null;
            return (
              <Button
                key={category.id}
                size={"sm"}
                type="button"
                variant={
                  selectedCategories.includes(category.id) ? "default" : "ghost"
                }
                onClick={() => {
                  onSelectCategory(category.id);
                }}
                className="gap-2"
              >
                {Icon && <Icon />}
                {category.name}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant={"ghost"}
            onClick={() => setSelectedCategories([])}
            size={"lg"}
          >
            Clear
          </Button>
          <Button
            type="button"
            size={"lg"}
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectTagCategoryDialog };
