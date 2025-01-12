import { Input, Spinner } from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

type Props = {
  query: string;
  isLoading: boolean;
  setQuery: Dispatch<SetStateAction<string>>;
};

function HomeSearch(props: Props) {
  const { query, setQuery, isLoading } = props;

  return (
    <div className="relative">
      <Input
        //   type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search elements..."
        className="w-full rounded-lg border border-input p-4 pr-10 shadow focus:border-primary focus:outline-none"
      />
      {isLoading ? (
        <Spinner className="absolute right-3 top-3 h-5 w-5 text-zinc-400" />
      ) : (
        <Search className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400" />
      )}
    </div>
  );
}
export { HomeSearch };
