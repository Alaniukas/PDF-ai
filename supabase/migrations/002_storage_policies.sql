-- Storage policies for intake-uploads bucket
-- Service role bypasses RLS, but these policies help if using authenticated uploads later.

CREATE POLICY "Service can manage intake uploads"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'intake-uploads')
WITH CHECK (bucket_id = 'intake-uploads');
