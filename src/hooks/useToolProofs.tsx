import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface ToolProof {
  id: string;
  wallet_address: string;
  tool_name: 'terrainvision' | 'flowguardian' | 'referral-router';
  proof_type: 'screenshot' | 'result_url' | 'x_post';
  proof_url: string;
  x_post_url?: string;
  status: 'pending' | 'verified' | 'rejected' | 'rewarded';
  trn_reward: number;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  notes?: string;
}

export interface SubmitProofParams {
  wallet_address: string;
  tool_name: ToolProof['tool_name'];
  proof_type: ToolProof['proof_type'];
  proof_url: string;
  x_post_url?: string;
}

export function useToolProofs(walletAddress?: string) {
  const queryClient = useQueryClient();

  // Fetch all proofs or filter by wallet
  const { data: proofs, isLoading, error } = useQuery({
    queryKey: ['tool-proofs', walletAddress],
    queryFn: async () => {
      let query = supabase
        .from('tool_usage_proofs')
        .select('*')
        .order('created_at', { ascending: false });

      if (walletAddress) {
        query = query.eq('wallet_address', walletAddress);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ToolProof[];
    },
  });

  // Submit proof mutation
  const submitProof = useMutation({
    mutationFn: async (params: SubmitProofParams) => {
      const { data, error } = await supabase
        .from('tool_usage_proofs')
        .insert(params)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data as ToolProof;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-proofs'] });
    },
  });

  // Real-time subscription for proof status updates
  useEffect(() => {
    if (!walletAddress) return;

    const channel = supabase
      .channel('tool_proofs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tool_usage_proofs',
          filter: `wallet_address=eq.${walletAddress}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tool-proofs', walletAddress] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletAddress, queryClient]);

  return {
    proofs,
    isLoading,
    error,
    submitProof: submitProof.mutate,
    isSubmitting: submitProof.isPending,
  };
}

// Get leaderboard (recent verified proofs)
export function useToolProofLeaderboard(limit: number = 10) {
  return useQuery({
    queryKey: ['tool-proof-leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tool_usage_proofs')
        .select('*')
        .in('status', ['verified', 'rewarded'])
        .order('verified_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ToolProof[];
    },
    refetchInterval: 30000, // 30 seconds
  });
}
