"use client";
import {
  AutosizeTextarea,
  Button,
  Header,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import type { ParseRegrexResult } from "../../../../server/api/modules/parse/types";
import { useParseRegrex } from "../../../../hooks";
import { CardContainer } from "../../shared";
import type { CollectionType } from "../../../../server/api/modules/collection/types";

type Props = {
  collections: CollectionType[];
  setItems: Dispatch<SetStateAction<ParseRegrexResult[]>>;
};

const ParseFormAccordion = (props: Props) => {
  const { setItems, collections } = props;

  const { form, submit } = useParseRegrex({
    defaultCollectionId: collections[0]?.id ?? "",
    setItems,
  });

  const formData = form.watch();

  return (
    <CardContainer>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="px-4">
            <Header vtag="h4" className="line-clamp-2">
              Parse media list
            </Header>
          </AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit)}
                className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4 sm:min-w-96"
              >
                <FormField
                  control={form.control}
                  name="collectionId"
                  render={() => (
                    <FormItem>
                      <div className="flex w-full flex-col gap-2">
                        <FormLabel>Collection:</FormLabel>

                        <div className="flex flex-wrap gap-2">
                          {collections.map((collection) => (
                            <FormControl key={collection.id}>
                              <Button
                                size={"sm"}
                                variant={
                                  formData.collectionId === collection.id
                                    ? "default"
                                    : "secondary"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("collectionId", collection.id);
                                }}
                              >
                                {collection.name}
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
                  name="url"
                  render={() => (
                    <FormItem>
                      <div className="flex w-full flex-col items-start gap-2">
                        <FormLabel>Link:</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            placeholder="https://www.best-site.com/movies-list"
                            max={255}
                            onChange={(e) =>
                              form.setValue("url", e.target.value)
                            }
                            value={form.watch("url") ?? ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="htmlQuery"
                  render={() => (
                    <FormItem>
                      <div className="flex w-full flex-col items-start gap-2">
                        <FormLabel>Html:</FormLabel>
                        <FormControl>
                          <AutosizeTextarea
                            placeholder={`<h3 class="_h3_137z8_1" data-testid="tile-title_testID">
<span>100.</span>&nbsp;Get Out (2017)
</h3>`}
                            maxHeight={600}
                            maxLength={1000}
                            onChange={(e) =>
                              form.setValue("htmlQuery", e.target.value)
                            }
                            value={formData.htmlQuery ?? ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userMessage"
                  render={() => (
                    <FormItem>
                      <div className="flex w-full flex-col items-start gap-2">
                        <FormLabel>Correction: (optional)</FormLabel>
                        <FormControl>
                          <AutosizeTextarea
                            placeholder={`Please, do something different..`}
                            maxHeight={200}
                            maxLength={1000}
                            required={false}
                            onChange={(e) =>
                              form.setValue("userMessage", e.target.value)
                            }
                            value={formData.userMessage ?? ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting}>Parse</Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContainer>
  );
};

export { ParseFormAccordion };
