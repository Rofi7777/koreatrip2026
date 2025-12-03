-- Database Setup for Tasks and Info Cards
-- Run this in your Supabase SQL Editor

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Source content (base language)
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  icon TEXT,
  
  -- Multilingual fields
  title_vi TEXT,
  title_en TEXT,
  title_zh TEXT,
  description_vi TEXT,
  description_en TEXT,
  description_zh TEXT
);

-- Create info_cards table
CREATE TABLE IF NOT EXISTS info_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Source content (base language)
  title TEXT NOT NULL,
  content TEXT,
  icon TEXT,
  
  -- Multilingual fields
  title_vi TEXT,
  title_en TEXT,
  title_zh TEXT,
  content_vi TEXT,
  content_en TEXT,
  content_zh TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_info_cards_created_at ON info_cards(created_at);

-- Enable Row Level Security (RLS) - adjust policies as needed
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_cards ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - adjust based on your auth setup)
CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on info_cards" ON info_cards
  FOR ALL USING (true) WITH CHECK (true);

-- Optional: Insert sample data
-- INSERT INTO tasks (title, title_vi, title_en, title_zh, description, description_vi, description_en, description_zh, icon, assignee)
-- VALUES 
--   ('Transport & Check-in', 'Vận chuyển & Nhận phòng', 'Transport & Check-in', '交通與入住', 'Arrange airport pickup and hotel check-in', 'Sắp xếp đón sân bay và nhận phòng khách sạn', 'Arrange airport pickup and hotel check-in', '安排機場接機和酒店入住', '🚐', 'Rofi');

-- INSERT INTO info_cards (title, title_vi, title_en, title_zh, content, content_vi, content_en, content_zh, icon)
-- VALUES 
--   ('Transport & Check-in', 'Vận chuyển & Nhận phòng', 'Transport & Check-in', '交通與入住', 'Use AREX or KTX from Incheon Airport to Seoul Station', 'Sử dụng AREX hoặc KTX từ sân bay Incheon đến ga Seoul', 'Use AREX or KTX from Incheon Airport to Seoul Station', '從仁川機場使用AREX或KTX到首爾站', 'train');


