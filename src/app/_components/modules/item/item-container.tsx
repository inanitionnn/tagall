"use client";
import Image from "next/image";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";
import { Star } from "lucide-react";

type Props = {
  itemId: string;
};

function ItemContainer(props: Props) {
  const { itemId } = props;
  const [item] = api.item.getUserItem.useSuspenseQuery(itemId);

  if (!item) {
    redirect("/");
  }

  const StatusIcon = STATUS_ICONS[item.status];
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="grid grid-cols-[256px_auto] grid-rows-1 gap-4">
        <div className="aspect-[29/40] w-full">
          {item.image ? (
            <Image
              src={item.image}
              alt={"cover" + item.name}
              className="aspect-[29/40] rounded-sm object-cover"
              width={290}
              height={400}
            />
          ) : (
            <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex h-full flex-col gap-2 rounded-md bg-background p-8 shadow">
          <Header vtag="h4">{item.name}</Header>
          <Paragraph className="text-muted-foreground">
            {item.description}
          </Paragraph>
        </div>
      </div>

      <div className="flex w-64 items-center gap-2 rounded-md bg-background p-4 shadow">
        <Header vtag="h6">Status:</Header>
        <div className="flex w-full items-center justify-between gap-1">
          <StatusIcon size={16} />
          <Paragraph>{STATUS_NAMES[item.status]}</Paragraph>
        </div>
      </div>

      <div className="flex w-64 items-center gap-2 rounded-md bg-background p-4 shadow">
        <Header vtag="h6">Rate:</Header>
        {item.rate ? (
          <>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-1">
                <Paragraph className="font-semibold">{item.rate}</Paragraph>
                <Star size={16} />
              </div>
              <Paragraph>{RATING_NAMES[item.rate]}</Paragraph>
            </div>
          </>
        ) : (
          <Paragraph>None</Paragraph>
        )}
      </div>
      <div className="flex w-64 flex-col gap-2 rounded-md bg-background p-4 shadow">
        <div className="flex flex-col">
          <Header vtag="h6">Year:</Header>
          <Paragraph className="text-muted-foreground">{item.year}</Paragraph>
        </div>
        {item.fieldGroups.map((group) => (
          <div key={group.name} className="flex flex-col">
            <Header vtag="h6">
              {group.name
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </Header>
            {group.fields.map((field) => (
              <Paragraph key={field} className="text-muted-foreground">
                {field}
              </Paragraph>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export { ItemContainer };
