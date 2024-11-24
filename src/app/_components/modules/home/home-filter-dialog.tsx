"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  DualRangeSlider,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../ui";
import { SORT_OPTIONS, STATUS_NAMES } from "../../../../constants";
import { SlidersHorizontal } from "lucide-react";
import { api } from "../../../../trpc/react";
import { GetUserItemsFilterType } from "../../../../server/api/modules/item/types";
import { ItemStatus } from "@prisma/client";

type Props = {
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
};

const HomeFilterDialog = (props: Props) => {
  const {
    yearsRange,
    filterFieldGroups,
    filterRates,
    filterYears,
    filtering,
    setFilterRates,
    setFilterYears,
    setFiltering,
  } = props;

  return (
    <>
      <ResponsiveModal>
        <ResponsiveModalTrigger asChild>
          <div className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground shadow">
            <Button size={"icon"} variant={"ghost"}>
              <SlidersHorizontal />
            </Button>
          </div>
        </ResponsiveModalTrigger>
        <ResponsiveModalContent className="overflow-hidden p-4 sm:max-w-2xl md:max-w-2xl lg:max-w-3xl [&>button]:hidden">
          <ScrollArea type="always">
            <div className="flex max-h-[400px] w-full flex-col gap-8 rounded-sm bg-background p-4 md:max-h-[700px]">
              <div className="flex items-center justify-between">
                <Header vtag="h4">Filter</Header>
                <Button onClick={() => setFiltering([])}>Clear</Button>
              </div>

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
              <div className="flex flex-col gap-2">
                <Header vtag="h6">Status</Header>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_NAMES).map(([status, name]) => {
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
                                f.name !== "status" || f.value !== typedStatus,
                            ) as GetUserItemsFilterType;
                            const currentFilter = prev.find(
                              (f) =>
                                f.name === "status" && f.value === typedStatus,
                            );
                            if (!currentFilter) {
                              updatedFiltering.push({
                                name: "status",
                                type: "include",
                                value: typedStatus,
                              });
                            } else if (currentFilter.type === "include") {
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
              {filterFieldGroups.map((fieldGroup) => (
                <div key={fieldGroup.id} className="flex flex-col gap-2">
                  <Header vtag="h6">{fieldGroup.name}</Header>
                  <div className="flex flex-wrap gap-2">
                    {fieldGroup.fields.map((field) => (
                      <Button
                        key={field.id}
                        variant={"ghost"}
                        size={"sm"}
                        className="text-muted-foreground"
                      >
                        {field.value}
                      </Button>
                    ))}
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
