"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

type GraphData = { date: string; amount: number };

export function Graph({ data }: { data: GraphData[] }) {
  return (
    <ChartContainer
      config={{
        amount: {
          label: "Amount",
          theme: {
            light: "#2563eb",
            dark: "#60a5fa",
          },
        },
      }}
      className="min-h-[300px] w-full"
    >
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis dataKey="amount" />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="var(--color-amount)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
}
