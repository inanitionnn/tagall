import { Input, Spinner } from "../ui";
import { Search as SearchIcon } from "lucide-react";

type Props = {
  query: string;
  setQuery: (data: string) => void;
  submit?: () => void;
  isLoading: boolean;
  autoFocus?: boolean;
};

export const Search = (props: Props) => {
  const { isLoading, query, setQuery, submit, autoFocus } = props;

  const handleSubmit = () => {
    if (submit) submit();
  };

  return (
    <div className="relative">
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Drive..."
        className="w-full rounded-lg border border-input p-4 pr-10 shadow focus:border-primary focus:outline-none"
        autoFocus={autoFocus}
      />
      {isLoading ? (
        <Spinner className="absolute right-3 top-3 h-5 w-5 text-zinc-400" />
      ) : (
        <SearchIcon
          onClick={handleSubmit}
          className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500"
        />
      )}
    </div>
  );
};
