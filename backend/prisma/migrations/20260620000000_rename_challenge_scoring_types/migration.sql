-- Rename scoring_type values: accuracy → classic, speed_accuracy → blitz
UPDATE challenges SET scoring_type = 'classic' WHERE scoring_type = 'accuracy';
UPDATE challenges SET scoring_type = 'blitz'   WHERE scoring_type = 'speed_accuracy';
