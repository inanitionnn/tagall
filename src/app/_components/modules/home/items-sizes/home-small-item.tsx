import Image from "next/image";
import { Header } from "../../../ui";
import { ItemType } from "../../../../../server/api/modules/item/types";
import Link from "next/link";

type Props = {
  item: ItemType;
};

const HomeSmallItem = (props: Props) => {
  const { item } = props;

  return (
    <Link href={`/items/${item.id}`}>
      <div className="flex aspect-[29/48] flex-col gap-2 md:w-full">
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
        <Header vtag="h6" className="line-clamp-2 leading-tight">
          {item.name}
        </Header>
      </div>
    </Link>
  );
};

export { HomeSmallItem };
