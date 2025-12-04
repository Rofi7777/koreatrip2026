-- ============================================
-- Add Traditional Chinese (zh-TW) columns to all tables
-- ============================================
-- Run this in Supabase SQL Editor if columns don't exist

-- Add zh columns to itinerary table (if they don't exist)
DO $$ 
BEGIN
  -- Check and add title_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'itinerary' AND column_name = 'title_zh'
  ) THEN
    ALTER TABLE itinerary ADD COLUMN title_zh TEXT;
    RAISE NOTICE 'Added title_zh column to itinerary table';
  END IF;

  -- Check and add description_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'itinerary' AND column_name = 'description_zh'
  ) THEN
    ALTER TABLE itinerary ADD COLUMN description_zh TEXT;
    RAISE NOTICE 'Added description_zh column to itinerary table';
  END IF;
END $$;

-- Add zh columns to tasks table (if they don't exist)
DO $$ 
BEGIN
  -- Check and add title_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'title_zh'
  ) THEN
    ALTER TABLE tasks ADD COLUMN title_zh TEXT;
    RAISE NOTICE 'Added title_zh column to tasks table';
  END IF;

  -- Check and add description_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'description_zh'
  ) THEN
    ALTER TABLE tasks ADD COLUMN description_zh TEXT;
    RAISE NOTICE 'Added description_zh column to tasks table';
  END IF;
END $$;

-- Add zh columns to info_cards table (if they don't exist)
DO $$ 
BEGIN
  -- Check and add title_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'info_cards' AND column_name = 'title_zh'
  ) THEN
    ALTER TABLE info_cards ADD COLUMN title_zh TEXT;
    RAISE NOTICE 'Added title_zh column to info_cards table';
  END IF;

  -- Check and add content_zh
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'info_cards' AND column_name = 'content_zh'
  ) THEN
    ALTER TABLE info_cards ADD COLUMN content_zh TEXT;
    RAISE NOTICE 'Added content_zh column to info_cards table';
  END IF;
END $$;

-- Verify columns exist
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('itinerary', 'tasks', 'info_cards')
  AND column_name LIKE '%_zh'
ORDER BY table_name, column_name;

