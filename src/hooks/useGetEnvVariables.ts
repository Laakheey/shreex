// import { useMemo } from 'react';

// interface EnvConfig {
//   supabaseUrl: string;
//   supabaseAnonKey: string;
//   supabaseServiceRoleKey?: string;
//   apiUrl: string;

//   clerkPublishableKey: string;

//   alphaVantageGlobalQuoteApiKey: string;
//   alphaVantageTimeSeriesDailyApiKey: string;
//   finnhubApiKey: string;
//   etheriumApiKey: string;

//   adminId: string;

//   isLocal: boolean;
//   isProduction: boolean;
// }

// export const useGetEnvVariables = (): EnvConfig => {
//   return useMemo(() => {
//     const isLocal = 
//       window.location.hostname === 'localhost' ||
//       window.location.hostname === '127.0.0.1';

//     if (isLocal) {
//       return {
//         supabaseUrl: 'http://127.0.0.1:54321',
//         supabaseAnonKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
//         supabaseServiceRoleKey: 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz', // careful!

//         apiUrl: import.meta.env.VITE_API_URL_DEV || 'http://localhost:5008',

//         clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
        
//         alphaVantageGlobalQuoteApiKey: import.meta.env.VITE_ALPHAVINTAGEGLOBALQUOTEAPIKEY || '',
//         alphaVantageTimeSeriesDailyApiKey: import.meta.env.VITE_ALPHA_VINTAGE_TIME_SERIES_DAILY_API_KEY || '',
//         finnhubApiKey: import.meta.env.VITE_FINNHUB_API_KEY || '',
//         etheriumApiKey: import.meta.env.VITE_ETHERIUM_API_KEY || '',

//         adminId: import.meta.env.VITE_ADMIN_ID || '',

//         isLocal: true,
//         isProduction: false,
//       };
//     }

//     // Production environment (shreex / deployed)
//     return {
//       supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://nifzbphuszlvuyfsgcxb.supabase.co',
//       supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
//       supabaseServiceRoleKey: undefined, // NEVER expose in client-side production!

//       apiUrl: import.meta.env.VITE_API_URL || 'https://bull-rush-backend-production.up.railway.app',

//       clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',

//       alphaVantageGlobalQuoteApiKey: import.meta.env.VITE_ALPHAVINTAGEGLOBALQUOTEAPIKEY || '',
//       alphaVantageTimeSeriesDailyApiKey: import.meta.env.VITE_ALPHA_VINTAGE_TIME_SERIES_DAILY_API_KEY || '',
//       finnhubApiKey: import.meta.env.VITE_FINNHUB_API_KEY || '',
//       etheriumApiKey: import.meta.env.VITE_ETHERIUM_API_KEY || '',

//       adminId: import.meta.env.VITE_ADMIN_ID || '',

//       isLocal: false,
//       isProduction: true,
//     };
//   }, []);
// };







