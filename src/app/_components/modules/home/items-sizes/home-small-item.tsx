import { Badge, Header, Paragraph } from "../../../ui";
import type { ItemSmallType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";
import CloudinaryImage from "../../../shared/cloudinary-image";
import Container from "../../../shared/container";

type Props = {
  item: ItemSmallType;
  selectedCollectionsIds: string[];
};

const HomeSmallItem = (props: Props) => {
  const { item, selectedCollectionsIds } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <Container className="h-fit cursor-pointer hover:scale-105 sm:h-24">
      <div className="aspect-[27/40] h-36 sm:h-full">
        {item.image ? (
          <CloudinaryImage
            publicId={item.image}
            collectionName={item.collection.name}
          />
        ) : (
          <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
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
              <Badge key={tag.id} className="px-2 py-0.5 text-sm">
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
    </Container>
  );
};

export { HomeSmallItem };
