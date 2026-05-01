import { Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  active: boolean;
  controlId: string | null;
}

export function KillSwitch({ active, controlId }: Props) {
  const handleToggle = async () => {
    if (!controlId) return;
    await supabase
      .from("device_control")
      .update({ manual_cutoff: !active, updated_at: new Date().toISOString() })
      .eq("id", controlId);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!controlId}
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-6 py-5 transition-all disabled:opacity-50 ${
        active
          ? "glass glow-red border-neon-red/40 bg-neon-red/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
            active
              ? "bg-neon-red/30 text-neon-red animate-pulse-dot"
              : "bg-white/5 text-muted-foreground group-hover:text-foreground"
          }`}
        >
          <Power className="h-6 w-6" />
        </div>
        <div className="text-left">
          <div
            className={`font-display text-base font-bold uppercase tracking-wider ${
              active ? "text-neon-red" : "text-foreground"
            }`}
          >
            Emergency Power Cut
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {active ? "Manual override engaged · Click to restore" : "Tap to remotely disconnect load"}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
          active
            ? "border-neon-red/50 bg-neon-red/20 text-neon-red"
            : "border-white/10 bg-white/5 text-muted-foreground"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            active ? "bg-neon-red animate-pulse-dot" : "bg-muted-foreground/50"
          }`}
        />
        {active ? "ACTIVE" : "STANDBY"}
      </div>
    </button>
  );
}
