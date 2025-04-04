
import { ReactNode } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

interface DataChartProps {
  data: any[];
  type: "area" | "line";
  xKey: string;
  yKey: string;
  secondaryKey?: string;
  title: string;
  height?: number;
  gradient?: {
    from: string;
    to: string;
  };
  children?: ReactNode;
}

export function DataChart({
  data,
  type,
  xKey,
  yKey,
  secondaryKey,
  title,
  height = 300,
  gradient = { from: "#93C5FD", to: "#1E293B" },
  children,
}: DataChartProps) {
  const ChartComponent = type === "area" ? AreaChart : LineChart;

  return (
    <Card className="p-6 w-full">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradient.from} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradient.to} stopOpacity={0} />
            </linearGradient>
            {secondaryKey && (
              <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            label={{ value: xKey, position: "bottom" }}
          />
          <YAxis
            label={{ value: yKey, angle: -90, position: "left" }}
          />
          <Tooltip />
          <Legend />
          {type === "area" ? (
            <>
              <Area
                type="monotone"
                dataKey={yKey}
                stroke={gradient.from}
                fill="url(#colorGradient)"
                name={yKey}
              />
              {secondaryKey && (
                <Area
                  type="monotone"
                  dataKey={secondaryKey}
                  stroke="#F59E0B"
                  fill="url(#secondaryGradient)"
                  name={secondaryKey}
                />
              )}
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={gradient.from}
                name={yKey}
              />
              {secondaryKey && (
                <Line
                  type="monotone"
                  dataKey={secondaryKey}
                  stroke="#F59E0B"
                  name={secondaryKey}
                />
              )}
            </>
          )}
          {children}
        </ChartComponent>
      </ResponsiveContainer>
    </Card>
  );
}
