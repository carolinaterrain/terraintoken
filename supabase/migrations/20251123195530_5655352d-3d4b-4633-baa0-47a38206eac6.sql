-- Create governance proposals table
CREATE TABLE IF NOT EXISTS public.governance_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feature', 'tokenomics', 'partnership', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
  created_by_wallet TEXT NOT NULL,
  votes_for BIGINT NOT NULL DEFAULT 0,
  votes_against BIGINT NOT NULL DEFAULT 0,
  total_voting_power NUMERIC NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create governance votes table
CREATE TABLE IF NOT EXISTS public.governance_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
  voter_wallet TEXT NOT NULL,
  vote_choice TEXT NOT NULL CHECK (vote_choice IN ('for', 'against')),
  voting_power NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, voter_wallet)
);

-- Enable RLS
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposals
CREATE POLICY "Anyone can view proposals"
  ON public.governance_proposals
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create proposals"
  ON public.governance_proposals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Proposal creators can update their proposals"
  ON public.governance_proposals
  FOR UPDATE
  USING (created_by_wallet = created_by_wallet);

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes"
  ON public.governance_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can vote"
  ON public.governance_votes
  FOR INSERT
  WITH CHECK (true);

-- Triggers
CREATE TRIGGER update_governance_proposals_updated_at
  BEFORE UPDATE ON public.governance_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_governance_proposals_status ON public.governance_proposals(status);
CREATE INDEX idx_governance_proposals_end_date ON public.governance_proposals(end_date);
CREATE INDEX idx_governance_votes_proposal ON public.governance_votes(proposal_id);
CREATE INDEX idx_governance_votes_wallet ON public.governance_votes(voter_wallet);