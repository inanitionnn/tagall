import { Badge, Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";
import CloudinaryImage from "../../../shared/cloudinary-image";
import Container from "../../../shared/container";

type Props = {
  item: ItemType;
};

const HomeSmallItem = (props: Props) => {
  const { item } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <Container className="h-36 cursor-pointer hover:scale-105 sm:h-24">
      <div className="aspect-[29/40]">
        {item.image ? (
          <CloudinaryImage publicId={item.image} />
        ) : (
          <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-start justify-between gap-1 p-2 sm:flex-col xl:min-w-[300px] xl:max-w-[300px]">
          <Header vtag="h6" className="line-clamp-2">
            {item.title}
          </Header>
          <Paragraph className="whitespace-nowrap font-semibold text-muted-foreground sm:block">
            {[item.collection, item.year].join(" • ")}
          </Paragraph>
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

        <div className="flex items-center justify-between gap-4 p-2 sm:w-min sm:justify-center">
          <div className="flex items-center gap-2 sm:w-24 sm:flex-col">
            <ItemStatusIcon className="size-5 stroke-[2.5px]" />
            <Paragraph className="font-medium text-muted-foreground">
              {STATUS_NAMES[item.status]}
            </Paragraph>
          </div>

          {item.rate ? (
            <div className="flex items-center gap-2 sm:w-24 sm:flex-col">
              <Paragraph className="font-bold">{item.rate}</Paragraph>
              <Paragraph className="font-medium text-muted-foreground">
                {RATING_NAMES[item.rate]}
              </Paragraph>
            </div>
          ) : (
            <div />
          )}

          <div className="hidden w-32 flex-col items-center lg:flex">
            <Paragraph className="font-bold">{item.timeAgo}</Paragraph>
            <Paragraph className="font-medium text-muted-foreground">
              {item.updatedAt.toLocaleDateString()}
            </Paragraph>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { HomeSmallItem };
