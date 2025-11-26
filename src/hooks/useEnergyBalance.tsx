import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EnergyBalance {
  energy_balance: number;
  max_energy: number;
  last_refill: string;
  loading: boolean;
}

export const useEnergyBalance = (walletAddress?: string) => {
  const [balance, setBalance] = useState<EnergyBalance>({
    energy_balance: 5,
    max_energy: 10,
    last_refill: new Date().toISOString(),
    loading: true,
  });

  useEffect(() => {
    if (!walletAddress) {
      setBalance(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('energy_balances')
          .select('*')
          .eq('user_wallet', walletAddress)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setBalance({
            energy_balance: data.energy_balance,
            max_energy: data.max_energy,
            last_refill: data.last_refill,
            loading: false,
          });
        } else {
          // Create initial balance
          const { data: newBalance, error: insertError } = await supabase
            .from('energy_balances')
            .insert({
              user_wallet: walletAddress,
              energy_balance: 5,
              max_energy: 10,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          setBalance({
            energy_balance: newBalance.energy_balance,
            max_energy: newBalance.max_energy,
            last_refill: newBalance.last_refill,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching energy balance:', error);
        setBalance(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBalance();

    // Subscribe to changes
    const channel = supabase
      .channel('energy_balance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'energy_balances',
          filter: `user_wallet=eq.${walletAddress}`,
        },
        (payload) => {
          if (payload.new) {
            setBalance({
              energy_balance: (payload.new as any).energy_balance,
              max_energy: (payload.new as any).max_energy,
              last_refill: (payload.new as any).last_refill,
              loading: false,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletAddress]);

  return balance;
};
