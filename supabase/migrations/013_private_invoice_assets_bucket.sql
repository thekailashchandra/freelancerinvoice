-- Make invoice-assets bucket private (logos/signatures served via signed URLs).
UPDATE storage.buckets
SET public = false
WHERE id = 'invoice-assets';
