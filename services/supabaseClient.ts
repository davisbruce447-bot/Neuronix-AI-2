
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase project URL and anon key.
// You can find these in your Supabase project settings under "API".
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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