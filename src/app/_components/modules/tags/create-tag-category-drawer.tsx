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
import { type LucideIcon, Minus, Plus } from "lucide-react";
import { SelectTagIconDialog } from "./select-tag-icon-dialog";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

const tagCategorySchema = z.object({
  name: z.string().min(1).max(64),
  priority: z.number().min(0).max(100).optional(),
});

const CreateTagCategoryDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState<LucideIcon | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isAuto, setIsAuto] = useState<boolean>(false);
  const [priority, setPriority] = useState<number>(0);
  const [errors, setErrors] = useState<{
    name?: string[];
    priority?: string[];
  }>({});

  const utils = api.useUtils();
  const createCategory = api.tagCategory.create.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
      setName(null);
      setIcon(null);
      setIsAuto(false);
      setPriority(0);
    },
  });

  const handleCreate = () => {
    const data = {
      name: name ?? "",
      icon: icon?.displayName,
      isAuto,
      priority,
    };
    const validationResult = tagCategorySchema.safeParse(data);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setIsOpen(false);
      toast.promise(createCategory.mutateAsync(data), {
        loading: "Creating category...",
        success: "Category created successfully!",
        error: (error) => `Failed to create category: ${error.message}`,
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
        <Button variant="outline" className="gap-2">
          <Plus /> Add category
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <DrawerHeader className="w-full gap-4">
            <Header vtag="h5">New Tag Category</Header>
            <div className="flex items-center gap-4">
              <SelectTagIconDialog
                SelectedIcon={icon}
                setSelectedIcon={setIcon}
              />
              <Input
                placeholder="Category name"
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && (
              <Paragraph className="text-destructive">
                {errors.name[0]}
              </Paragraph>
            )}
            <div className="flex items-center gap-2">
              <Paragraph className="font-medium" vsize={"lg"}>
                Auto:{" "}
              </Paragraph>
              <Switch checked={isAuto} onCheckedChange={(e) => setIsAuto(e)} />
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

export { CreateTagCategoryDrawer };
