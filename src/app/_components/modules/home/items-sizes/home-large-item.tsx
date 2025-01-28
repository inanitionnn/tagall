import { Badge, Header, Paragraph } from "../../../ui";
import type { ItemSmallType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";
import { CardContainer, CloudinaryImage } from "../../../shared";

type Props = {
  item: ItemSmallType;
  selectedCollectionsIds: string[];
};

const HomeLargeItem = (props: Props) => {
  const { item, selectedCollectionsIds } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <CardContainer className="h-fit cursor-pointer hover:scale-105">
      <div className="aspect-[27/40] h-36 sm:h-52">
        {item.image ? (
          <CloudinaryImage
            publicId={item.image}
            folder={item.collection.name}
          />
        ) : (
          <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-2 p-2">
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

        <div className="hidden sm:block">
          <Paragraph vsize={"sm"} className="line-clamp-4">
            {item.description}
          </Paragraph>
        </div>

        {item.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id} className="text-sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          {item.rate ? (
            <div className="flex items-center gap-2">
              <Paragraph className="w-5 text-center font-bold">
                {item.rate}
              </Paragraph>
              <Paragraph className="font-medium text-muted-foreground">
                {RATING_NAMES[item.rate]}
              </Paragraph>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <ItemStatusIcon className="block size-5 w-5 stroke-[2px] sm:hidden" />
            <Paragraph className="font-medium text-muted-foreground">
              {STATUS_NAMES[item.status]}
            </Paragraph>
            <ItemStatusIcon className="hidden size-5 stroke-[2.5px] sm:block" />
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export { HomeLargeItem };
