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
import { Label, Pie, PieChart } from "recharts";

type Props = {
  all: number;
  statusStats: ItemsStatsType["status"];
};

const ProfileStatusStats = (props: Props) => {
  const { all, statusStats } = props;

  return (
    <Container className="flex-col pb-6 pr-8">
      <Header className="pl-4 pt-4" vtag="h4">
        By Status
      </Header>
      <ChartContainer
        config={{
          count: {
            label: "count",
          },
          ABANDONED: {
            label: "Abandoned",
            color: "hsl(var(--chart-5))",
          },
          COMPLETED: {
            label: "Completed",
            color: "hsl(var(--chart-1))",
          },
          INPROGRESS: {
            label: "In Progress",
            color: "hsl(var(--chart-2))",
          },
          NOTSTARTED: {
            label: "Not Started",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="min-h-[400px] w-full xl:min-h-[200px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend
            className="flex-col xl:flex-row"
            content={<ChartLegendContent />}
          />
          <Pie
            data={statusStats.map((s) => ({
              ...s,
              fill: `var(--color-${s.status})`,
            }))}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {all.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Items
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </Container>
  );
};

export { ProfileStatusStats };
