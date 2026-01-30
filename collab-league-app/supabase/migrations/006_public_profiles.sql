-- Add username column to creators table
ALTER TABLE public.creators
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Function to generate username from full_name
CREATE OR REPLACE FUNCTION generate_username()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  -- Create base username: lowercase, remove non-alphanumeric
  base_username := lower(regexp_replace(NEW.full_name, '[^a-zA-Z0-9]', '', 'g'));
  
  -- Fallback if name is empty
  IF length(base_username) = 0 THEN
    base_username := 'creator';
  END IF;

  final_username := base_username;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.creators WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter;
  END LOOP;
  
  NEW.username := final_username;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate username before insert
DROP TRIGGER IF EXISTS set_username ON public.creators;
CREATE TRIGGER set_username
  BEFORE INSERT ON public.creators
  FOR EACH ROW
  WHEN (NEW.username IS NULL)
  EXECUTE FUNCTION generate_username();

-- Auto-generate usernames for existing creators who don't have one
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, full_name FROM public.creators WHERE username IS NULL LOOP
    UPDATE public.creators
    SET username = NULL -- Trigger handles generation
    WHERE id = r.id;
  END LOOP;
END;
$$;

-- RLS Policy: Allow public read access to active public creators
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.creators;
CREATE POLICY "Anyone can view public profiles"
  ON public.creators FOR SELECT
  USING (is_active = true AND is_public = true);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_creators_username ON public.creators(username);
