import Image from "next/image";
import { Badge, Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";

type Props = {
  item: ItemType;
};

const HomeListItem = (props: Props) => {
  const { item } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <div className="flex h-36 w-full cursor-pointer gap-2 rounded-sm bg-background p-2 shadow sm:h-20">
      <div className="aspect-[29/40]">
        {item.image ? (
          <Image
            src={item.image}
            alt={"cover" + item.name}
            className="aspect-[29/40] rounded-sm object-cover"
            width={290}
            height={400}
          />
        ) : (
          <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-col xl:min-w-[300px] xl:max-w-[300px]">
          <Header vtag="h6" className="line-clamp-3 leading-tight">
            {item.name}
          </Header>
          <Header
            vtag="h6"
            className="font-bold leading-tight text-muted-foreground"
          >
            {[item.collection, item.year].join(" • ")}
          </Header>
        </div>

        <div className="hidden w-full gap-2 xl:flex xl:flex-wrap">
          {item.fieldGroups
            .find((g) => g.name === "keywords")
            ?.fields.filter((f) => f.split(" ").length < 2)
            .slice(0, 5)
            .map((f) => (
              <Badge key={f} className="px-2 py-0.5 text-sm">
                {f}
              </Badge>
            ))}
        </div>

        <div className="flex w-min items-center justify-center gap-4">
          <div className="flex w-24 flex-col items-center">
            <ItemStatusIcon className="size-5 stroke-[2.5px]" />
            <Paragraph className="font-medium text-muted-foreground">
              {STATUS_NAMES[item.status]}
            </Paragraph>
          </div>

          <div className="flex w-24 flex-col items-center">
            <Paragraph className="font-bold">{item.rate}</Paragraph>
            <Paragraph className="font-medium text-muted-foreground">
              {item.rate ? RATING_NAMES[item.rate] : "None"}
            </Paragraph>
          </div>

          <div className="hidden w-32 flex-col items-center lg:flex">
            <Paragraph className="font-bold">{item.timeAgo}</Paragraph>
            <Paragraph className="font-medium text-muted-foreground">
              {item.updatedAt.toLocaleDateString()}
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeListItem };
