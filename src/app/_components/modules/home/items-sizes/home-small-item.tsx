import { Badge, Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";
import { CardContainer, CloudinaryImage } from "../../../shared";

type Props = {
  item: ItemType;
  selectedCollectionsIds: string[];
};

const HomeSmallItem = (props: Props) => {
  const { item, selectedCollectionsIds } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <CardContainer className="h-fit cursor-pointer hover:scale-105 sm:h-24">
      <div className="aspect-square h-36 sm:h-full">
        {item.image ? (
          <CloudinaryImage
            className="aspect-square rounded-full"
            publicId={item.image}
            folder={item.collection.name}
          />
        ) : (
          <div className="aspect-square rounded-full bg-primary object-cover" />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-2 p-2 sm:flex-row sm:items-center">
        <div className="flex items-start justify-between gap-1 sm:flex-col xl:min-w-[300px] xl:max-w-[300px]">
          <Header vtag="h6" className="line-clamp-2">
            {item.title}
          </Header>
          <div className="flex flex-col gap-2 whitespace-nowrap sm:flex-row">
            {selectedCollectionsIds.length > 1 ? (
              <>
                <Paragraph className="hidden font-semibold text-muted-foreground sm:block">
                  {item.collection.name}
                </Paragraph>
                <Paragraph className="hidden font-semibold text-muted-foreground sm:block">
                  {" • "}
                </Paragraph>
              </>
            ) : null}

            <Paragraph className="font-semibold text-muted-foreground">
              {item.year}
            </Paragraph>
          </div>
        </div>

        {item.tags.length ? (
          <div className="flex w-full flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id} className="text-sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-1 sm:w-min sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <div className="flex items-center gap-1 sm:w-24 sm:flex-col sm:gap-2">
            <ItemStatusIcon className="size-5 w-5 stroke-[2.5px]" />
            <Paragraph className="font-medium text-muted-foreground">
              {STATUS_NAMES[item.status]}
            </Paragraph>
          </div>

          {item.rate ? (
            <div className="flex items-center gap-1 sm:w-24 sm:flex-col sm:gap-2">
              <Paragraph className="w-5 text-center font-bold">
                {item.rate}
              </Paragraph>
              <Paragraph className="font-medium text-muted-foreground">
                {RATING_NAMES[item.rate]}
              </Paragraph>
            </div>
          ) : (
            <div className="sm:w-24" />
          )}

          <div className="hidden w-32 flex-col items-center lg:flex">
            <Paragraph className="font-bold">{item.timeAgo}</Paragraph>

            <Paragraph className="font-medium text-muted-foreground">
              {new Date(item.updatedAt).toLocaleDateString()}
            </Paragraph>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export { HomeSmallItem };
