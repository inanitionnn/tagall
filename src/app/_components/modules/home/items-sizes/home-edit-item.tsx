import { Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  AddCommentModal,
  CardContainer,
  CloudinaryImage,
  DeleteItemModal,
  UpdateItemModal,
  UpdateTagsModal,
} from "../../../shared";
import type { TagType } from "../../../../../server/api/modules/tag/types";
import Link from "next/link";

type Props = {
  item: ItemType;
  tags: TagType[];
  selectedCollectionsIds: string[];
};

const HomeEditItem = (props: Props) => {
  const { item, selectedCollectionsIds, tags } = props;
  const itemTags = tags.filter((tag) =>
    tag.collections.map((c) => c.name).includes(item.collection.name),
  );
  return (
    <CardContainer className="h-fit flex-col p-4">
      <div className="flex gap-4">
        <Link key={item.id} href={`/item/${item.id}`}>
          <div className="aspect-[27/40] h-36 transition-all duration-500 ease-in-out hover:scale-105 sm:h-72">
            {item.image ? (
              <CloudinaryImage
                publicId={item.image}
                folder={item.collection.name}
              />
            ) : (
              <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
            )}
          </div>
        </Link>

        <div className="flex w-full flex-col justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex justify-between gap-2">
              <Header vtag="h5" className="line-clamp-2">
                {item.title}
              </Header>
              {selectedCollectionsIds.length > 1 ? (
                <Header vtag="h6" className="font-bold text-muted-foreground">
                  {item.collection.name}
                </Header>
              ) : null}
            </div>

            <Paragraph className="font-semibold text-muted-foreground">
              {item.year}
            </Paragraph>
          </div>

          <AddCommentModal item={item} />
          <div className="hidden flex-col gap-2 sm:flex">
            <UpdateItemModal item={item} />
            <UpdateTagsModal item={item} tags={itemTags} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        <UpdateItemModal item={item} />
        <UpdateTagsModal item={item} tags={itemTags} />
        <DeleteItemModal item={item} />
      </div>

      <DeleteItemModal item={item} />
    </CardContainer>
  );
};

export { HomeEditItem };
