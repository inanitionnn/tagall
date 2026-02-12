"use client";
import {
  Button,
  Header,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Form,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui";
import { useRef, useState, useEffect } from "react";
import { CardContainer } from ".";
import type { ItemType } from "../../../server/api/modules/item/types";
import { useUpdateItemImage } from "../../../hooks/mutations/use-update-item-image.hook";
import Image from "next/image";
import { Upload, Link as LinkIcon, ClipboardPaste } from "lucide-react";

type Props = {
  item: ItemType;
  children: React.ReactNode;
};

const UpdateItemImageModal = (props: Props) => {
  const { item, children } = props;
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pastedImage, setPastedImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("file");

  const file = useRef<HTMLInputElement>(null);

  const { form, submit } = useUpdateItemImage({
    item,
    file,
    setOpen,
    imageUrl,
    pastedImage,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPreviewImage(URL.createObjectURL(selectedFile));
      form.setValue("imageSource", "file");
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    if (url) {
      setPreviewImage(url);
      form.setValue("imageSource", "url");
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          setPastedImage(blob);
          setPreviewImage(URL.createObjectURL(blob));
          form.setValue("imageSource", "paste");
          setActiveTab("paste");
        }
      }
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener("paste", handlePaste as any);
    }
    return () => {
      window.removeEventListener("paste", handlePaste as any);
    };
  }, [open]);

  const openFilePicker = () => {
    file.current?.click();
  };

  const isSubmitDisabled = () => {
    if (form.formState.isSubmitting) return true;
    const source = form.getValues("imageSource");
    if (source === "file") return !file.current?.files?.[0];
    if (source === "url") return !imageUrl;
    if (source === "paste") return !pastedImage;
    return true;
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        {children}
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4"
          >
            <Header vtag="h4">Update cover</Header>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">
                  <Upload className="mr-2 h-4 w-4" />
                  File
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="paste">
                  <ClipboardPaste className="mr-2 h-4 w-4" />
                  Paste
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <input
                  type="file"
                  ref={file}
                  onChange={handleFileChange}
                  accept="image/*,.png,.jpg,.jpeg,.gif,.webp"
                  className="hidden"
                />
                <CardContainer
                  className="flex cursor-pointer items-center justify-center p-8 hover:bg-accent/50"
                  onClick={openFilePicker}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {file.current?.files?.[0]?.name || "Click to select file"}
                    </p>
                  </div>
                </CardContainer>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  type="url"
                />
              </TabsContent>

              <TabsContent value="paste" className="space-y-4">
                <CardContainer className="flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardPaste className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {pastedImage
                        ? pastedImage.name || "Image pasted"
                        : "Press Ctrl+V (or Cmd+V) to paste"}
                    </p>
                  </div>
                </CardContainer>
              </TabsContent>
            </Tabs>

            {previewImage && (
              <CardContainer className="p-4">
                <div className="flex justify-center">
                  <div className="aspect-[27/40] w-48">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={200}
                      height={300}
                      className="h-full w-full rounded-sm object-cover object-center"
                    />
                  </div>
                </div>
              </CardContainer>
            )}

            <Button className="w-full" disabled={isSubmitDisabled()}>
              Upload cover
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { UpdateItemImageModal };
