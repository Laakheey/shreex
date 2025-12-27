// src/hooks/useFetchInvestments.ts
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../components/providers/SupabaseProvider';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

export function useFetchInvestments() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = useCallback(async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvestments(data || []);
    } catch (err: any) {
      console.error('Error fetching investments:', err);
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const mutate = useCallback(() => {
    return fetchInvestments();
  }, [fetchInvestments]);

  return { investments, loading, mutate };
}