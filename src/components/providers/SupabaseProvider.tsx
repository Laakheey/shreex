'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SupabaseContext = createContext<any>(null);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Create Supabase client with Clerk token injection
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const headers = new Headers(init?.headers);
          if (input instanceof Request) {
            input.headers.forEach((value, key) => headers.set(key, value));
          }

          if (isSignedIn) {
            try {
              const token = await getToken({ template: 'supabase' });
              if (token) {
                headers.set('Authorization', `Bearer ${token}`);
              }
            } catch (error) {
              console.error('Error getting Clerk token for Supabase:', error);
            }
          }

          const url = input instanceof Request ? input.url : input.toString();

          return fetch(url, {
            ...init,
            headers,
          });
        },
      },
    });

    setSupabase(client);
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    return null as any;
  }
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
};
