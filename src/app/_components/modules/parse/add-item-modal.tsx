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
import type { TagType } from "../../../../server/api/modules/tag/types";
import { Truthy } from "../../../../lib";
import { useAddItemToCollection } from "../../../../hooks";

type Props = {
  open: boolean;
  tags: TagType[];
  selectedItem: SearchResultType;
  selectedCollectionId: string;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

const AddItemModal = (props: Props) => {
  const { selectedItem, open, setSelectedItem, tags } = props;

  const { form, submit } = useAddItemToCollection(props);

  const status = form.watch("status");
  const rating = form.watch("rate");
  const tagsIds = form.watch("tagsIds");
  const details = [selectedItem.year, ...selectedItem.keywords].filter(Truthy);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedItem(null);
        }
      }}
    >
      <ResponsiveModalContent className="h-min min-h-64 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <div className="space-y-6 p-4">
          <Header vtag="h4" className="text-center">
            {selectedItem.title}
          </Header>

          <div className="gap flex flex-col gap-6 sm:flex-row">
            <div className="hidden flex-col gap-4 sm:flex sm:w-[400px] lg:w-[500px]">
              <div className="aspect-[27/40] rounded-sm sm:block">
                {selectedItem.image ? (
                  <Image
                    src={selectedItem.image}
                    alt={"cover" + selectedItem.title}
                    className="aspect-[27/40] rounded-sm object-cover"
                    width={377}
                    height={520}
                    unoptimized={true}
                  />
                ) : (
                  <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
                )}
              </div>
              {details.length ? (
                <Paragraph className="m-4 line-clamp-6">
                  {details.join(" • ")}
                </Paragraph>
              ) : null}
            </div>
            <div className="w-full">
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
                        <div className="flex flex-col gap-2">
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

                  <FormField
                    control={form.control}
                    name="tagsIds"
                    render={() => (
                      <FormItem>
                        <div className="flex w-full flex-col gap-2">
                          <FormLabel>Tags:</FormLabel>

                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <FormControl key={tag.id}>
                                <Button
                                  size={"sm"}
                                  variant={
                                    tagsIds?.find((c) => c === tag.id)
                                      ? "default"
                                      : "secondary"
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    form.setValue(
                                      "tagsIds",
                                      tagsIds.includes(tag.id)
                                        ? tagsIds.filter((c) => c !== tag.id)
                                        : [...tagsIds, tag.id],
                                    );
                                  }}
                                >
                                  {tag.name}
                                </Button>
                              </FormControl>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { AddItemModal };
