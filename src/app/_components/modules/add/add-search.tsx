import { Input, Spinner } from "../../ui";
import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  submit: () => void;
  isLoading: boolean;
};

function AddSearch(props: Props) {
  const { isLoading, query, setQuery, submit } = props;

  return (
    <div className="relative">
      <Input
        //   type="search"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search elements..."
        className="w-full rounded-md border border-zinc-300 px-4 py-2 pr-10 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
      />
      {isLoading ? (
        <Spinner className="absolute right-3 top-3 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
      ) : (
        <Search
          onClick={submit}
          className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500"
        />
      )}
    </div>
  );
}
export { AddSearch };
