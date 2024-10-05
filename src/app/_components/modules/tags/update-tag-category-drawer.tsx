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
  Switch,
} from "../../ui";
import { type LucideIcon, Minus, Pencil, Plus } from "lucide-react";
import { SelectTagIconDialog } from "./select-tag-icon-dialog";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

const tagCategorySchema = z.object({
  name: z.string().min(1).max(64),
  priority: z.number().min(0).max(100).optional(),
});

type Props = {
  id: string;
  icon: LucideIcon | null;
  name: string | null;
  autoAddToElement: boolean;
  autoAddTags: boolean;
  priority: number;
};

const UpdateTagCategoryDrawer = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState<LucideIcon | null>(props.icon);
  const [name, setName] = useState<string | null>(props.name);
  const [autoAddToElement, setAutoAddToElement] = useState<boolean>(
    props.autoAddToElement,
  );
  const [autoAddTags, setAutoAddTags] = useState<boolean>(props.autoAddTags);
  const [priority, setPriority] = useState<number>(props.priority);
  const [errors, setErrors] = useState<{
    name?: string[];
    priority?: string[];
  }>({});

  const utils = api.useUtils();
  const updateCategory = api.tagCategory.update.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
    },
  });

  const submit = () => {
    const data = {
      id: props.id,
      name: name ?? "",
      icon: icon?.displayName,
      priority,
      autoAddToElement,
      autoAddTags,
    };
    const validationResult = tagCategorySchema.safeParse(data);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setIsOpen(false);
      toast.promise(updateCategory.mutateAsync(data), {
        loading: "Updating category...",
        success: "Category updated successfully!",
        error: (error) => `Failed to update category: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    if (name !== null) {
      const data = { name, priority };
      const validationResult = tagCategorySchema.safeParse(data);
      if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors);
      } else {
        setErrors({});
      }
    }
  }, [name, priority]);

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
            <Header vtag="h5">Update Tag Category</Header>
            <div className="flex items-center gap-4">
              <SelectTagIconDialog
                SelectedIcon={icon}
                setSelectedIcon={setIcon}
              />
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
            </div>
            {errors.name && (
              <Paragraph className="text-destructive">
                {errors.name[0]}
              </Paragraph>
            )}

            <div className="flex items-center gap-2">
              <Paragraph className="font-medium" vsize={"lg"}>
                Auto add new tags:{" "}
              </Paragraph>
              <Switch
                checked={autoAddTags}
                onCheckedChange={(e) => setAutoAddTags(e)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Paragraph className="font-medium" vsize={"lg"}>
                Auto add tags to elements:{" "}
              </Paragraph>
              <Switch
                checked={autoAddToElement}
                onCheckedChange={(e) => setAutoAddToElement(e)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Paragraph vsize={"lg"} className="mr-2 font-medium">
                Priority:{" "}
              </Paragraph>
              <Button
                disabled={priority <= 0}
                size={"icon"}
                className="min-w-10"
                onClick={() => {
                  if (priority > 100) {
                    setPriority(100);
                  } else {
                    setPriority((prev) => prev - 1);
                  }
                }}
              >
                <Minus />
              </Button>
              <Input
                type="number"
                value={priority}
                max={100}
                min={0}
                className="w-full text-lg font-medium"
                onChange={(e) => setPriority(parseInt(e.target.value))}
              />
              <Button
                size={"icon"}
                disabled={priority >= 100}
                className="min-w-10"
                onClick={() => {
                  if (priority < 0) {
                    setPriority(0);
                  } else {
                    setPriority((prev) => prev + 1);
                  }
                }}
              >
                <Plus />
              </Button>
            </div>
            {errors.priority && (
              <Paragraph className="text-destructive">
                {errors.priority[0]}
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

export { UpdateTagCategoryDrawer };
