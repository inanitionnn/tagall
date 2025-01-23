"use client";
import {
  Header,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui";
import type { ItemsStatsType } from "../../../../server/api/modules/item/types";
import { CardContainer } from "../../shared";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  rateStats: ItemsStatsType["rate"];
};

const ProfileRateStats = (props: Props) => {
  const { rateStats } = props;

  return (
    <CardContainer className="flex-col pb-6 pr-8">
      <Header className="p-4" vtag="h4">
        By Rate
      </Header>
      <ChartContainer
        config={{
          count: {
            label: "Rates",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full min-h-[200px] w-full"
      >
        <BarChart accessibilityLayer data={rateStats.filter((r) => r.rate)}>
          <XAxis
            dataKey="rate"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <YAxis
            width={45}
            dataKey="count"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <CartesianGrid vertical={false} />
          <Bar dataKey="count" fill="var(--color-count)" radius={8}>
            <LabelList
              position="top"
              offset={6}
              className="block fill-muted-foreground md:hidden"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContainer>
  );
};

export { ProfileRateStats };
