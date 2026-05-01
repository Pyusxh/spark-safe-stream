import { IndianRupee, TrendingDown } from "lucide-react";

interface Props {
  difference: number;
  active: boolean;
}

export function FinancialImpactCard({ difference, active }: Props) {
  // (difference [A] * 220 [V] * 8 [hrs])/1000 → kWh-cost approximation in INR/hr basis
  const lossPerHour = Math.max(0, (difference * 220 * 8) / 1000);

  return (
    <div
      className={`glass relative h-full overflow-hidden rounded-2xl p-6 transition ${
        active ? "glow-red" : ""
      }`}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      {active && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.7 0.28 22 / 0.25), transparent 60%)",
          }}
        />
      )}

      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Financial Impact
            </span>
            <h3
              className={`mt-1 font-display text-base font-bold ${
                active ? "text-neon-red" : "text-foreground"
              }`}
            >
              {active ? "Active Power Drain" : "No Loss Detected"}
            </h3>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              active ? "bg-neon-red/20 text-neon-red" : "bg-white/5 text-muted-foreground"
            }`}
          >
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <IndianRupee
              className={`h-7 w-7 ${active ? "text-neon-red" : "text-foreground"}`}
            />
            <span
              className={`font-mono text-5xl font-bold tabular-nums ${
                active ? "text-neon-red" : "text-foreground"
              }`}
            >
              {lossPerHour.toFixed(2)}
            </span>
            <span className="text-base font-mono text-muted-foreground">/ hr</span>
          </div>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Estimated Drain · 220V · Continuous Load Model
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-muted-foreground">Δ × 220V × 8h ÷ 1000</span>
          <span className={active ? "text-neon-red" : "text-neon-green"}>
            {active ? "● BILLING IMPACT" : "● NOMINAL"}
          </span>
        </div>
      </div>
    </div>
  );
}
