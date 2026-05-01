import { ShieldCheck, AlertTriangle, Activity, OctagonX } from "lucide-react";

interface Props {
  theftActive: boolean;
  manualCutoff: boolean;
  lastUpdate: Date | null;
}

export function StatusHeader({ theftActive, manualCutoff, lastUpdate }: Props) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl glass">
          <Activity className="h-5 w-5 text-neon-blue" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Power Theft Detection
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            IoT Grid Monitor · Live Telemetry
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdate && (
          <div className="hidden items-center gap-2 text-xs text-muted-foreground font-mono sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse-dot" />
            LIVE · {lastUpdate.toLocaleTimeString()}
          </div>
        )}

        {theftActive ? (
          <div
            className="flex items-center gap-2.5 rounded-full px-5 py-2.5 font-bold uppercase tracking-wider text-white animate-pulse-red"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">⚠️ Theft Detected — Power Cut</span>
          </div>
        ) : manualCutoff ? (
          <div
            className="flex items-center gap-2.5 rounded-full px-5 py-2.5 font-bold uppercase tracking-wider text-white"
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.22 45), oklch(0.6 0.26 25))",
              boxShadow: "0 0 30px oklch(0.65 0.24 35 / 0.5), 0 0 80px oklch(0.65 0.24 35 / 0.25)",
            }}
            role="alert"
          >
            <OctagonX className="h-4 w-4" />
            <span className="text-sm">🛑 Power Cut (Manual Override)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-full glass glow-green px-5 py-2.5">
            <ShieldCheck className="h-4 w-4 text-neon-green" />
            <span className="text-sm font-bold uppercase tracking-wider text-neon-green">
              ✅ System Secure
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
