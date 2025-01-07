import { Header } from '../../../ui';
import type { ItemType } from '../../../../../server/api/modules/item/types';
import CloudinaryImage from '../../../shared/cloudinary-image';

type Props = {
  item: ItemType;
};

const HomeSmallItem = (props: Props) => {
  const { item } = props;

  return (
    <div className="flex aspect-[29/40] flex-col gap-2 md:w-full">
      <div className="aspect-[29/40]">
        {item.image ? (
          <CloudinaryImage publicId={item.image} />
        ) : (
          <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <Header vtag="h6" className="line-clamp-2 leading-tight">
        {item.title}
      </Header>
    </div>
  );
};

export { HomeSmallItem };
