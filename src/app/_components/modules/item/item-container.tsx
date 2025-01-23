"use client";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import { ItemUpdateModal } from "./item-update-modal";
import { ItemDeleteModal } from "./item-delete-modal";
import { ItemAddCommentModal } from "./item-add-comment-modal";
import { ItemUpdateCommentModal } from "./item-update-comment-modal";
import { Container, CloudinaryImage } from "../../shared";
import { ItemUpdateTagsModal } from "./item-update-tags-modal";
import Link from "next/link";
import { useGetUserTags } from "../../../../hooks";

type Props = {
  itemId: string;
};

function ItemContainer(props: Props) {
  const { itemId } = props;
  const [item] = api.item.getUserItem.useSuspenseQuery(itemId);

  if (!item) {
    redirect("/");
  }

  const { tags } = useGetUserTags({
    collectionsIds: [item.collection.id],
  });

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 p-8">
      <Container className="p-4">
        <Header vtag="h4">{item.title}</Header>
      </Container>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex min-w-64 flex-col items-center gap-4 md:max-w-64">
              <div className="md:aspect-[27/40]">
                {item.image ? (
                  <CloudinaryImage
                    publicId={item.image}
                    className="mx-auto"
                    folder={item.collection.name}
                  />
                ) : (
                  <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
                )}
              </div>

              <ItemUpdateModal item={item} />
              <ItemAddCommentModal item={item} />
            </div>

            <div className="flex w-full flex-col gap-4">
              <Container className="flex-col p-4">
                <Header vtag="h6">Plot:</Header>
                <Paragraph className="text-muted-foreground">
                  {item.description}
                </Paragraph>
              </Container>

              <ItemUpdateTagsModal tags={tags} item={item} />

              {item.comments?.map((comment, index) => (
                <ItemUpdateCommentModal comment={comment} key={index} />
              ))}
            </div>
          </div>
          <Container className="flex-col gap-4 p-4">
            <Header vtag="h6">Similar Items:</Header>

            <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
              {item.similarItems.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`}>
                  <Container
                    key={item.id}
                    className="h-full flex-col hover:scale-105 md:w-full"
                  >
                    <div className="aspect-[27/40]">
                      {item.image ? (
                        <CloudinaryImage
                          publicId={item.image}
                          folder={item.collection.name}
                        />
                      ) : (
                        <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
                      )}
                    </div>
                    <div className="flex h-full items-center justify-center p-2">
                      <Header vtag="h6" className="line-clamp-3 text-center">
                        {item.title}
                      </Header>
                    </div>
                  </Container>
                </Link>
              ))}
            </div>
          </Container>
        </div>
        <div className="flex flex-col gap-4 md:w-64">
          <Container className="w-full flex-col gap-4 p-4 md:w-64">
            <div className="flex flex-col">
              <Header vtag="h6">Collection:</Header>
              <Paragraph className="text-muted-foreground">
                {item.collection.name}
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
