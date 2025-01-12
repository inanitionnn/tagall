import React, { type Dispatch, type SetStateAction } from "react";
import {
  Button,
  DualRangeSlider,
  Header,
  Input,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  ScrollArea,
} from "../../ui";
import { STATUS_NAMES } from "../../../../constants";
import { Search, SlidersHorizontal } from "lucide-react";
import type { GetUserItemsFilterType } from "../../../../server/api/modules/item/types";
import type { ItemStatus } from "@prisma/client";
import Container from "../../shared/container";
import type { TagType } from "../../../../server/api/modules/tag/types/tag.type";

type Props = {
  searchFilter: string;
  tags: TagType[];
  setSearchFilter: Dispatch<SetStateAction<string>>;
  filterFieldGroups: {
    fields: {
      value: string;
      id: string;
    }[];
    id: string;
    name: string;
    priority: number;
  }[];
  yearsRange: {
    minYear: number;
    maxYear: number;
  };
  filterRates: number[];
  setFilterRates: Dispatch<SetStateAction<number[]>>;
  filterYears: number[];
  setFilterYears: Dispatch<SetStateAction<number[]>>;
  filtering: GetUserItemsFilterType;
  setFiltering: Dispatch<SetStateAction<GetUserItemsFilterType>>;
  selectedTagsIds: string[];
  setSelectedTagsIds: Dispatch<SetStateAction<string[]>>;
};

const HomeFilterDialog = (props: Props) => {
  const {
    tags,
    selectedTagsIds,
    yearsRange,
    filterFieldGroups,
    filterRates,
    filterYears,
    filtering,
    setSelectedTagsIds,
    setFilterRates,
    setFilterYears,
    setFiltering,
    searchFilter,
    setSearchFilter,
  } = props;

  const filteredStatusNames = Object.entries(STATUS_NAMES).filter(([_, name]) =>
    name.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const filteredFieldGroups = filterFieldGroups
    .map((fieldGroup) => ({
      ...fieldGroup,
      fields: fieldGroup.fields.filter((field) =>
        field.value.toLowerCase().includes(searchFilter.toLowerCase()),
      ),
    }))
    .filter((fieldGroup) => fieldGroup.fields.length > 0);

  return (
    <>
      <ResponsiveModal>
        <ResponsiveModalTrigger asChild>
          <Container>
            <Button size={"icon"} variant={"ghost"}>
              <SlidersHorizontal />
            </Button>
          </Container>
        </ResponsiveModalTrigger>
        <ResponsiveModalContent className="p-4 sm:max-w-2xl md:max-w-2xl lg:max-w-3xl [&>button]:hidden">
          <ScrollArea type="always" className="max-h-[95%]">
            <div className="flex max-h-[400px] w-full flex-col gap-8 rounded-sm bg-background p-4 md:max-h-[700px]">
              <div className="flex items-center justify-between">
                <Header vtag="h4">Filter</Header>
                <Button
                  onClick={() => {
                    setFiltering([]);
                    setSearchFilter("");
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="relative">
                <Input
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />

                <Search className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500" />
              </div>
              {!searchFilter && (
                <div className="flex flex-col gap-4">
                  <Header vtag="h6">Years</Header>
                  <div className="px-6 pb-8">
                    <DualRangeSlider
                      label={(value) => value}
                      labelPosition="bottom"
                      value={filterYears}
                      onValueChange={setFilterYears}
                      min={yearsRange.minYear}
                      max={yearsRange.maxYear}
                      step={1}
                    />
                  </div>
                </div>
              )}
              {!searchFilter && (
                <div className="flex flex-col gap-4">
                  <Header vtag="h6">Rate</Header>
                  <div className="px-6 pb-8">
                    <DualRangeSlider
                      label={(value) => value}
                      labelPosition="bottom"
                      value={filterRates}
                      onValueChange={setFilterRates}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>
              )}
              {filteredStatusNames.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Header vtag="h6">Status</Header>
                  <div className="flex flex-wrap gap-2">
                    {filteredStatusNames.map(([status, name]) => {
                      const typedStatus = status as ItemStatus;
                      const statusFilter = filtering.find(
                        (f) => f.name === "status" && f.value === typedStatus,
                      );
                      return (
                        <Button
                          key={typedStatus}
                          variant={
                            statusFilter?.type === "include"
                              ? "success"
                              : statusFilter?.type === "exclude"
                                ? "destructive"
                                : "ghost"
                          }
                          size={"sm"}
                          onClick={() =>
                            setFiltering((prev) => {
                              const updatedFiltering = prev.filter(
                                (f) =>
                                  f.name !== "status" ||
                                  f.value !== typedStatus,
                              );
                              const selectedFilter = prev.find(
                                (f) =>
                                  f.name === "status" &&
                                  f.value === typedStatus,
                              );
                              if (!selectedFilter) {
                                updatedFiltering.push({
                                  name: "status",
                                  type: "include",
                                  value: typedStatus,
                                });
                              } else if (selectedFilter.type === "include") {
                                updatedFiltering.push({
                                  name: "status",
                                  type: "exclude",
                                  value: typedStatus,
                                });
                              }
                              return updatedFiltering;
                            })
                          }
                        >
                          {name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              {!!tags.length && (
                <div className="flex flex-col gap-2">
                  <Header vtag="h6">Tags</Header>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant={
                          selectedTagsIds.includes(tag.id) ? "success" : "ghost"
                        }
                        size={"sm"}
                        onClick={() =>
                          setSelectedTagsIds((prev) => {
                            if (prev.includes(tag.id)) {
                              return prev.filter((id) => id !== tag.id);
                            }
                            return [...prev, tag.id];
                          })
                        }
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {filteredFieldGroups.map((fieldGroup) => (
                <div key={fieldGroup.id} className="flex flex-col gap-2">
                  <Header vtag="h6">{fieldGroup.name}</Header>
                  <div className="flex flex-wrap gap-2">
                    {fieldGroup.fields.map((field) => {
                      const fieldFilter = filtering.find(
                        (f) => f.name === "field" && f.value === field.value,
                      );
                      return (
                        <Button
                          key={field.id}
                          variant={
                            fieldFilter?.type === "include"
                              ? "success"
                              : fieldFilter?.type === "exclude"
                                ? "destructive"
                                : "ghost"
                          }
                          size={"sm"}
                          onClick={() =>
                            setFiltering((prev) => {
                              const updatedFiltering = prev.filter(
                                (f) =>
                                  f.name !== "field" || f.value !== field.value,
                              );
                              const selectedFilter = prev.find(
                                (f) =>
                                  f.name === "field" && f.value === field.value,
                              );
                              if (!selectedFilter) {
                                updatedFiltering.push({
                                  name: "field",
                                  type: "include",
                                  value: field.value,
                                  fieldId: field.id,
                                });
                              } else if (selectedFilter.type === "include") {
                                updatedFiltering.push({
                                  name: "field",
                                  type: "exclude",
                                  value: field.value,
                                  fieldId: field.id,
                                });
                              }
                              return updatedFiltering;
                            })
                          }
                        >
                          {field.value}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
};

export { HomeFilterDialog };
