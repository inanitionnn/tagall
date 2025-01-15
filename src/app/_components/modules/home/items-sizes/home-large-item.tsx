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

const HomeLargeItem = (props: Props) => {
  const { item } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <Container className="h-fit cursor-pointer hover:scale-105 sm:h-64">
      <div className="aspect-[27/40] h-36 sm:h-full">
        {item.image ? (
          <CloudinaryImage publicId={item.image} />
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
            <Header vtag="h6" className="font-bold text-muted-foreground">
              {item.collection}
            </Header>
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
              <Badge key={tag.id} className="px-2 py-0.5 text-sm">
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
    </Container>
  );
};

export { HomeLargeItem };
