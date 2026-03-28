-- ─── Migration: Corporations / Guilds ────────────────────────────────────────
-- Creates corporations and corporation_members tables with RLS policies

-- Corporations table
CREATE TABLE IF NOT EXISTS public.corporations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  code        TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6)),
  logo_icon   TEXT DEFAULT 'building',
  logo_emoji  TEXT DEFAULT '🏢',
  logo_color  TEXT DEFAULT '#6366f1',
  motto       TEXT DEFAULT 'Building the future together',
  founder_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  corp_xp     INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Corporation members table
CREATE TABLE IF NOT EXISTS public.corporation_members (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corporation_id   UUID REFERENCES public.corporations(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role             TEXT DEFAULT 'Member',   -- CEO | COO | Member
  joined_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)  -- one corp per user at a time
);

-- RLS
ALTER TABLE public.corporations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporation_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read corporations (for search/join)
CREATE POLICY "corps_read_all"
  ON public.corporations FOR SELECT
  USING (true);

-- Only authenticated users can create a corporation
CREATE POLICY "corps_insert_auth"
  ON public.corporations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only CEO can update corporation settings
CREATE POLICY "corps_ceo_update"
  ON public.corporations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.corporation_members
      WHERE corporation_id = corporations.id
        AND user_id = auth.uid()
        AND role = 'CEO'
    )
  );

-- Only CEO can delete
CREATE POLICY "corps_ceo_delete"
  ON public.corporations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.corporation_members
      WHERE corporation_id = corporations.id
        AND user_id = auth.uid()
        AND role = 'CEO'
    )
  );

-- Members can read all memberships in their corporation
CREATE POLICY "corp_members_read"
  ON public.corporation_members FOR SELECT
  USING (true);

-- Users can only insert their own membership row
CREATE POLICY "corp_members_insert"
  ON public.corporation_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own membership (leave)
CREATE POLICY "corp_members_delete"
  ON public.corporation_members FOR DELETE
  USING (user_id = auth.uid());
