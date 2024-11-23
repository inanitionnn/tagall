import Image from "next/image";
import { Badge, Header, Paragraph } from "../../ui";
import { ItemType } from "../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";

type Props = {
  item: ItemType;
};

const HomeMediumItem = (props: Props) => {
  const { item } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <div className="flex h-36 w-full cursor-pointer gap-2 rounded-sm bg-background shadow-md sm:h-64">
      <div className="aspect-[29/40]">
        {item.image ? (
          <Image
            src={item.image}
            alt={"cover" + item.name}
            className="aspect-[29/40] rounded-l-sm object-cover"
            width={290}
            height={400}
          />
        ) : (
          <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-2 p-2">
        <div className="flex flex-col">
          <Header vtag="h6" className="leading-tight text-muted-foreground">
            {item.collection}
          </Header>

          <Header vtag="h5" className="line-clamp-3 leading-tight">
            {item.name}
          </Header>

          <Header vtag="h6" className="hidden leading-tight sm:block">
            {item.year}
          </Header>
        </div>

        <Paragraph vsize={"sm"} className="line-clamp-4 hidden sm:block">
          {item.description}
        </Paragraph>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {item.fieldGroups
            .find((g) => g.name === "keyword")
            ?.fields.filter((f) => f.split(" ").length < 2)
            .slice(0, 5)
            .map((f) => <Badge className="px-2 py-0.5 text-sm">{f}</Badge>)}
        </div>
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {item.rate ? (
              <>
                <Paragraph className="w-5 text-center font-bold">
                  {item.rate}
                </Paragraph>
                <Paragraph className="font-medium text-muted-foreground">
                  {RATING_NAMES[item.rate]}
                </Paragraph>
              </>
            ) : (
              <Paragraph className="font-medium text-muted-foreground">
                None
              </Paragraph>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ItemStatusIcon className="block size-5 w-5 stroke-[2.5px] sm:hidden" />
            <Paragraph className="font-medium text-muted-foreground">
              {STATUS_NAMES[item.status]}
            </Paragraph>
            <ItemStatusIcon className="hidden size-5 stroke-[2.5px] sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeMediumItem };
