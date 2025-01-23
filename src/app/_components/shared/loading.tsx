import { Header, Spinner } from "../ui";

export const Loading = () => {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <Spinner size={"medium"} />
      <Header vtag="h5">loading</Header>
    </div>
  );
};
