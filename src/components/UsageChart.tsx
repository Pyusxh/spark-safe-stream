import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PowerLog } from "@/lib/power-logs";

interface Props {
  data: PowerLog[];
}

export function UsageChart({ data }: Props) {
  const chartData = data.map((d) => ({
    time: new Date(d.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    main: Number(d.main_current),
    load: Number(d.load_current),
  }));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Live Current Flow</h2>
          <p className="text-xs font-mono text-muted-foreground">
            Main Grid vs House Load · Real-Time
          </p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-blue" />
            <span className="text-neon-blue">MAIN</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-green" />
            <span className="text-neon-green">LOAD</span>
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                border: "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: 12,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.85 0.02 250)" }}
            />
            <Legend wrapperStyle={{ display: "none" }} />
            <Line
              type="monotone"
              dataKey="main"
              name="Main Current"
              stroke="oklch(0.78 0.2 230)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="load"
              name="Load Current"
              stroke="oklch(0.85 0.24 145)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
