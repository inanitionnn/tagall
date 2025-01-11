"use client";
import {
  Button,
  DualRangeSlider,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui";
import { useState } from "react";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";
import type { ItemType } from "../../../../server/api/modules/item/types";
import { Star } from "lucide-react";
import { useUpdateItem } from "./hooks/use-update-item.hook";
import { ItemStatus } from "@prisma/client";

type Props = {
  item: ItemType;
};

const ItemUpdateModal = (props: Props) => {
  const { item } = props;

  const [open, setOpen] = useState(false);

  const { form, submit } = useUpdateItem({
    item,
    setOpen,
  });

  const status = form.watch("status");
  const rating = form.watch("rate");

  const StatusIcon = STATUS_ICONS[item.status];

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer flex-col gap-2 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Header vtag="h6">Status:</Header>
            <div className="flex w-full items-center justify-between gap-1">
              <StatusIcon size={16} />
              <Paragraph>{STATUS_NAMES[item.status]}</Paragraph>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-8 sm:min-w-96"
          >
            <Header vtag="h4" className="leading-tight">
              Update item
            </Header>
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <div className="flex w-full items-center justify-between gap-2">
                    <Paragraph>
                      <FormLabel>Status:</FormLabel>
                      {"   "}
                      {STATUS_NAMES[status]}
                    </Paragraph>
                    <div className="flex gap-2">
                      {Object.values(ItemStatus)
                        .reverse()
                        .map((s) => {
                          const IconComponent = STATUS_ICONS[s];
                          return (
                            <FormControl key={s}>
                              <Button
                                size={"icon"}
                                variant={status === s ? "default" : "secondary"}
                                onClick={() => form.setValue("status", s)}
                              >
                                <IconComponent size={16} />
                              </Button>
                            </FormControl>
                          );
                        })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <Paragraph>
                        <FormLabel>Rating:</FormLabel>
                        {"   "}
                        {rating}
                      </Paragraph>
                      <Paragraph>{RATING_NAMES[rating]}</Paragraph>
                    </div>

                    <DualRangeSlider
                      // label={(value) => value}
                      value={[rating]}
                      onValueChange={(value) =>
                        form.setValue("rate", value[0] ?? 0)
                      }
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Add comment
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateModal };
