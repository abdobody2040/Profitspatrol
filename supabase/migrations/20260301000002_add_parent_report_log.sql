-- ─── Migration: Monthly Parent Report Log ─────────────────────────────────────
-- Tracks when parent reports were sent to avoid duplicates and for auditing

CREATE TABLE IF NOT EXISTS public.parent_report_log (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  kid_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sent_at       TIMESTAMPTZ DEFAULT NOW(),
  month         TEXT NOT NULL,    -- e.g. '2026-03'
  email_status  TEXT DEFAULT 'sent'  -- 'sent' | 'failed'
);

-- RLS
ALTER TABLE public.parent_report_log ENABLE ROW LEVEL SECURITY;

-- Parents can only see logs for their own kids
CREATE POLICY "report_log_parent_read"
  ON public.parent_report_log FOR SELECT
  USING (parent_id = auth.uid());

-- Service role (Edge Function) can insert
CREATE POLICY "report_log_service_insert"
  ON public.parent_report_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = parent_id);

-- ─── Profile columns for Parent Report ────────────────────────────────────────
-- Add fields needed by ParentReport.tsx if they don't already exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS lessons_completed   INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gigs_completed      INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_days         INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS top_achievement     TEXT DEFAULT 'Completed first lesson!',
  ADD COLUMN IF NOT EXISTS monthly_report_enabled BOOLEAN DEFAULT TRUE;

-- ─── Profile columns for Seasonal Events ──────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS completed_seasonal_challenges TEXT[] DEFAULT '{}';

-- ─── Profile columns for Avatar Customizer ────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS inventory       JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS equipped_items  JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS biz_coins       INT DEFAULT 0;
