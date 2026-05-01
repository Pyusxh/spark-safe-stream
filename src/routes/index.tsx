import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Home, AlertOctagon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { PowerLog } from "@/lib/power-logs";
import { StatusHeader } from "@/components/StatusHeader";
import { MetricCard } from "@/components/MetricCard";
import { UsageChart } from "@/components/UsageChart";
import { TheftChart } from "@/components/TheftChart";
import { SimulatorBar } from "@/components/SimulatorBar";
import { KillSwitch } from "@/components/KillSwitch";
import { FinancialImpactCard } from "@/components/FinancialImpactCard";
import { AIHealthCard } from "@/components/AIHealthCard";
import { ExportButton } from "@/components/ExportButton";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Power Theft Detection · Live IoT Dashboard" },
      {
        name: "description",
        content:
          "Real-time IoT monitoring dashboard for detecting electrical power theft via differential current analysis.",
      },
    ],
  }),
});

const MAX_POINTS = 60;

function Dashboard() {
  const [logs, setLogs] = useState<PowerLog[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [manualCutoff, setManualCutoff] = useState(false);
  const [controlId, setControlId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase
        .from("power_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(MAX_POINTS);
      if (mounted && data) {
        setLogs((data as PowerLog[]).slice().reverse());
        if (data.length) setLastUpdate(new Date());
      }

      const { data: ctrl } = await supabase
        .from("device_control")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (mounted && ctrl) {
        setControlId(ctrl.id);
        setManualCutoff(ctrl.manual_cutoff);
      }
    })();

    const channel = supabase
      .channel("power_logs_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "power_logs" },
        (payload) => {
          const row = payload.new as PowerLog;
          setLogs((prev) => {
            const next = [...prev, row];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
          });
          setLastUpdate(new Date());
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "device_control" },
        (payload) => {
          const row = payload.new as { id: string; manual_cutoff: boolean };
          if (row?.id) {
            setControlId(row.id);
            setManualCutoff(row.manual_cutoff);
          }
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const latest = logs[logs.length - 1];
  const mainCurrent = latest ? Number(latest.main_current) : 0;
  const loadCurrent = latest ? Number(latest.load_current) : 0;
  const difference = latest ? Number(latest.difference) : 0;
  const theftActive = latest?.theft_active ?? false;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <StatusHeader
            theftActive={theftActive}
            manualCutoff={manualCutoff}
            lastUpdate={lastUpdate}
          />
          <div className="flex justify-end">
            <ExportButton data={logs} />
          </div>
        </div>

        <KillSwitch active={manualCutoff} controlId={controlId} />

        <SimulatorBar />

        {/* Bento grid: 6 columns on desktop, asymmetric */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Row 1: 3 metric cards (2 cols each) */}
          <div className="lg:col-span-2">
            <MetricCard
              label="Main Current"
              value={mainCurrent}
              unit="A"
              icon={Zap}
              variant="blue"
              alert
            />
          </div>
          <div className="lg:col-span-2">
            <MetricCard
              label="House Load"
              value={loadCurrent}
              unit="A"
              icon={Home}
              variant="green"
              alert
            />
          </div>
          <div className="lg:col-span-2">
            <MetricCard
              label="Leakage / Δ"
              value={difference}
              unit="A"
              icon={AlertOctagon}
              variant="red"
              alert={theftActive}
            />
          </div>

          {/* Row 2: Financial (4 cols) + AI Health (2 cols) */}
          <div className="lg:col-span-4">
            <FinancialImpactCard difference={difference} active={theftActive} />
          </div>
          <div className="lg:col-span-2">
            <AIHealthCard />
          </div>

          {/* Row 3: Two large charts (3 cols each) */}
          <div className="lg:col-span-3">
            <UsageChart data={logs} />
          </div>
          <div className="lg:col-span-3">
            <TheftChart data={logs} />
          </div>
        </div>

        <footer className="pt-4 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Powered by Lovable Cloud · Realtime telemetry over WebSocket
        </footer>
      </div>
    </main>
  );
}
