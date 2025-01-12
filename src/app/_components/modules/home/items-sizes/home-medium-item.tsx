import { Header } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import CloudinaryImage from "../../../shared/cloudinary-image";
import Container from "../../../shared/container";

type Props = {
  item: ItemType;
};

const HomeMediumItem = (props: Props) => {
  const { item } = props;

  return (
    <Container className="h-full flex-col hover:scale-105 md:w-full">
      <div className="aspect-[29/40]">
        {item.image ? (
          <CloudinaryImage publicId={item.image} />
        ) : (
          <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
        )}
      </div>
      <div className="flex h-full items-center justify-center p-2">
        <Header vtag="h6" className="line-clamp-3 text-center">
          {item.title}
        </Header>
      </div>
    </Container>
  );
};

export { HomeMediumItem };
