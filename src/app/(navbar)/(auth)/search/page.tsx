import { Suspense } from "react";
import { HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import LoadingPage from "../../../loading";
import { SearchContainer } from "../../../_components/modules";

export default function SearchPage() {
  return (
    <HydrateClient>
      <BackgroundImage image="/posters4.webp">
        <Suspense fallback={<LoadingPage />}>
          <SearchContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
