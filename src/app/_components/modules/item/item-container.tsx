"use client";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import CloudinaryImage from "../../shared/cloudinary-image";
import { ItemUpdateModal } from "./item-update-modal";
import { ItemDeleteModal } from "./item-delete-modal";
import { ItemAddCommentModal } from "./item-add-comment-modal";
import { ItemUpdateCommentModal } from "./item-update-comment-modal";
import Container from "../../shared/container";

type Props = {
  itemId: string;
};

function ItemContainer(props: Props) {
  const { itemId } = props;
  const [item] = api.item.getUserItem.useSuspenseQuery(itemId);

  if (!item) {
    redirect("/");
  }

  return (
    <div className="flex max-w-screen-2xl flex-col gap-4 p-8">
      <Container className="p-4">
        <Header vtag="h4">{item.title}</Header>
      </Container>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex min-w-64 flex-col items-center gap-4 md:max-w-64">
          <div className="md:aspect-[29/40]">
            {item.image ? (
              <CloudinaryImage publicId={item.image} className="mx-auto" />
            ) : (
              <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
            )}
          </div>

          <ItemUpdateModal item={item} />
          <ItemAddCommentModal item={item} />
          <ItemAddCommentModal item={item} />
        </div>

        <div className="flex w-full flex-col gap-4">
          <Container className="flex-col p-4">
            <Header vtag="h6">Plot:</Header>
            <Paragraph className="text-muted-foreground">
              {item.description}
            </Paragraph>
          </Container>
          {item.tags.length ? (
            <Container className="flex-col p-4">
              <Header vtag="h6">Tags:</Header>
              <Paragraph className="text-muted-foreground">
                {item.tags.map((tag) => tag.name).join(", ")}
              </Paragraph>
            </Container>
          ) : null}

          {item.comments?.map((comment, index) => (
            <ItemUpdateCommentModal comment={comment} key={index} />
          ))}
        </div>
        <div className="flex flex-col gap-4 md:w-64">
          <Container className="w-full flex-col gap-4 p-4 md:w-64">
            <div className="flex flex-col">
              <Header vtag="h6">Collection:</Header>
              <Paragraph className="text-muted-foreground">
                {item.collection}
              </Paragraph>
            </div>
            <div className="flex flex-col">
              <Header vtag="h6">Year:</Header>
              <Paragraph className="text-muted-foreground">
                {item.year}
              </Paragraph>
            </div>
            {item.fieldGroups?.map((group) => (
              <div key={group.name} className="flex flex-col">
                <Header vtag="h6">
                  {group.name
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </Header>
                {group.fields.map((field) => (
                  <Paragraph key={field} className="text-muted-foreground">
                    {field}
                  </Paragraph>
                ))}
              </div>
            ))}
          </Container>

          <ItemDeleteModal item={item} />
        </div>
      </div>
    </div>
  );
}
export { ItemContainer };
