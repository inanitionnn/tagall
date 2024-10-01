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
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

const tagCategorySchema = z.object({
  name: z.string().min(1).max(64),
});

type Props = {
  id: string;
  name: string | null;
};

const UpdateTagDrawer = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(props.name);
  const [errors, setErrors] = useState<{
    name?: string[];
    priority?: string[];
  }>({});

  const utils = api.useUtils();
  const updateTag = api.tag.update.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
    },
  });

  const submit = () => {
    const data = {
      id: props.id,
      name: name ?? "",
    };
    const validationResult = tagCategorySchema.safeParse(data);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setIsOpen(false);
      toast.promise(updateTag.mutateAsync(data), {
        loading: "Updating category...",
        success: "Category updated successfully!",
        error: (error) => `Failed to update category: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    if (name !== null) {
      const data = { name };
      const validationResult = tagCategorySchema.safeParse(data);
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
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full justify-start gap-2"
        >
          <Pencil size={16} />
          Update
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <DrawerHeader className="w-full gap-4">
            <Header vtag="h5">Update Tag</Header>
            <Input
              autoFocus
              placeholder="Category name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
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
              onClick={submit}
            >
              Update
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { UpdateTagDrawer };
