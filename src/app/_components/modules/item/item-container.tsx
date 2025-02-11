"use client";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import { ItemUpdateCommentModal } from "./item-update-comment-modal";
import {
  AddCommentModal,
  CardContainer,
  CloudinaryImage,
  Container,
  DeleteItemModal,
  UpdateItemModal,
  UpdateTagsModal,
} from "../../shared";
import Link from "next/link";
import {
  useGetItemDetailFields,
  useGetNearestItems,
  useGetUserItemComments,
  useGetUserTags,
} from "../../../../hooks";

type Props = {
  itemId: string;
};

function ItemContainer(props: Props) {
  const { itemId } = props;
  const [item] = api.item.getUserItem.useSuspenseQuery(itemId);

  if (!item) {
    redirect("/");
  }

  const { items } = useGetNearestItems({ itemId });
  const { fieldData } = useGetItemDetailFields({ itemId });
  const { comments } = useGetUserItemComments({ itemId });

  const { tags } = useGetUserTags({
    collectionsIds: [item.collection.id],
  });

  return (
    <Container>
      <CardContainer className="p-4">
        <Header vtag="h4">{item.title}</Header>
      </CardContainer>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex min-w-64 flex-col items-center gap-4 md:max-w-64">
              <div className="md:aspect-[27/40]">
                {item.image ? (
                  <CloudinaryImage
                    publicId={item.image}
                    className="mx-auto w-full"
                    folder={item.collection.name}
                  />
                ) : (
                  <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
                )}
              </div>

              <UpdateItemModal item={item} />
              <AddCommentModal item={item} />
            </div>

            <div className="flex w-full flex-col gap-4">
              <CardContainer className="flex-col p-4">
                <Header vtag="h6">Plot:</Header>
                <Paragraph className="line-clamp-[16] text-muted-foreground">
                  {item.description}
                </Paragraph>
              </CardContainer>

              <UpdateTagsModal tags={tags} item={item} />

              {comments
                ? comments.map((comment, index) => (
                    <ItemUpdateCommentModal comment={comment} key={index} />
                  ))
                : null}
            </div>
          </div>
          {items && (
            <CardContainer className="flex-col gap-4 p-4">
              <Header vtag="h6">Similar Items:</Header>

              <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
                {items.map((item) => (
                  <Link key={item.id} href={`/item/${item.id}`}>
                    <CardContainer
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
                    </CardContainer>
                  </Link>
                ))}
              </div>
            </CardContainer>
          )}
        </div>
        <div className="flex flex-col gap-4 md:w-64">
          <CardContainer className="w-full flex-col gap-4 p-4 md:w-64">
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
            {fieldData &&
              Object.entries(fieldData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <Header vtag="h6">
                    {key
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Header>
                  {value.map((field: string) => (
                    <Paragraph key={field} className="text-muted-foreground">
                      {field}
                    </Paragraph>
                  ))}
                </div>
              ))}
          </CardContainer>

          <DeleteItemModal item={item} />
        </div>
      </div>
    </Container>
  );
}
export { ItemContainer };
