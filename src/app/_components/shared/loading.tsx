import { Header, Spinner } from "../ui";

export const Loading = () => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <Spinner size="large" />
      <Header vtag="h4">loading</Header>
    </div>
  );
};
