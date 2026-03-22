'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Hero, ProductDemo, InvestmentPlans, AboutUs } from '@/components';
import Loading from '@/components/Loading';

export default function HomePage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    if (!isLoaded) return;

    // If user is signed in, check their role and redirect accordingly
    if (isSignedIn && userId && supabase) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', userId)
            .single();

          if (!error && data?.is_admin) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } catch (err) {
          console.error('Error checking user role:', err);
          router.push('/dashboard');
        }
      })();
    }
  }, [isLoaded, isSignedIn, userId, supabase, router]);

  // Show loading while checking auth status
  if (!isLoaded || (isSignedIn && !userId)) {
    return <Loading />;
  }

  // If user is signed in, show loading while we redirect
  if (isSignedIn) {
    return <Loading />;
  }

  return (
    <>
      <Hero />
      <ProductDemo />
      <InvestmentPlans />
      <AboutUs />
    </>
  );
}
