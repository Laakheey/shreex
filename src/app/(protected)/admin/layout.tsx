'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useEffect, useState, ReactNode } from 'react';
import Loading from '@/components/Loading';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId || !supabase) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (error || !data?.is_admin) {
          router.push('/dashboard');
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        router.push('/dashboard');
      }
    })();
  }, [isLoaded, userId, supabase, router]);

  if (!isLoaded || isAdmin === null) {
    return <Loading />;
  }

  if (!isAdmin) {
    return <Loading />;
  }

  return children;
}
