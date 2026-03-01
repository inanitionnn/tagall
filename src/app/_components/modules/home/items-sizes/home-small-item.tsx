import { Badge, Header } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import {
  CardContainer,
  CloudinaryImage,
  ItemRatingBadge,
  ItemStatusBadge,
  ItemTypeBadge,
} from "../../../shared";

type Props = {
  item: ItemType;
  selectedCollectionsIds: string[];
};

const HomeSmallItem = (props: Props) => {
  const { item, selectedCollectionsIds } = props;

  return (
    <CardContainer className="relative h-fit cursor-pointer overflow-hidden p-0 transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:shadow-md sm:h-24">
      {/* Blurred background */}
      {item.image && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <CloudinaryImage
            className="!aspect-auto h-full w-full rounded-none border-0 object-cover opacity-5 blur-sm shadow-none"
            publicId={item.image}
            folder={item.collection.name}
          />
        </div>
      )}

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035]"
        style={{ backgroundImage: "url('/halftone.png')", backgroundRepeat: "repeat" }}
      />

      {/* Poster */}
      <div className="relative z-10 aspect-square h-full flex-shrink-0 overflow-hidden rounded-xl">
        {item.image ? (
          <CloudinaryImage
            className="h-full w-full object-cover"
            publicId={item.image}
            folder={item.collection.name}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between gap-1 px-4 py-3">
        {/* Title + type badge */}
        <div className="flex items-start justify-between gap-2">
          <Header vtag="h6" className="line-clamp-2 leading-snug">
            {item.title}
          </Header>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <ItemTypeBadge collectionName={item.collection.name} />
          </div>
        </div>

        {/* Bottom row: status · ★ rating · year */}
        <div className="flex items-center justify-end gap-3">

        {item.rate ? (
            <ItemRatingBadge rate={item.rate} className="text-base" />
          ) : null}

        {item.year && (
            <span className="text-base font-semibold text-muted-foreground">
              {item.year}
            </span>
          )}
        
        

<ItemStatusBadge
            status={item.status}
            showLabel={false}
            className="text-base sm:gap-1.5"
          />

        </div>
      </div>
    </CardContainer>
  );
};

export { HomeSmallItem };
