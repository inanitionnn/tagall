import { Header, Spinner } from "~/app/_components/ui";

export default function Loaging() {
  return (
    <div className="flex h-lvh w-full items-center justify-center gap-6">
      <Spinner size={"large"} />
      <Header vtag="h3">loading</Header>
    </div>
  );
}
