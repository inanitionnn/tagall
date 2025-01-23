"use client";
import {
  Header,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../ui";
import type { ItemsStatsType } from "../../../../server/api/modules/item/types";
import { Container } from "../../shared";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type Props = {
  dateStats: ItemsStatsType["date"];
};

const ProfileDateStats = (props: Props) => {
  const { dateStats } = props;

  return (
    <Container className="flex-col pb-6 pr-8">
      <Header className="p-4" vtag="h4">
        By Date
      </Header>
      <ChartContainer
        config={{
          created: {
            label: "created",
            color: "hsl(var(--chart-1))",
          },
          updated: {
            label: "updated",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="min-h-[200px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={dateStats}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            width={45}
            dataKey="updated"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <CartesianGrid vertical={false} />
          <Area
            dataKey="created"
            type="natural"
            fill="var(--color-created)"
            fillOpacity={0.4}
            stroke="var(--color-created)"
            stackId="a"
          />
          <Area
            dataKey="updated"
            type="natural"
            fill="var(--color-updated)"
            fillOpacity={0.4}
            stroke="var(--color-updated)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </Container>
  );
};

export { ProfileDateStats };
