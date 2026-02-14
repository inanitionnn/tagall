"use client";
import {
  Header,
  ChartContainer,
  ChartTooltip,
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
import { RATING_NAMES } from "../../../../constants/rate-names.const";
import type { TooltipProps } from "recharts";

type Props = {
  rateStats: ItemsStatsType["rate"];
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload as {
      rate: string;
      rateNumber: string;
      count: number;
    };
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{data.rate}</span>
          <span className="text-muted-foreground">{data.count}</span>
        </div>
      </div>
    );
  }
  return null;
};

const ProfileRateStats = (props: Props) => {
  const { rateStats } = props;

  const chartData = rateStats
    .filter((r) => r.rate)
    .map((r) => ({
      rate: RATING_NAMES[r.rate] || r.rate.toString(),
      rateNumber: r.rate.toString(),
      count: r.count,
    }));

  return (
    <CardContainer className="flex-col pb-6 pr-8">
      <Header className="p-4" vtag="h4">
        By Rate
      </Header>
      <ChartContainer
        config={{
          count: {
            label: "count",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full min-h-[200px] w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <XAxis
            dataKey="rateNumber"
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
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
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
