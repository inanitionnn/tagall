import { SearchContainer } from "../../../_components/modules";
import BackgroundImage from "../../../_components/shared/background-image";

export const dynamic = "force-dynamic";

export default async function Search() {
  return (
    <BackgroundImage image="/posters5.webp">
      <SearchContainer />
    </BackgroundImage>
  );
}
