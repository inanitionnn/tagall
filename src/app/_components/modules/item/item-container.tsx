"use client";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import CloudinaryImage from "../../shared/cloudinary-image";
import { ItemUpdateModal } from "./item-update-modal";
import { ItemDeleteModal } from "./item-delete-modal";
import { ItemAddCommentModal } from "./item-add-comment-modal";
import { ItemUpdateCommentModal } from "./item-update-comment-modal";

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
      <div className="grid-cols-[256px_auto] grid-rows-1 gap-4 space-y-4 md:grid md:space-y-0">
        <div className="w-full md:aspect-[29/40]">
          {item.image ? (
            <CloudinaryImage publicId={item.image} className="mx-auto" />
          ) : (
            <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex h-full flex-col gap-2 rounded-lg border border-zinc-300 bg-background p-8 shadow focus:border-primary dark:border-zinc-700">
          <Header vtag="h4">{item.title}</Header>
          <Paragraph className="text-muted-foreground">
            {item.description}
          </Paragraph>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 md:w-64">
          <ItemUpdateModal item={item} />
          <ItemAddCommentModal item={item} />

          <div className="flex flex-col gap-4 md:hidden">
            {item.comments?.map((comment, index) => (
              <ItemUpdateCommentModal comment={comment} key={index} />
            ))}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-zinc-300 bg-background p-4 shadow focus:border-primary dark:border-zinc-700 md:w-64">
            <div className="flex flex-col">
              <Header vtag="h6">Year:</Header>
              <Paragraph className="text-muted-foreground">
                {item.year}
              </Paragraph>
            </div>
            {item.fieldGroups.map((group) => (
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
          </div>

          <ItemDeleteModal item={item} />
        </div>
        <div className="hidden w-full flex-col gap-4 md:flex">
          {item.comments?.map((comment, index) => (
            <ItemUpdateCommentModal comment={comment} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
export { ItemContainer };
