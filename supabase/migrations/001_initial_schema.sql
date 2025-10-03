-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan text,
  credits integer,
  last_credit_reset timestamptz,
  PRIMARY KEY (id)
);

-- Enable Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create chats table
CREATE TABLE public.chats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security for chats
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own chats
CREATE POLICY "Users can view their own chats."
ON public.chats FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create their own chats
CREATE POLICY "Users can create their own chats."
ON public.chats FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own chats
CREATE POLICY "Users can delete their own chats."
ON public.chats FOR DELETE
USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  sender text,
  model_id text,
  content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in their own chats
CREATE POLICY "Users can view messages in their own chats."
ON public.messages FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create messages in their own chats
CREATE POLICY "Users can create messages in their own chats."
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to create a new profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, plan, credits, last_credit_reset)
  VALUES (new.id, 'free', 50, now());
  return new;
END;
$$;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
