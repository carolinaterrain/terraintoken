-- =============================================
-- GOD-TIER REVOLUTIONARY REVENUE SYSTEM
-- Phase 1-6: Complete Implementation
-- =============================================

-- Energy/Credits System Tables
CREATE TABLE IF NOT EXISTS energy_balances (
  user_wallet TEXT PRIMARY KEY,
  energy_balance INTEGER NOT NULL DEFAULT 5,
  max_energy INTEGER NOT NULL DEFAULT 10,
  last_refill TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_energy_purchased INTEGER NOT NULL DEFAULT 0,
  trn_spent_on_energy NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS energy_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  package_type TEXT NOT NULL, -- 'basic', 'pro', 'unlimited_day'
  energy_amount INTEGER NOT NULL,
  trn_cost NUMERIC NOT NULL,
  trn_burned NUMERIC NOT NULL, -- 50% burn
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscription System Tables
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  tier TEXT NOT NULL, -- 'free', 'pro', 'business', 'enterprise'
  payment_method TEXT, -- 'trn', 'stripe'
  trn_staked NUMERIC DEFAULT 0,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  discount_applied NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES user_subscriptions(id),
  user_wallet TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  trn_burned NUMERIC DEFAULT 0,
  stripe_payment_id TEXT,
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Staking System Tables
CREATE TABLE IF NOT EXISTS prediction_stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES market_predictions(id),
  user_wallet TEXT NOT NULL,
  stake_amount NUMERIC NOT NULL,
  payout_amount NUMERIC,
  burn_amount NUMERIC, -- 10% burned on payout
  treasury_amount NUMERIC, -- 10% to treasury
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'won', 'lost', 'returned'
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contest_stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID,
  contest_type TEXT NOT NULL, -- 'weekly', 'tournament', 'special'
  user_wallet TEXT NOT NULL,
  entry_fee NUMERIC NOT NULL,
  prize_won NUMERIC,
  burn_amount NUMERIC,
  placement INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Marketplace Tables
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_wallet TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'prompt', 'template', 'boost', 'badge', 'pass'
  title TEXT NOT NULL,
  description TEXT,
  price_trn NUMERIC NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  sales_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'sold_out', 'inactive'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES marketplace_items(id),
  buyer_wallet TEXT NOT NULL,
  seller_wallet TEXT NOT NULL,
  price_paid NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL, -- 10%
  fee_burned NUMERIC NOT NULL, -- 20% of platform fee
  seller_payout NUMERIC NOT NULL,
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Real-World Bridge Tables
CREATE TABLE IF NOT EXISTS service_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  service_type TEXT NOT NULL, -- 'drainage', 'grading', 'erosion', 'landscaping'
  discount_code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC NOT NULL,
  trn_required NUMERIC NOT NULL,
  trn_balance_snapshot NUMERIC NOT NULL,
  service_value_estimate NUMERIC,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  invoice_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Gamification Purchases Tables
CREATE TABLE IF NOT EXISTS gamification_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'energy_pack', 'xp_boost', 'tournament_entry', 'season_pass', 'mystery_box', 'badge_upgrade'
  item_name TEXT NOT NULL,
  trn_cost NUMERIC NOT NULL,
  trn_burned NUMERIC NOT NULL,
  effect_data JSONB, -- Store item effects/rewards
  transaction_signature TEXT,
  expires_at TIMESTAMPTZ, -- For time-limited items
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Token Burn Tracking
CREATE TABLE IF NOT EXISTS token_burns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_source TEXT NOT NULL, -- 'energy_purchase', 'marketplace_fee', 'subscription', 'prediction_stake', 'contest_entry', 'gamification'
  burn_amount NUMERIC NOT NULL,
  user_wallet TEXT,
  transaction_signature TEXT,
  related_transaction_id UUID, -- Reference to source transaction
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mystery Box System
CREATE TABLE IF NOT EXISTS mystery_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_tier TEXT NOT NULL, -- 'bronze', 'silver', 'gold', 'legendary'
  trn_cost NUMERIC NOT NULL,
  possible_rewards JSONB NOT NULL, -- Array of possible rewards
  rarity_weights JSONB NOT NULL, -- Probability distribution
  available_count INTEGER DEFAULT -1, -- -1 for unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mystery_box_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID REFERENCES mystery_boxes(id),
  user_wallet TEXT NOT NULL,
  trn_paid NUMERIC NOT NULL,
  reward_type TEXT NOT NULL,
  reward_value NUMERIC NOT NULL,
  reward_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Season Pass System
CREATE TABLE IF NOT EXISTS season_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_name TEXT NOT NULL,
  season_number INTEGER NOT NULL,
  trn_cost NUMERIC NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  rewards_structure JSONB NOT NULL, -- Tier-based rewards
  total_sold INTEGER DEFAULT 0,
  max_supply INTEGER DEFAULT -1, -- -1 for unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS season_pass_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id UUID REFERENCES season_passes(id),
  user_wallet TEXT NOT NULL,
  tier_level INTEGER DEFAULT 1,
  xp_earned INTEGER DEFAULT 0,
  rewards_claimed JSONB DEFAULT '[]'::jsonb,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pass_id, user_wallet)
);

-- RLS Policies
ALTER TABLE energy_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_burns ENABLE ROW LEVEL SECURITY;
ALTER TABLE mystery_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mystery_box_opens ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_pass_holders ENABLE ROW LEVEL SECURITY;

-- Energy Balances Policies
CREATE POLICY "Users can view own energy balance" ON energy_balances FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can insert own energy balance" ON energy_balances FOR INSERT WITH CHECK (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can update own energy balance" ON energy_balances FOR UPDATE USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Energy Purchases Policies
CREATE POLICY "Users can view own purchases" ON energy_purchases FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Anyone can insert purchases" ON energy_purchases FOR INSERT WITH CHECK (true);

-- Subscription Policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Anyone can create subscription" ON user_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own subscription" ON user_subscriptions FOR UPDATE USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Payment Policies
CREATE POLICY "Users can view own payments" ON subscription_payments FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "System can insert payments" ON subscription_payments FOR INSERT WITH CHECK (true);

-- Prediction Stakes Policies
CREATE POLICY "Users can view own stakes" ON prediction_stakes FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Anyone can insert stakes" ON prediction_stakes FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update stakes" ON prediction_stakes FOR UPDATE USING (true);

-- Contest Stakes Policies  
CREATE POLICY "Anyone can view contest stakes" ON contest_stakes FOR SELECT USING (true);
CREATE POLICY "Users can insert contest stakes" ON contest_stakes FOR INSERT WITH CHECK (true);

-- Marketplace Policies
CREATE POLICY "Anyone can view active items" ON marketplace_items FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can insert items" ON marketplace_items FOR INSERT WITH CHECK (seller_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Sellers can update own items" ON marketplace_items FOR UPDATE USING (seller_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view own transactions" ON marketplace_transactions FOR SELECT USING (buyer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR seller_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "System can insert transactions" ON marketplace_transactions FOR INSERT WITH CHECK (true);

-- Service Redemption Policies
CREATE POLICY "Users can view own redemptions" ON service_redemptions FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can create redemptions" ON service_redemptions FOR INSERT WITH CHECK (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can update own redemptions" ON service_redemptions FOR UPDATE USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Gamification Policies
CREATE POLICY "Users can view own purchases" ON gamification_purchases FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Anyone can insert purchases" ON gamification_purchases FOR INSERT WITH CHECK (true);

-- Token Burns Policies
CREATE POLICY "Anyone can view burns" ON token_burns FOR SELECT USING (true);
CREATE POLICY "System can insert burns" ON token_burns FOR INSERT WITH CHECK (true);

-- Mystery Box Policies
CREATE POLICY "Anyone can view boxes" ON mystery_boxes FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own opens" ON mystery_box_opens FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "System can insert opens" ON mystery_box_opens FOR INSERT WITH CHECK (true);

-- Season Pass Policies
CREATE POLICY "Anyone can view active passes" ON season_passes FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own pass" ON season_pass_holders FOR SELECT USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Anyone can purchase pass" ON season_pass_holders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own pass progress" ON season_pass_holders FOR UPDATE USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create indexes for performance
CREATE INDEX idx_energy_balances_wallet ON energy_balances(user_wallet);
CREATE INDEX idx_energy_purchases_wallet ON energy_purchases(user_wallet);
CREATE INDEX idx_energy_purchases_created ON energy_purchases(created_at DESC);
CREATE INDEX idx_subscriptions_wallet ON user_subscriptions(user_wallet);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_prediction_stakes_wallet ON prediction_stakes(user_wallet);
CREATE INDEX idx_prediction_stakes_status ON prediction_stakes(status);
CREATE INDEX idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX idx_marketplace_items_seller ON marketplace_items(seller_wallet);
CREATE INDEX idx_marketplace_items_created ON marketplace_items(created_at DESC);
CREATE INDEX idx_marketplace_trans_buyer ON marketplace_transactions(buyer_wallet);
CREATE INDEX idx_marketplace_trans_seller ON marketplace_transactions(seller_wallet);
CREATE INDEX idx_service_redemptions_wallet ON service_redemptions(user_wallet);
CREATE INDEX idx_service_redemptions_code ON service_redemptions(discount_code);
CREATE INDEX idx_token_burns_created ON token_burns(created_at DESC);
CREATE INDEX idx_token_burns_source ON token_burns(burn_source);
CREATE INDEX idx_gamification_wallet ON gamification_purchases(user_wallet);
CREATE INDEX idx_season_pass_holders_wallet ON season_pass_holders(user_wallet);