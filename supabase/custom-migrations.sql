
-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for the avatars bucket
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Read Access for avatars',
  '(bucket_id = ''avatars''::text)',
  'avatars'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Create invitation_codes table for managing beta access
CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(12) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_to_email VARCHAR(255),
  used_by_user_id UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitation_codes_is_used ON public.invitation_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_used_by_user_id ON public.invitation_codes(used_by_user_id);

-- Create function to validate and use an invitation code
CREATE OR REPLACE FUNCTION public.validate_invitation_code(p_code VARCHAR, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code_id UUID;
  v_is_valid BOOLEAN := false;
BEGIN
  -- First check if code exists and is unused
  SELECT id INTO v_code_id
  FROM public.invitation_codes
  WHERE code = p_code AND is_used = false;
  
  IF v_code_id IS NOT NULL THEN
    -- Mark the code as used
    UPDATE public.invitation_codes
    SET is_used = true,
        used_by_user_id = p_user_id,
        used_at = now()
    WHERE id = v_code_id;
    
    v_is_valid := true;
  END IF;
  
  RETURN v_is_valid;
END;
$$;

-- Create function to generate a batch of invitation codes
CREATE OR REPLACE FUNCTION public.generate_invitation_codes(
  p_count INTEGER DEFAULT 100,
  p_notes TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_charset TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code_length INTEGER := 10;
  v_code TEXT;
  v_inserted INTEGER := 0;
  v_max_attempts INTEGER := p_count * 2; -- To avoid infinite loop
  v_attempts INTEGER := 0;
BEGIN
  WHILE v_inserted < p_count AND v_attempts < v_max_attempts LOOP
    v_attempts := v_attempts + 1;
    
    -- Generate a random code of specified length
    v_code := '';
    FOR i IN 1..5 LOOP
      v_code := v_code || substr(v_charset, floor(random() * length(v_charset))::integer + 1, 1);
    END LOOP;
    
    v_code := v_code || '-';
    
    FOR i IN 1..5 LOOP
      v_code := v_code || substr(v_charset, floor(random() * length(v_charset))::integer + 1, 1);
    END LOOP;
    
    -- Try to insert the code
    BEGIN
      INSERT INTO public.invitation_codes (code, notes)
      VALUES (v_code, p_notes);
      
      v_inserted := v_inserted + 1;
    EXCEPTION
      WHEN unique_violation THEN
        -- Code already exists, loop will try again
        NULL;
    END;
  END LOOP;
  
  RETURN v_inserted;
END;
$$;

-- Create API to check if an invitation code is valid
CREATE OR REPLACE FUNCTION public.check_invitation_code(p_code VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.invitation_codes
    WHERE code = p_code AND is_used = false
  );
END;
$$;
