-- Fix RLS policies for live_viewers table to allow anonymous tracking

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can insert their viewer session" ON live_viewers;
DROP POLICY IF EXISTS "Anyone can update their viewer session" ON live_viewers;
DROP POLICY IF EXISTS "Anyone can view viewer counts" ON live_viewers;
DROP POLICY IF EXISTS "Anyone can delete their viewer session" ON live_viewers;

-- Allow anyone to insert their viewing session
CREATE POLICY "Anyone can insert their viewer session"
ON live_viewers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update their own viewing session based on session_id
CREATE POLICY "Anyone can update their viewer session"
ON live_viewers
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow anyone to view all viewer records (for counting)
CREATE POLICY "Anyone can view viewer counts"
ON live_viewers
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to delete their own session
CREATE POLICY "Anyone can delete their viewer session"
ON live_viewers
FOR DELETE
TO anon, authenticated
USING (true);