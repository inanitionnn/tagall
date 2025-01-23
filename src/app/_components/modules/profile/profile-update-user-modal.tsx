"use client";
import {
  Button,
  Header,
  Input,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Paragraph,
} from "../../ui";
import { useRef, useState } from "react";
import { Container, CloudinaryImage } from "../../shared";
import type { User } from "@prisma/client";
import { useUpdateUser } from "../../../../hooks/use-update-user.hook";
import Image from "next/image";
import { UserRound } from "lucide-react";

type Props = {
  user: User;
};

const ProfileUpdateUserModal = (props: Props) => {
  const { user } = props;
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  const file = useRef<HTMLInputElement>(null);

  const { form, submit } = useUpdateUser({
    user,
    file,
    setOpen,
    isFile: !removeImage,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const openFilePicker = () => {
    file.current?.click();
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Container className="cursor-pointer flex-col items-center gap-4 p-4 hover:scale-105 sm:flex-row sm:gap-8">
          <div className="aspect-square w-28 rounded-full border border-input">
            {user.image ? (
              <CloudinaryImage
                folder={"profile"}
                publicId={user.image}
                className="aspect-square h-full w-full rounded-full"
              />
            ) : (
              <>
                <div className="flex aspect-square h-full w-full items-center justify-center rounded-full">
                  <UserRound className="size-10" />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2 text-center sm:text-start">
            <Header vtag="h4"> {user.name}</Header>
            <Paragraph className="text-muted-foreground">
              {user.email}
            </Paragraph>
          </div>
        </Container>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="p-4і flex w-full flex-col justify-between gap-4 rounded-sm bg-background sm:min-w-96"
          >
            <Header vtag="h4" className=" ">
              Update user
            </Header>

            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Cool guy"
                        max={255}
                        {...form.register("name")}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <input
                    type="file"
                    ref={file}
                    onChange={handleFileChange}
                    accept="image/*,.pnh,.jpg,.gif,.webp"
                    className="hidden"
                  />
                  <div className="flex flex-col gap-2">
                    <FormLabel>Image:</FormLabel>
                    <Container
                      className="flex cursor-pointer justify-between gap-2 px-4"
                      onClick={openFilePicker}
                    >
                      <Paragraph className="my-auto w-full">
                        {file.current?.files?.[0]?.name || "Select file"}
                      </Paragraph>
                      <div className="aspect-square w-28 rounded-full border border-input">
                        {file && previewImage ? (
                          <Image
                            src={previewImage}
                            alt="Profile image"
                            width={200}
                            height={200}
                            className="h-full w-full rounded-full object-cover object-center"
                          />
                        ) : user.image && !removeImage ? (
                          <CloudinaryImage
                            folder={"profile"}
                            publicId={user.image}
                            className="h-full w-full rounded-full"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full">
                            <UserRound className="size-10" />
                          </div>
                        )}
                      </div>
                    </Container>
                    <Button
                      variant={"destructive"}
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewImage("");
                        if (file?.current) {
                          file.current.value = "";
                        }
                        setRemoveImage(true);
                      }}
                    >
                      Remove file
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Update
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ProfileUpdateUserModal };
