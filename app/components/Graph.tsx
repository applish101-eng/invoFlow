"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

interface iAppProps {
  data: { date: string; amount: number }[];
}
export function Graph({ data }: iAppProps) {
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
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              style={{ stopColor: "var(--color-amount)" }}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              style={{ stopColor: "var(--color-amount)" }}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis dataKey="amount" />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          type="monotone"
          dataKey="amount"
          fill="url(#fillAmount)"
          stroke="var(--color-amount)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
