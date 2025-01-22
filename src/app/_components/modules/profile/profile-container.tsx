"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  LabelList,
  Label,
  Pie,
  PieChart,
} from "recharts";
import { api } from "../../../../trpc/react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Header,
} from "../../ui";
import { ProfileUpdateUserModal } from "./profile-update-user-modal";
import Container from "../../shared/container";
import { useEffect, useState } from "react";
import type { ItemsStatsType } from "../../../../server/api/modules/item/types";
import { toast } from "sonner";
import Loaging from "../../../loading";
import { HomeCollectionsTabs } from "../home/home-collections-tabs";
import { useDebounce } from "../../../../hooks";

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const [stats, setStats] = useState<ItemsStatsType | null>(null);
  const [selectedCollectionsIds, setselectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedCollectionsIds = useDebounce<string[]>(
    selectedCollectionsIds,
    300,
  );

  const { data, error } = api.item.getUserItemsStats.useQuery(
    debouncedCollectionsIds,
  );

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6 p-8">
      <ProfileUpdateUserModal user={user} />
      <HomeCollectionsTabs
        collections={collections}
        selectedCollectionsIds={selectedCollectionsIds}
        setselectedCollectionsIds={setselectedCollectionsIds}
      />
      {stats ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              className="min-h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Pie
                  data={stats.status.map((s) => ({
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
                              {stats.all.toLocaleString()}
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

          <Container className="flex-col pb-6 pr-8">
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
              className="min-h-[200px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={stats.rate.filter((r) => r.rate)}
              >
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
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                <CartesianGrid vertical={false} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="block fill-muted-foreground md:hidden"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </Container>

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
                data={stats.date}
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
        </div>
      ) : (
        <Loaging />
      )}
    </div>
  );
}
export { ProfileContainer };
