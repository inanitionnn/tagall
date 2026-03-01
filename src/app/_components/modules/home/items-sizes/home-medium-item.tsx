import { Header } from "../../../ui";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import { CardContainer, CloudinaryImage } from "../../../shared";

type Props = {
  item: ItemType;
};

const HomeMediumItem = (props: Props) => {
  const { item } = props;

  return (
    <CardContainer className="relative flex-col h-full overflow-hidden transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:shadow-md md:w-full">
      {item.image && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <CloudinaryImage
            className="!aspect-auto h-full w-full rounded-none border-0 object-cover opacity-5 blur-sm shadow-none"
            publicId={item.image}
            folder={item.collection.name}
          />
        </div>
      )}

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
  );
};

export { HomeMediumItem };
