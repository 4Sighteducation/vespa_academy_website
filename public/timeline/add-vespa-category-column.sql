-- Add vespa_category column to milestones table
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS vespa_category TEXT;

-- Also add attachments column while we're at it
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS attachments TEXT[];

-- Update the column comment for documentation
COMMENT ON COLUMN milestones.vespa_category IS 'VESPA category for activities: VISION, EFFORT, SYSTEMS, PRACTICE, or ATTITUDE';
COMMENT ON COLUMN milestones.attachments IS 'Array of file URLs or attachment descriptions'; 