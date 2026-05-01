import { BrainCircuit } from "lucide-react";

export function AIHealthCard() {
  return (
    <div className="glass relative h-full overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Scanning radar sweep */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.78 0.2 230 / 0.6) 40deg, transparent 80deg)",
          animation: "ai-radar 3.5s linear infinite",
        }}
      />

      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Inference Engine
            </span>
            <h3 className="mt-1 font-display text-base font-bold text-foreground">
              AI Load Profiling
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-blue/15 text-neon-blue">
            <BrainCircuit className="h-5 w-5" />
          </div>
        </div>

        {/* Sine wave visual */}
        <div className="flex h-12 items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 40" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.78 0.2 230)" stopOpacity="0" />
                <stop offset="50%" stopColor="oklch(0.78 0.2 230)" stopOpacity="1" />
                <stop offset="100%" stopColor="oklch(0.78 0.2 230)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,20 Q25,4 50,20 T100,20 T150,20 T200,20"
              fill="none"
              stroke="url(#sineGrad)"
              strokeWidth="2"
              style={{ animation: "ai-sine 2.4s ease-in-out infinite" }}
            />
            <path
              d="M0,20 Q25,32 50,20 T100,20 T150,20 T200,20"
              fill="none"
              stroke="oklch(0.85 0.24 145)"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              style={{ animation: "ai-sine 2.4s ease-in-out infinite reverse" }}
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse-dot" />
            <span className="font-mono text-sm font-bold text-neon-green">
              Active — Baseline Established
            </span>
          </div>
          <p className="mt-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Pattern recognition · Anomaly threshold ±0.3A
          </p>
        </div>
      </div>
    </div>
  );
}
