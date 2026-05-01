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
        <StatusHeader theftActive={theftActive} lastUpdate={lastUpdate} />

        <SimulatorBar />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            label="Main Current"
            value={mainCurrent}
            unit="A"
            icon={Zap}
            variant="blue"
            alert
          />
          <MetricCard
            label="House Load"
            value={loadCurrent}
            unit="A"
            icon={Home}
            variant="green"
            alert
          />
          <MetricCard
            label="Leakage / Δ"
            value={difference}
            unit="A"
            icon={AlertOctagon}
            variant="red"
            alert={theftActive}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UsageChart data={logs} />
          <TheftChart data={logs} />
        </div>

        <footer className="pt-4 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Powered by Lovable Cloud · Realtime telemetry over WebSocket
        </footer>
      </div>
    </main>
  );
}
