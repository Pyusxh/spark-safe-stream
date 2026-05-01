import { Download } from "lucide-react";
import type { PowerLog } from "@/lib/power-logs";

interface Props {
  data: PowerLog[];
}

export function ExportButton({ data }: Props) {
  const handleExport = () => {
    if (!data.length) return;
    const headers = ["timestamp", "main_current_A", "load_current_A", "difference_A", "theft_active"];
    const rows = data.map((d) =>
      [
        new Date(d.created_at).toISOString(),
        Number(d.main_current).toFixed(3),
        Number(d.load_current).toFixed(3),
        Number(d.difference).toFixed(3),
        d.theft_active ? "true" : "false",
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `power-logs-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data.length}
      className="glass flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition hover:border-neon-blue/40 hover:text-neon-blue disabled:opacity-40"
    >
      <Download className="h-3.5 w-3.5" />
      Export Logs (CSV)
    </button>
  );
}
