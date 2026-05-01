CREATE TABLE public.power_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  main_current NUMERIC NOT NULL DEFAULT 0,
  load_current NUMERIC NOT NULL DEFAULT 0,
  difference NUMERIC NOT NULL DEFAULT 0,
  theft_active BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_power_logs_created_at ON public.power_logs (created_at DESC);

ALTER TABLE public.power_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read power logs"
  ON public.power_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert power logs"
  ON public.power_logs FOR INSERT
  WITH CHECK (true);

ALTER TABLE public.power_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.power_logs;