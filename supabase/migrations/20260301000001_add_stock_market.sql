-- ─── Migration: Stock Market Simulation ──────────────────────────────────────
-- Creates stock_companies, stock_portfolio tables and seeds fictional companies

-- Stock companies catalog
CREATE TABLE IF NOT EXISTS public.stock_companies (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  sector        TEXT,         -- 'Tech' | 'Retail' | 'Energy' | 'Finance' | 'Logistics'
  description   TEXT,
  emoji         TEXT DEFAULT '📈',
  current_price INT NOT NULL DEFAULT 100,
  price_history JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User stock portfolios
CREATE TABLE IF NOT EXISTS public.stock_portfolio (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stock_id        TEXT REFERENCES public.stock_companies(id) ON DELETE CASCADE,
  quantity        INT DEFAULT 0,
  avg_buy_price   INT,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stock_id)
);

-- RLS
ALTER TABLE public.stock_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_portfolio ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read stock companies
CREATE POLICY "stocks_read_all"
  ON public.stock_companies FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only service role can update prices (done via Edge Function)
CREATE POLICY "stocks_service_update"
  ON public.stock_companies FOR UPDATE
  USING (auth.role() = 'service_role');

-- Users can only see their own portfolio
CREATE POLICY "portfolio_own_select"
  ON public.stock_portfolio FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own portfolio rows
CREATE POLICY "portfolio_own_insert"
  ON public.stock_portfolio FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own portfolio (buy/sell)
CREATE POLICY "portfolio_own_update"
  ON public.stock_portfolio FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own portfolio rows (sell all)
CREATE POLICY "portfolio_own_delete"
  ON public.stock_portfolio FOR DELETE
  USING (user_id = auth.uid());

-- ─── Seed: 8 Fictional Companies ─────────────────────────────────────────────
INSERT INTO public.stock_companies (id, name, sector, description, emoji, current_price, price_history)
VALUES
  ('ollie_robotics',  'Ollie Robotics',    'Tech',      'AI-powered robots that help kids learn coding',  '🤖', 120, '[]'),
  ('lemoco_inc',      'LemoCo Inc.',        'Retail',    'The world''s biggest virtual lemonade empire',   '🍋',  80, '[]'),
  ('spacefreight',    'SpaceFreight',       'Logistics', 'Delivering packages to the moon and beyond',     '🚀', 200, '[]'),
  ('byteboss_ai',     'ByteBoss AI',        'Tech',      'Smart study assistant powered by AI',            '🧠', 150, '[]'),
  ('greengrow',       'GreenGrow',          'Energy',    'Solar-powered farms that feed entire cities',    '🌱',  95, '[]'),
  ('cookie_capital',  'Cookie Capital',     'Retail',    'Artisan cookies sold in 50 countries',           '🍪',  60, '[]'),
  ('aquanova',        'AquaNova',           'Energy',    'Clean water technology for developing nations',  '💧', 110, '[]'),
  ('mediakids',       'MediaKids',          'Finance',   'Kid-safe streaming platform and creator fund',   '🎬', 175, '[]')
ON CONFLICT (id) DO NOTHING;
