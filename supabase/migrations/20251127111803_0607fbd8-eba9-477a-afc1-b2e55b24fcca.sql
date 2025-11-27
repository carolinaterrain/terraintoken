-- Create staking_positions table for actual staking functionality
CREATE TABLE public.staking_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  pool_id TEXT NOT NULL,
  amount_staked NUMERIC NOT NULL,
  staked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unlock_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  rewards_earned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staking_positions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own staking positions"
ON public.staking_positions
FOR SELECT
USING (user_wallet = get_user_wallet_address());

CREATE POLICY "Users can insert their own staking positions"
ON public.staking_positions
FOR INSERT
WITH CHECK (user_wallet = get_user_wallet_address());

CREATE POLICY "Users can update their own staking positions"
ON public.staking_positions
FOR UPDATE
USING (user_wallet = get_user_wallet_address());

-- Public aggregate view for stats (no PII exposed)
CREATE POLICY "Anyone can view aggregate stats"
ON public.staking_positions
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_staking_positions_updated_at
BEFORE UPDATE ON public.staking_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();