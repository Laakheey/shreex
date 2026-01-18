import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useSupabase } from '../components/providers/SupabaseProvider';

// Define the User interface based on your SQL schema
export interface UserDetail {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
  created_at: string;
  is_admin: boolean;
  referrer_id: string | null;
  referral_code: string;
  is_active: boolean;
  is_leader: boolean;
}

export const useUserDetail = (userId: string | undefined) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      setUser(data as UserDetail);
    } catch (err: any) {
      console.error('❌ Error fetching user details:', err);
      setError(err.message);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  return { 
    user, 
    loading, 
    error, 
    refresh: fetchUserDetail,
    setUser
  };
};