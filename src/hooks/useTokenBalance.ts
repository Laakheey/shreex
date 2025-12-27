import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from './../components/providers/SupabaseProvider';

export function useTokenBalance() {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();

  const fetchBalance = useCallback(async () => {
    if (!supabase || !user) return;
    
    const { data, error } = await supabase
      .from('users')
      .select('token_balance')
      .eq('id', user.id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      await supabase.from('users').insert({ id: user.id });
      setBalance(0);
    } else if (data) {
      setBalance(data.token_balance || 0);
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!isLoaded || !user || !supabase) return;

    fetchBalance();

    const subscription = supabase
      .channel(`user-balance-${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`
      }, (payload: any) => {
        setBalance(payload.new.token_balance || 0);
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, isLoaded, fetchBalance, supabase]);

  return { balance: balance ?? 0, loading, mutate: fetchBalance };
}