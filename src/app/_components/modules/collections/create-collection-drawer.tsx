"use client";

import {
  Badge,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Header,
  Input,
  Paragraph,
} from "../../ui";
import { ImagePlus, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";
import { SelectTagCategoryDialog } from "./select-tag-category-dialog";
import { TAG_ICONS } from "~/constants/tag-icons.const";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";

const formSchema = z.object({
  name: z.string().min(1).max(64),
  image: z.instanceof(File),
});

const CreateCollectionDrawer = () => {
  const [categories] = api.tagCategory.getAll.useSuspenseQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    [],
  );

  const utils = api.useUtils();
  const createCollection = api.collection.create.useMutation({
    onSuccess: async () => {
      await utils.collection.invalidate();
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      image: new File([""], "filename"),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = {
      name: data.name,
      tagCategoriesIds: selectedCategoriesIds,
    };
    setIsOpen(false);
    toast.promise(createCollection.mutateAsync(formData), {
      loading: "Creating collection...",
      success: "Collection created successfully!",
      error: (error) => `Failed to create collection: ${error.message}`,
    });
  };

  // image logic
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        form.setValue("image", file);
        form.clearErrors("image");
      } else {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 5000000,
      accept: {
        "image/png": [],
        "image/jpg": [],
        "image/jpeg": [],
        "image/webp": [],
      },
    });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Button variant="outline" className="gap-2">
          <Plus /> Collection
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Header vtag="h5">Create Collection</Header>
        <DrawerHeader className="w-full gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2"
                      >
                        {preview && (
                          <img
                            src={preview as string}
                            alt="Uploaded image"
                            className="max-h-40 rounded-lg"
                          />
                        )}
                        <ImagePlus
                          className={`size-8 ${preview ? "hidden" : "block"}`}
                        />
                        <Input {...getInputProps()} type="file" />
                        {isDragActive ? (
                          <p>Drop the image!</p>
                        ) : (
                          <p>Click here or drag an image to upload it</p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage>
                      {fileRejections.length !== 0 && (
                        <p className="text-center">
                          Image must be less than 5MB and of type png, jpg,
                          webp, or jpeg
                        </p>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Enter collection name"
                        {...form.register("name")}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Paragraph className="font-medium" vsize={"lg"}>
                  Categories:{" "}
                </Paragraph>
                {categories.map((category) => {
                  if (selectedCategoriesIds.includes(category.id)) {
                    const Icon = category.icon
                      ? TAG_ICONS[category.icon]
                      : null;
                    return (
                      <Badge
                        key={category.id}
                        className="h-10 gap-2 rounded-md"
                        variant={"outline"}
                      >
                        {Icon && <Icon size={16} className="min-w-4" />}
                        <Paragraph>{category.name}</Paragraph>
                      </Badge>
                    );
                  }
                })}

                <SelectTagCategoryDialog
                  selectedCategories={selectedCategoriesIds}
                  setSelectedCategories={setSelectedCategoriesIds}
                />
              </div>
            </form>
          </Form>
        </DrawerHeader>
        <DrawerFooter className="w-full flex-row">
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            disabled={form.formState.isSubmitting}
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateCollectionDrawer };
