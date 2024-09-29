"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Header,
  Input,
  Paragraph,
} from "../../ui";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1).max(64),
});

type Props = {
  tagCategoryId: string;
};

const CreateTagDrawer = (props: Props) => {
  const { tagCategoryId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string[];
    priority?: string[];
  }>({});

  const utils = api.useUtils();
  const createTag = api.tag.create.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
      setName(null);
    },
  });

  const handleCreate = () => {
    const data = {
      tagCategoryId,
      name: name ?? "",
    };
    const validationResult = tagSchema.safeParse(data);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setIsOpen(false);
      console.log("data", data);
      toast.promise(createTag.mutateAsync(data), {
        loading: "Creating category...",
        success: "Category created successfully!",
        error: (error) => `Failed to create category: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    if (name !== null) {
      const data = { name };
      const validationResult = tagSchema.safeParse(data);
      if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors);
      } else {
        setErrors({});
      }
    }
  }, [name]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Button variant="outline" size={"icon"} className="rounded-full">
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <DrawerHeader className="w-full gap-4">
            <Header vtag="h5">New Tag</Header>
            <Input
              placeholder="Category name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <Paragraph className="text-destructive">
                {errors.name[0]}
              </Paragraph>
            )}
          </DrawerHeader>
          <DrawerFooter className="w-full flex-row">
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button
              disabled={!!Object.values(errors).length}
              className="w-full"
              onClick={handleCreate}
            >
              Create
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateTagDrawer };
