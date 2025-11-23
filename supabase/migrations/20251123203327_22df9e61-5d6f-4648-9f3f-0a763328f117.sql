-- Create portfolio holdings table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  purchase_price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_wallet, purchase_date)
);

-- Create social chat messages table
CREATE TABLE IF NOT EXISTS public.market_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  username TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_chat ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_holdings
CREATE POLICY "Users can view their own holdings"
  ON public.portfolio_holdings FOR SELECT
  USING (user_wallet = user_wallet);

CREATE POLICY "Users can insert their own holdings"
  ON public.portfolio_holdings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own holdings"
  ON public.portfolio_holdings FOR UPDATE
  USING (user_wallet = user_wallet);

CREATE POLICY "Users can delete their own holdings"
  ON public.portfolio_holdings FOR DELETE
  USING (user_wallet = user_wallet);

-- RLS Policies for market_chat
CREATE POLICY "Anyone can view chat messages"
  ON public.market_chat FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON public.market_chat FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_portfolio_user ON public.portfolio_holdings(user_wallet);
CREATE INDEX idx_chat_created ON public.market_chat(created_at DESC);

-- Seed initial governance proposals
INSERT INTO public.governance_proposals (title, description, category, created_by_wallet, end_date, status) VALUES
  (
    'Allocate 50K TRN for Marketing Campaign',
    'Proposal to allocate 50,000 TRN tokens for a comprehensive Q1 2025 marketing campaign including influencer partnerships, paid ads, and community events. Expected ROI: 2-3x holder growth.',
    'tokenomics',
    'DAO_Treasury',
    NOW() + INTERVAL '14 days',
    'active'
  ),
  (
    'Partner with TerrainScope for Equipment Tracking',
    'Strategic partnership proposal with TerrainScope to integrate real-time GPS tracking for all Carolina Terrain equipment. This enhances transparency and provides live proof of asset backing.',
    'partnership',
    'carolina_terrain',
    NOW() + INTERVAL '10 days',
    'active'
  ),
  (
    'Implement TRN Burn Mechanism (2% per transaction)',
    'Proposal to implement a 2% burn mechanism on all TRN transactions to create deflationary pressure. Burned tokens would be permanently removed from circulation, increasing scarcity.',
    'tokenomics',
    'community_member_1',
    NOW() + INTERVAL '7 days',
    'active'
  ),
  (
    'Launch Weekly Community AMAs with Founders',
    'Establish weekly Ask-Me-Anything sessions with Zac and Alex to discuss business operations, answer holder questions, and provide transparency updates.',
    'feature',
    'community_mod',
    NOW() + INTERVAL '5 days',
    'active'
  ),
  (
    'Create TRN Staking Rewards Program',
    'Proposal to implement a staking mechanism where holders can lock TRN for 30/60/90 days and earn rewards from a dedicated pool. Encourages long-term holding and reduces sell pressure.',
    'tokenomics',
    'defi_contributor',
    NOW() + INTERVAL '12 days',
    'active'
  )
ON CONFLICT DO NOTHING;