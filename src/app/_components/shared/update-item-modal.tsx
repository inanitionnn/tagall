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
} from "../ui";
import { useState } from "react";
import { RATING_NAMES, STATUS_ICONS, STATUS_NAMES, STATUS_VALUES } from "../../../constants";
import type { ItemType } from "../../../server/api/modules/item/types";
import { Star } from "lucide-react";
import { useUpdateItem } from "../../../hooks";
import { ItemStatus } from "@prisma/client";
import { CardContainer } from ".";

type Props = {
  item: ItemType;
};

const UpdateItemModal = (props: Props) => {
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
        <CardContainer className="w-full cursor-pointer flex-col p-4 hover:scale-105">
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
        </CardContainer>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4 sm:min-w-96"
          >
            <Header vtag="h4" className="line-clamp-2">
              {item.title}
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
                      {STATUS_VALUES.map((s) => {
                        const IconComponent = STATUS_ICONS[s];
                        return (
                          <FormControl key={s}>
                            <Button
                              size={"icon"}
                              variant={status === s ? "default" : "secondary"}
                              onClick={(e) => {
                                e.preventDefault();
                                form.setValue("status", s);
                              }}
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
              Update item
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { UpdateItemModal };
