import Link from "next/link";
import { CardContainer, CloudinaryImage } from "../../shared";
import { Header } from "../../ui";
import type { ItemSmallType } from "../../../../server/api/modules/item/types";

type Props = {
  item: ItemSmallType;
};

function RandomItem(props: Props) {
  const { item } = props;

  return (
    <Link key={item.id} href={`/item/${item.id}`} target="_blank">
      <CardContainer
        key={item.id}
        className="h-full flex-col hover:scale-105 md:w-full"
      >
        <div className="aspect-[27/40]">
          {item.image ? (
            <CloudinaryImage
              publicId={item.image}
              folder={item.collection.name}
            />
          ) : (
            <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex h-full items-center justify-center p-2">
          <Header vtag="h6" className="line-clamp-3 text-center">
            {item.title}
          </Header>
        </div>
      </CardContainer>
    </Link>
  );
}
export { RandomItem };
