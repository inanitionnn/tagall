"use client";

import { useState } from "react";
import { AutosizeTextarea, Button, Header, Spinner } from "../../ui";
import { useSearchItemByText } from "./hooks/use-search-item-by-text";
import Container from "../../shared/container";
import Link from "next/link";
import CloudinaryImage from "../../shared/cloudinary-image";

function SearchContainer() {
  const [searchText, setSearchText] = useState("");
  const { items, isPending, mutate } = useSearchItemByText();
  const submit = () => mutate(searchText);

  return (
    <div className="mx-auto max-w-screen-2xl p-8">
      <Container className="flex-col">
        <AutosizeTextarea
          autoFocus
          placeholder="Manga about samurais"
          maxHeight={200}
          maxLength={1000}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          value={searchText}
        />
        <Button onClick={submit}>
          {isPending ? (
            <Spinner className="h-5 w-5 text-primary-foreground" />
          ) : (
            "Search"
          )}
        </Button>
      </Container>
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`} target="_blank">
            <Container
              key={item.id}
              className="h-full flex-col hover:scale-105 md:w-full"
            >
              <div className="aspect-[27/40]">
                {item.image ? (
                  <CloudinaryImage
                    publicId={item.image}
                    collectionName={item.collection.name}
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
            </Container>
          </Link>
        ))}
      </div>
    </div>
  );
}
export { SearchContainer };
