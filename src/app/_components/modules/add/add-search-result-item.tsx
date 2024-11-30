import Image from "next/image";
import { Header, Paragraph } from "../../ui";
import { Dispatch, SetStateAction } from "react";
import { SearchResultType } from "../../../../server/api/modules/parse/types";
import { cn } from "../../../../lib";

type Props = {
  searchResult: SearchResultType;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
};

const AddSearchResultItem = (props: Props) => {
  const { searchResult, setCurrentItem } = props;

  return (
    <div
      className={cn(
        "relative flex h-64 flex-col gap-2 rounded-sm bg-background p-4 shadow sm:flex-row",
        {
          "cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg":
            !searchResult.inCollection,
        },
      )}
      onClick={() => {
        if (!searchResult.inCollection) {
          setCurrentItem(() => searchResult);
        }
      }}
    >
      {searchResult.inCollection && (
        <div className="absolute bottom-2 left-2 rounded-sm bg-green-500 p-2 text-destructive-foreground">
          <Paragraph>In Collection</Paragraph>
        </div>
      )}
      <Header vtag="h5" className="leading-tight sm:hidden">
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
            />
          ) : (
            <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex w-full flex-col justify-between gap-2 p-6">
          <Header vtag="h5" className="hidden leading-tight sm:block">
            {searchResult.title}
          </Header>

          {searchResult.description && (
            <Paragraph vsize={"sm"} className="line-clamp-4">
              {searchResult.description}
            </Paragraph>
          )}

          <Paragraph>
            {[searchResult.year, ...searchResult.keywords].join(" • ")}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export { AddSearchResultItem };
