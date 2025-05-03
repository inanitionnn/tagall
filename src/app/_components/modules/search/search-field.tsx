import { AutosizeTextarea, Spinner } from "../../ui";
import { Search as SearchIcon } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";

type Props = {
  query: string;
  setQuery: (data: string) => void;
  submit?: () => void;
  isLoading: boolean;
};

export const SearchField = (props: Props) => {
  const { isLoading, query, setQuery, submit } = props;

  const handleSubmit = () => {
    if (submit) submit();
  };

  return (
    <div className="relative">
      <AutosizeTextarea
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        value={query}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setQuery(e.target.value)
        }
        placeholder="Search..."
        className="min-h-[100px] w-full resize-none rounded-lg border border-input p-4 pr-10 shadow focus:border-primary focus:outline-none"
        autoFocus
        minHeight={100}
      />
      {isLoading ? (
        <Spinner className="absolute bottom-3 right-3 h-5 w-5 text-zinc-400" />
      ) : (
        <SearchIcon
          onClick={handleSubmit}
          className="absolute bottom-0 right-3 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500"
        />
      )}
    </div>
  );
};
