import { TagCategoryList } from "~/app/_components/modules";
import { CreateTagCategoryDrawer } from "~/app/_components/modules/tags/create-tag-category-drawer";
import { Button, Header, Input, Wrapper } from "~/app/_components/ui";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Tags() {
  void api.tagCategory.getAll.prefetch();
  return (
    <HydrateClient>
      <div className="space-y-8">
        <div className="flex items-end gap-16">
          <Header vtag="h2" className="leading-tight">
            Tags
          </Header>
          <Wrapper>
            <div className="flex items-start justify-between">
              <CreateTagCategoryDrawer />
              <div className="flex gap-4">
                <Button variant="outline">Sort</Button>
                <Input placeholder="Search" className="w-80" />
              </div>
            </div>
          </Wrapper>
        </div>

        <TagCategoryList />
      </div>
    </HydrateClient>
  );
}
