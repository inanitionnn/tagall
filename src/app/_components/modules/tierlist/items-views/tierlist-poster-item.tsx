"use client";

import type { TierItemType } from "../../../../../server/api/modules/item/types";
import { CloudinaryImage } from "../../../shared";

type Props = {
  item: TierItemType;
};

const TierListPosterItem = (props: Props) => {
  const { item } = props;

  return (
    <div className="h-[120px] w-[80px] flex-shrink-0">
      {item.image ? (
        <CloudinaryImage
          publicId={item.image}
          folder={item.collection.name}
          className="!h-[120px] !w-[80px] rounded-sm object-cover"
        />
      ) : (
        <div className="h-[120px] w-[80px] rounded-sm bg-primary" />
      )}
    </div>
  );
};

export { TierListPosterItem };
