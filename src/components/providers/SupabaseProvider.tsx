// import { createContext, useContext, useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { useAuth } from "@clerk/clerk-react";

// // import { createClerkSupabaseClient } from '@clerk/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const SupabaseContext = createContext<any>(null);

// export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
//   const { getToken, isLoaded, isSignedIn } = useAuth();
//   const [supabase, setSupabase] = useState<any>(null);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const client = createClient(supabaseUrl, supabaseAnonKey, {
//       global: {
//         fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
//           const headers = new Headers(init?.headers);
//           if (input instanceof Request) {
//             input.headers.forEach((value, key) => headers.set(key, value));
//           }

//           if (isSignedIn) {
//             const token = await getToken();
//             if (token) {
//               headers.set("Authorization", `Bearer ${token}`);
//               console.log("Injected Clerk token into Supabase request");
//             }
//           }

//           const url = input instanceof Request ? input.url : input.toString();

//           return fetch(url, {
//             ...init,
//             headers,
//           });
//         },
//       },
//     });

//     setSupabase(client);
//   }, [getToken, isLoaded, isSignedIn]);

//   return (
//     <SupabaseContext.Provider value={supabase}>
//       {children}
//     </SupabaseContext.Provider>
//   );
// };

// // In SupabaseProvider.tsx

// export const useSupabase = () => {
//   const context = useContext(SupabaseContext);
//   if (context === null) {
//     return null as any;
//   }
//   if (!context) {
//     throw new Error("useSupabase must be used within SupabaseProvider");
//   }
//   return context;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL_DEV;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY_DEV;

// Add this - service role key for local dev
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV;
const isDev = import.meta.env.DEV;

const SupabaseContext = createContext<any>(null);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // In local dev, use service role key to bypass RLS for testing
    if (isDev && supabaseServiceRoleKey) {
      console.log("🔧 Using service role key for local development");
      const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
      setSupabase(client);
      return;
    }

    // Production: use Clerk tokens with NEW native integration method
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const headers = new Headers(init?.headers);
          if (input instanceof Request) {
            input.headers.forEach((value, key) => headers.set(key, value));
          }

          if (isSignedIn) {
            // FIXED: Remove the template parameter - use native integration
            const token = await getToken();
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
              console.log("Injected Clerk token into Supabase request");
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
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return context;
};