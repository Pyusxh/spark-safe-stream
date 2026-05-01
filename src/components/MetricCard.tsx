import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  variant: "blue" | "green" | "red";
  alert?: boolean;
}

const variants = {
  blue: { text: "text-neon-blue", glow: "glow-blue", dot: "bg-neon-blue" },
  green: { text: "text-neon-green", glow: "glow-green", dot: "bg-neon-green" },
  red: { text: "text-neon-red", glow: "glow-red", dot: "bg-neon-red" },
};

export function MetricCard({ label, value, unit, icon: Icon, variant, alert }: Props) {
  const v = variants[variant];
  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-6 ${alert ? v.glow : ""}`}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${v.text}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`font-mono text-5xl font-bold tabular-nums ${v.text}`}>
            {value.toFixed(2)}
          </span>
          <span className="text-lg font-mono text-muted-foreground">{unit}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${v.dot} animate-pulse-dot`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Streaming
          </span>
        </div>
      </div>
    </div>
  );
}
