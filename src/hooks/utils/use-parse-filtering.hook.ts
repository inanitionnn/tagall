import { useEffect, useState } from "react";
import type { GetUserItemsFilterType } from "../../server/api/modules/item/types";

type Props = {
  collectionsIds: string[];
  yearsRange: {
    minYear: number;
    maxYear: number;
  };
};

export const useParseFiltering = (props: Props) => {
  const { yearsRange, collectionsIds } = props;

  const [filtering, setFiltering] = useState<GetUserItemsFilterType>([]);
  const [filterRates, setFilterRates] = useState<number[]>([1, 10]);
  const [filterYears, setFilterYears] = useState<number[]>([
    yearsRange.minYear,
    yearsRange.maxYear,
  ]);

  useEffect(() => {
    const fromRate = filtering
      .filter((f) => f.name === "rate")
      .find((f) => f.type === "from");
    const toRate = filtering
      .filter((f) => f.name === "rate")
      .find((f) => f.type === "to");
    const newFilterRates = [fromRate?.value ?? 1, toRate?.value ?? 10];
    if (
      newFilterRates[0] !== filterRates[0] ||
      newFilterRates[1] !== filterRates[1]
    ) {
      setFilterRates(newFilterRates);
    }

    const fromYear = filtering
      .filter((f) => f.name === "year")
      .find((f) => f.type === "from");
    const toYear = filtering
      .filter((f) => f.name === "year")
      .find((f) => f.type === "to");
    const newFilterYears = [
      fromYear?.value ?? yearsRange.minYear,
      toYear?.value ?? yearsRange.maxYear,
    ];
    if (
      newFilterYears[0] !== filterYears[0] ||
      newFilterYears[1] !== filterYears[1]
    ) {
      setFilterYears(newFilterYears);
    }
  }, [filtering]);

  useEffect(() => {
    setFilterYears([yearsRange.minYear, yearsRange.maxYear]);
  }, [yearsRange]);

  useEffect(() => {
    const fromRate = filterRates[0];
    const toRate = filterRates[1];
    setFiltering((prev) => {
      const updatedFiltering = prev.filter(
        (f) => f.name !== "rate",
      ) as GetUserItemsFilterType;

      if (fromRate && fromRate !== 1) {
        updatedFiltering.push({ name: "rate", type: "from", value: fromRate });
      }

      if (toRate && toRate !== 10) {
        updatedFiltering.push({ name: "rate", type: "to", value: toRate });
      }

      return updatedFiltering;
    });
  }, [filterRates]);

  useEffect(() => {
    const fromYear = filterYears[0];
    const toYear = filterYears[1];
    setFiltering((prev) => {
      const updatedFiltering = prev.filter(
        (f) => f.name !== "year",
      ) as GetUserItemsFilterType;

      if (fromYear && fromYear !== yearsRange.minYear) {
        updatedFiltering.push({ name: "year", type: "from", value: fromYear });
      }

      if (toYear && toYear !== yearsRange.maxYear) {
        updatedFiltering.push({ name: "year", type: "to", value: toYear });
      }

      return updatedFiltering;
    });
  }, [filterYears]);

  useEffect(() => {
    setFiltering([]);
    setFilterRates([1, 10]);
    setFilterYears([yearsRange.minYear, yearsRange.maxYear]);
  }, [collectionsIds]);

  return {
    filterYears,
    setFilterYears,
    filterRates,
    setFilterRates,
    filtering,
    setFiltering,
  };
};
