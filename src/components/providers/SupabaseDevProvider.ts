// import { createClient } from '@supabase/supabase-js';
// import { useGetEnvVariables } from '../../hooks/useGetEnvVariables';

// const env = useGetEnvVariables();

// const supabaseUrl = env.supabaseUrl;
// const supabaseKey = env.supabaseAnonKey;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// console.log('🔧 Initializing Supabase client...');
// console.log('📍 Supabase URL:', supabaseUrl);

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: false
//   },
//   db: {
//     schema: 'public'
//   }
// });

// console.log('✅ Supabase client initialized with service role key');
// console.log('📍 Using schema: public');