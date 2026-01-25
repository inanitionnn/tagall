import { Header, Paragraph } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../../constants";

type Props = {
  item: ItemType;
  selectedCollectionsIds: string[];
  showTimeAgo?: boolean;
};

const HomeListItem = (props: Props) => {
  const { item, selectedCollectionsIds, showTimeAgo = true } = props;
  const ItemStatusIcon = STATUS_ICONS[item.status];
  return (
    <>
      <div className="group flex w-full cursor-pointer gap-6">
        {selectedCollectionsIds.length > 1 ? (
          <Paragraph className="hidden min-w-14 font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary md:block lg:hidden xl:block">
            {item.collection.name}
          </Paragraph>
        ) : null}

        <Paragraph className="hidden font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary sm:block">
          {item.year}
        </Paragraph>

        <Header
          vtag="h6"
          className="line-clamp-3 w-full whitespace-break-spaces text-wrap font-bold leading-snug group-hover:text-primary sm:min-w-64"
        >
          {item.title}
        </Header>

        <div className="hidden items-center justify-end gap-2 md:flex lg:min-w-32">
          <Paragraph className="whitespace-nowrap font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
            {STATUS_NAMES[item.status]}
          </Paragraph>
          <Paragraph className="hidden font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary lg:block">
            |
          </Paragraph>

          <ItemStatusIcon className="hidden size-4 stroke-muted-foreground stroke-2 group-hover:stroke-primary group-hover:stroke-[2.5px] lg:block" />
        </div>

        <div className="hidden items-center justify-end gap-2 md:flex lg:min-w-32">
          <Paragraph className="hidden font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary lg:block">
            {item.rate ? RATING_NAMES[item.rate] : "None"}
          </Paragraph>
          <Paragraph className="hidden font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary lg:block">
            |
          </Paragraph>

          <Paragraph className="min-w-4 text-end font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary">
            {item.rate ?? 0}
          </Paragraph>
        </div>

        {showTimeAgo ? (
          <Paragraph className="hidden min-w-32 text-end font-medium text-muted-foreground group-hover:font-bold group-hover:text-primary xl:block">
            {item.timeAgo}
          </Paragraph>
        ) : null}
      </div>
    </>
  );
};

export { HomeListItem };
