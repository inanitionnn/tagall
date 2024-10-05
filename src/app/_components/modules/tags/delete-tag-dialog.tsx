"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Header,
  Paragraph,
} from "../../ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
type Props = {
  id: string;
};

const DeleteTagDialog = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const deleteTag = api.tag.delete.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
    },
  });

  const submit = () => {
    setIsOpen(false);
    toast.promise(deleteTag.mutateAsync(props.id), {
      loading: "Deleting category...",
      success: "Category delete successfully!",
      error: (error) => `Failed to delete tag: ${error.message}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full justify-start gap-2"
        >
          <Trash2 size={16} /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm gap-4">
        <div className="flex flex-col">
          <Header vtag="h5">Are you sure?</Header>
          <Paragraph>This action cannot be undone.</Paragraph>
        </div>

        <Button
          variant={"default"}
          onClick={() => {
            setIsOpen(false);
            submit();
          }}
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteTagDialog };
