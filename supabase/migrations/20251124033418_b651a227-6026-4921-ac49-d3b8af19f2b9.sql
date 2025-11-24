-- Drop duplicate tautological policies that weren't removed in previous migrations

-- Fix tournament_entries - drop the old ALL policy with tautological condition
DROP POLICY IF EXISTS "Users can manage their tournament entries" ON tournament_entries;

-- Fix user_challenge_progress - drop the old ALL policy with tautological condition
DROP POLICY IF EXISTS "Users can update their own progress" ON user_challenge_progress;