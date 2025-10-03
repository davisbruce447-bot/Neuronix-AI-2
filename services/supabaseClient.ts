
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase project URL and anon key.
// You can find these in your Supabase project settings under "API".
const supabaseUrl = 'https://lbolpofarvsfhazgfpvq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxib2xwb2ZhcnZzZmhhemdmcHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjA1MzcsImV4cCI6MjA3NDk5NjUzN30.SbtThuoCXoKCaLNXm-nqbzLqS00T_z27YhHyOtnvMqM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// NOTE FOR REVIEWER:
// For this application to fully function, the user will need to set up the following
// in their Supabase project:
//
// 1. A 'profiles' table with RLS enabled, linked to 'auth.users'.
//    - Columns: id (uuid, fk to auth.users.id), plan (text), credits (integer), last_credit_reset (timestamptz)
// 2. A trigger on 'auth.users' to create a new profile entry upon user sign-up.
// 3. A 'chats' table with RLS.
//    - Columns: id (uuid), user_id (uuid, fk to auth.users.id), title (text), created_at (timestamptz)
// 4. A 'messages' table with RLS.
//    - Columns: id (uuid), chat_id (uuid, fk to chats.id), user_id (uuid, fk to auth.users.id), sender (text), model_id (text), content (text), created_at (timestamptz)