"use client";
import Image from "next/image";
import {
  AutosizeTextarea,
  Button,
  DualRangeSlider,
  Header,
  Input,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  Separator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";
import { ItemStatus } from "@prisma/client";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { useAddItemToCollection } from "./hooks/use-add-item-to-collection.hook";

type Props = {
  open: boolean;
  currentItem: SearchResultType;
  currentCollectionId: string;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

const AddItemModal = (props: Props) => {
  const { currentItem, open, setCurrentItem } = props;
  const { form, submit } = useAddItemToCollection(props);

  const status = form.watch("status");
  const rating = form.watch("rate");
  const details = [currentItem.year, ...currentItem.keywords].filter(Boolean);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setCurrentItem(null);
        }
      }}
    >
      <ResponsiveModalContent className="h-min min-h-64 w-full flex-col justify-center rounded-sm bg-background p-0 sm:flex sm:max-w-2xl sm:flex-row sm:p-4 md:max-w-3xl lg:max-w-4xl">
        <div className="hidden w-[500px] sm:block">
          <div className="aspect-[29/40] rounded-sm sm:block">
            {currentItem.image ? (
              <Image
                src={currentItem.image}
                alt={"cover" + currentItem.title}
                className="aspect-[29/40] rounded-sm object-cover"
                width={377}
                height={520}
                unoptimized={true}
              />
            ) : (
              <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
            )}
          </div>
          {details.length ? (
            <Paragraph className="m-4 line-clamp-6">
              {details.join(" • ")}
            </Paragraph>
          ) : null}
        </div>
        <div className="flex w-full flex-col justify-between gap-4 p-6">
          <Header vtag="h4" className="leading-tight">
            {currentItem.title}
          </Header>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="flex w-full flex-col justify-between gap-4"
            >
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
                                  variant={
                                    status === s ? "default" : "secondary"
                                  }
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

              <Separator />

              <FormField
                control={form.control}
                name="commentTitle"
                render={() => (
                  <FormItem>
                    <div className="flex w-full flex-col items-start gap-2">
                      <FormLabel>Сomment Title:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1 Season"
                          max={255}
                          onChange={(e) =>
                            form.setValue(
                              "commentTitle",
                              e.target.value ? e.target.value : null,
                            )
                          }
                          value={form.watch("commentTitle") ?? ""}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commentDescription"
                render={() => (
                  <FormItem>
                    <div className="flex w-full flex-col items-start gap-2">
                      <FormLabel>Сomment Description:</FormLabel>
                      <FormControl>
                        <AutosizeTextarea
                          placeholder="Good show, I liked it"
                          maxHeight={200}
                          maxLength={1000}
                          onChange={(e) =>
                            form.setValue(
                              "commentDescription",
                              e.target.value ? e.target.value : null,
                            )
                          }
                          value={form.watch("commentDescription") ?? ""}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <Button
                className="w-full"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                Add to collection
              </Button>
            </form>
          </Form>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { AddItemModal };
