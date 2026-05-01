import { useEffect, useRef, useState } from "react";
import { Play, Pause, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SimulatorBar() {
  const [running, setRunning] = useState(false);
  const [theftMode, setTheftMode] = useState(false);
  const theftModeRef = useRef(false);

  useEffect(() => {
    theftModeRef.current = theftMode;
  }, [theftMode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(async () => {
      const main = 10 + Math.random() * 2;
      const theft = theftModeRef.current;
      const load = theft ? main - (1.5 + Math.random() * 1.5) : main - (0.1 + Math.random() * 0.4);
      const diff = main - load;
      await supabase.from("power_logs").insert({
        main_current: Number(main.toFixed(3)),
        load_current: Number(load.toFixed(3)),
        difference: Number(diff.toFixed(3)),
        theft_active: theft,
      });
    }, 1500);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <Zap className="h-4 w-4 text-neon-amber" />
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Device Simulator
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition hover:bg-white/10"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? "Pause" : "Start"} Stream
        </button>
        <button
          onClick={() => setTheftMode((t) => !t)}
          disabled={!running}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition disabled:opacity-40 ${
            theftMode
              ? "bg-neon-red/20 text-neon-red glow-red"
              : "bg-white/5 text-foreground hover:bg-white/10"
          }`}
        >
          {theftMode ? "⚠ Theft Active" : "Trigger Theft"}
        </button>
      </div>
    </div>
  );
}
