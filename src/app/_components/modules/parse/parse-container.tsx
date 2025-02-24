"use client";
import { useState } from "react";
import type { ParseRegrexResult } from "../../../../server/api/modules/parse/types";
import { CardContainer, Container, ScrollButton } from "../../shared";
import { api } from "../../../../trpc/react";
import { Header } from "../../ui";
import { ParseFormAccordion } from "./parse-form-accordion";
import { ParseItemResult } from "./parse-item-result";

function ParseContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();
  const [items, setItems] = useState<ParseRegrexResult[]>([]);

  return (
    <Container>
      <ParseFormAccordion collections={collections} setItems={setItems} />

      {!!items.length && (
        <CardContainer className="flex-col gap-4 p-6">
          <Header vtag="h5">
            Parsed {items.length} items ({items.filter((i) => i.id).length}{" "}
            alredy in collection)
          </Header>
          <div className="flex flex-col gap-1">
            {items.map((item, index) => (
              <ParseItemResult index={index + 1} item={item} key={item.id} />
            ))}
          </div>
        </CardContainer>
      )}

      <ScrollButton />
    </Container>
  );
}
export { ParseContainer };
