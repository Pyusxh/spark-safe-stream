CREATE TABLE public.device_control (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manual_cutoff BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.device_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read device control"
  ON public.device_control FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update device control"
  ON public.device_control FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert device control"
  ON public.device_control FOR INSERT
  WITH CHECK (true);

INSERT INTO public.device_control (manual_cutoff) VALUES (false);

ALTER TABLE public.device_control REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_control;