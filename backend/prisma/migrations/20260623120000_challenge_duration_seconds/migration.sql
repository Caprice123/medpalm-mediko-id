-- Rename duration columns and convert existing values from minutes to seconds
ALTER TABLE challenges RENAME COLUMN duration_minutes TO duration_seconds;
ALTER TABLE challenges RENAME COLUMN special_duration_minutes TO special_duration_seconds;

UPDATE challenges SET duration_seconds = duration_seconds * 60, special_duration_seconds = special_duration_seconds * 60;
