import Link from "next/link";
import { Header } from "../ui";
import type { ItemType } from "../../../server/api/modules/item/types";
import { CardContainer } from "./card-container";
import { CloudinaryImage } from "./cloudinary-image";

type Props = {
  item: ItemType;
};

function ItemCard(props: Props) {
  const { item } = props;

  return (
    <Link href={`/item/${item.id}`}>
      <CardContainer className="relative h-full flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-md md:w-full">
        {/* Blurred background */}
        {item.image && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <CloudinaryImage
              variant="background"
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

        <div className="relative z-10 aspect-[27/40]">
          {item.image ? (
            <CloudinaryImage
              publicId={item.image}
              folder={item.collection.name}
              className="rounded-xl"
            />
          ) : (
            <div className="aspect-[27/40] rounded-xl bg-primary object-cover" />
          )}
        </div>
        <div className="relative z-10 flex h-full items-center justify-center p-2">
          <Header vtag="h6" className="line-clamp-3 text-center">
            {item.title}
          </Header>
        </div>
      </CardContainer>
    </Link>
  );
}
export { ItemCard };
