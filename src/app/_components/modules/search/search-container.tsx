"use client";

import { useState } from "react";
import { useSearchItemByText } from "../../../../hooks";
import { Container, ItemCard, Loading, NoItemsCard } from "../../shared";
import { SearchField } from "./search-field";

function SearchContainer() {
  const [searchText, setSearchText] = useState<string>("");

  const { items, isLoading, isFetched, isError, search } = useSearchItemByText({
    searchText,
  });

  if (isFetched && !isError && !items.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <NoItemsCard />
      </div>
    );
  }

  return (
    <Container>
      <SearchField
        query={searchText}
        setQuery={setSearchText}
        submit={search}
        isLoading={isLoading}
      />

      {!isLoading ? (
        <div className="mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  );
}
export { SearchContainer };
