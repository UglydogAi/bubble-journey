
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
