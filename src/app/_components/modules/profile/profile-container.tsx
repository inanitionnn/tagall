"use client";

import { useRef, useState } from "react";
import { Button, Header, Paragraph } from "../../ui";
import { signOut } from "next-auth/react";
import { env } from "../../../../env";
import { api } from "../../../../trpc/react";
import Container from "../../shared/container";
import Image from "next/image";

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();

  // const uploadImage = (files: any) => {
  //   const formData = new FormData();

  //   formData.append("file", files[0]);
  //   formData.append("upload_preset", "tagall_profile");
  //   fetch(
  //     `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //     {
  //       method: "POST",
  //       body: formData,
  //     },
  //   )
  //     .then((response) => response.json())
  //     // .then((data) => {
  //     //   setImage(data.secure_url);
  //     // });
  // };

  const filePicker = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Створюємо URL для попереднього перегляду
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const openFilePicker = () => {
    filePicker.current?.click();
  };
  return (
    <>
      <input
        type="file"
        ref={filePicker}
        onChange={handleFileChange}
        accept="image/*,.pnh,.jpg,.gif,.webp"
        className="hidden"
      />
      <Container>
        <div className="aspect-[1/1] w-56 rounded-full border border-input">
          {!user.image ? (
            // <CloudinaryImage
            //   folder={"profile"}
            //   publicId={user.image}
            //   className="h-full w-full"
            // />
            <></>
          ) : (
            <Image
              src={previewImage || user.image}
              alt="Profile image"
              width={200}
              height={200}
              className="h-full w-full rounded-full object-cover object-center"
              onClick={openFilePicker}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Header vtag="h4"> {user.name}</Header>
          <Paragraph className="text-muted-foreground">{user.email}</Paragraph>
        </div>
      </Container>

      <Button onClick={() => signOut()}>Sigout</Button>
    </>
  );
}
export { ProfileContainer };
