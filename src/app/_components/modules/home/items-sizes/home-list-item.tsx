import { Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";

type Props = {
  item: ItemType;
  index: number;
};

const HomeListItem = (props: Props) => {
  const { item, index } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <>
      <div className="group flex w-full cursor-pointer gap-6">
        <Paragraph className="min-w-8 font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
          {index}.
        </Paragraph>

        <Paragraph className="hidden min-w-14 font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary md:block">
          {item.collection}
        </Paragraph>

        <Paragraph className="hidden font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary sm:block">
          {item.year}
        </Paragraph>

        <Header vtag="h6" className="line-clamp-2 w-full min-w-64">
          {item.title}
        </Header>

        <div className="hidden min-w-32 items-center justify-end gap-2 lg:flex">
          <Paragraph className="font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
            {STATUS_NAMES[item.status]}
          </Paragraph>
          |
          <ItemStatusIcon className="size-4 stroke-muted-foreground stroke-2 group-hover:stroke-primary group-hover:stroke-[2.5px]" />
        </div>

        <div className="hidden min-w-32 items-center justify-end gap-2 lg:flex">
          <Paragraph className="font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
            {item.rate ? RATING_NAMES[item.rate] : "None"}
          </Paragraph>
          |
          <Paragraph className="min-w-4 text-end font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
            {item.rate ?? 0}
          </Paragraph>
        </div>

        <Paragraph className="hidden min-w-32 text-end font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary xl:block">
          {item.timeAgo}
        </Paragraph>
      </div>
    </>
  );
};

export { HomeListItem };
