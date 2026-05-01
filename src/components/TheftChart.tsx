import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { PowerLog } from "@/lib/power-logs";

interface Props {
  data: PowerLog[];
}

export function TheftChart({ data }: Props) {
  const chartData = data.map((d) => ({
    time: new Date(d.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    diff: Number(d.difference),
  }));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Leakage Analysis</h2>
          <p className="text-xs font-mono text-muted-foreground">
            Differential Current · Theft Signature
          </p>
        </div>
        <span className="flex items-center gap-2 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-neon-red animate-pulse-dot" />
          <span className="text-neon-red">DELTA</span>
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="theftGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.28 22)" stopOpacity={0.85} />
                <stop offset="100%" stopColor="oklch(0.7 0.28 22)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
            <XAxis
              dataKey="time"
              stroke="oklch(0.7 0.03 250)"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              minTickGap={40}
            />
            <YAxis
              stroke="oklch(0.7 0.03 250)"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              unit="A"
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.18 0.03 260 / 0.95)",
                border: "1px solid oklch(0.7 0.28 22 / 0.4)",
                borderRadius: 12,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.85 0.02 250)" }}
            />
            <Area
              type="monotone"
              dataKey="diff"
              name="Difference"
              stroke="oklch(0.7 0.28 22)"
              strokeWidth={2.5}
              fill="url(#theftGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
