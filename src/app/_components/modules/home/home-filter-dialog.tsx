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
};

const HomeFilterDialog = (props: Props) => {
  const {
    yearsRange,
    filterFieldGroups,
    filterRates,
    filterYears,
    setFilterRates,
    setFilterYears,
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
        <ResponsiveModalContent className="p-0 sm:max-w-2xl md:max-w-2xl lg:max-w-3xl">
          <ScrollArea
            className="flex max-h-[400px] w-full flex-col gap-4 rounded-sm bg-background p-6 md:max-h-[700px]"
            type="always"
          >
            <div className="flex flex-col gap-2">
              <Header vtag="h6">Years</Header>
              <DualRangeSlider
                // label={(value) => value}
                value={filterYears}
                onValueChange={setFilterYears}
                min={yearsRange.minYear}
                max={yearsRange.maxYear}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Header vtag="h6">Rate</Header>
              <DualRangeSlider
                // label={(value) => value}
                value={filterRates}
                onValueChange={setFilterRates}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Header vtag="h6">Status</Header>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_NAMES).map(([status, name]) => (
                  <Button
                    key={status}
                    variant={"ghost"}
                    size={"sm"}
                    className="text-muted-foreground"
                  >
                    {name}
                  </Button>
                ))}
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
          </ScrollArea>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
};

export { HomeFilterDialog };
