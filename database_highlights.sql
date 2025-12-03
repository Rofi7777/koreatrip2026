-- Create highlights table for Moodboard/Gallery
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Vibe',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_highlights_sort_order ON highlights(sort_order);

-- Insert initial seed data
INSERT INTO highlights (title, description, image_url, category, sort_order) VALUES
  (
    'Seoul về đêm',
    'Trải nghiệm cuộc sống về đêm sôi động của Seoul với ánh đèn neon rực rỡ và không khí náo nhiệt.',
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800',
    'Vibe',
    1
  ),
  (
    'Sông Hàn',
    'Thư giãn bên dòng sông Hàn xinh đẹp, nơi người dân địa phương và du khách tụ tập để tận hưởng cảnh quan tuyệt đẹp.',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800',
    'Vibe',
    2
  ),
  (
    'Alpensia Ski',
    'Trải nghiệm trượt tuyết tuyệt vời tại khu nghỉ dưỡng Alpensia với những sườn dốc đẹp mắt và không khí trong lành.',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800',
    'Activity',
    3
  ),
  (
    'Ẩm thực đường phố',
    'Khám phá hương vị đặc trưng của Hàn Quốc qua các món ăn đường phố ngon miệng và đầy màu sắc.',
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&w=800',
    'Food',
    4
  );

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON highlights FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated insert" ON highlights FOR INSERT WITH CHECK (auth.role() = 'authenticated');

