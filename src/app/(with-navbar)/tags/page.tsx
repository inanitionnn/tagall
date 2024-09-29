import { TagCategoryList } from "~/app/_components/modules";
import { CreateTagCategoryDrawer } from "~/app/_components/modules/tags/create-tag-category-drawer";
import { Header, Input, Wrapper } from "~/app/_components/ui";
import { api } from "~/trpc/server";

export default async function Tags() {
  void api.tagCategory.getAll.prefetch();
  return (
    <div className="space-y-8">
      <Header vtag="h2">Tags</Header>
      <Wrapper>
        <div className="flex items-start justify-between">
          <CreateTagCategoryDrawer />
          <Input placeholder="Search" className="w-80" />
        </div>
      </Wrapper>
      <TagCategoryList />
    </div>
  );
}
