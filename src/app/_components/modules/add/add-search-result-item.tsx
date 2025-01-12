import Image from "next/image";
import { Header, Paragraph } from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { cn } from "../../../../lib";
import Container from "../../shared/container";

type Props = {
  searchResult: SearchResultType;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
};

const AddSearchResultItem = (props: Props) => {
  const { searchResult, setSelectedItem } = props;

  return (
    <Container
      className={cn("relative h-64 cursor-pointer flex-col p-4 sm:flex-row", {
        "hover:scale-105": !searchResult.id,
      })}
      onClick={() => {
        if (!searchResult.id) {
          setSelectedItem(() => searchResult);
        }
      }}
    >
      {searchResult.id && (
        <div className="absolute bottom-2 left-2 rounded-sm bg-green-500 p-2 text-destructive-foreground">
          <Paragraph>In Collection</Paragraph>
        </div>
      )}
      <Header vtag="h5" className="line-clamp-3 sm:hidden">
        {searchResult.title}
      </Header>
      <div className="flex h-full">
        <div className="aspect-[29/40]">
          {searchResult.image ? (
            <Image
              src={searchResult.image}
              alt={"cover" + searchResult.title}
              className="aspect-[29/40] rounded-sm object-cover"
              width={170}
              height={260}
              unoptimized={true}
            />
          ) : (
            <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex w-full flex-col justify-between gap-2 p-6">
          <Header vtag="h5" className="line-clamp-3 hidden sm:block">
            {searchResult.title}
          </Header>

          {searchResult.description && (
            <Paragraph vsize={"sm"} className="line-clamp-4">
              {searchResult.description}
            </Paragraph>
          )}

          <Paragraph>
            {[searchResult.year, ...searchResult.keywords]
              .slice(0, 6)
              .join(" • ")}
          </Paragraph>
        </div>
      </div>
    </Container>
  );
};

export { AddSearchResultItem };
