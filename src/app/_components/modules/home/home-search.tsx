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
        className="w-full rounded-md border border-zinc-300 px-4 py-2 pr-10 shadow focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
      />
      {isLoading ? (
        <Spinner className="absolute right-3 top-3 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
      ) : (
        <Search className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500" />
      )}
    </div>
  );
}
export { HomeSearch };
