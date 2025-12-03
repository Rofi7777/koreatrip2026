-- Create tasks table if not exists
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  icon TEXT,
  title_vi TEXT,
  description_vi TEXT,
  title_en TEXT,
  description_en TEXT,
  title_zh TEXT,
  description_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create info_cards table if not exists
CREATE TABLE IF NOT EXISTS info_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  icon TEXT,
  title_vi TEXT,
  content_vi TEXT,
  title_en TEXT,
  content_en TEXT,
  title_zh TEXT,
  content_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE tasks;
-- TRUNCATE TABLE info_cards;

-- Insert Tasks (Team Roles)
INSERT INTO tasks (title, description, assignee, icon, title_vi, description_vi) VALUES
  (
    'Transport & Logistics',
    'Book private bus Incheon->Alpensia. Monitor flight LJ082 status. Prepare T-money cards for everyone.',
    'Trieu',
    '🚐',
    'Di chuyển & Hậu cần',
    'Đặt xe bus riêng từ Incheon đến Alpensia. Theo dõi tình trạng chuyến bay LJ082. Chuẩn bị thẻ T-money cho mọi người.'
  ),
  (
    'Ski & Team Building',
    'Book ski instructors (English/Chinese speaking). Plan "Snow Team Battle" game. Rent equipment list.',
    'Diem',
    '🎿',
    'Trượt tuyết & Team Building',
    'Đặt giáo viên trượt tuyết (nói tiếng Anh/Trung). Lên kế hoạch trò chơi "Snow Team Battle". Danh sách thuê thiết bị.'
  ),
  (
    'Food & Dining',
    'Book Welcome Dinner at Alpensia. Find best K-BBQ in Myeongdong. Ensure Halal/Veggie options if needed.',
    'Juli',
    '🍖',
    'Ẩm thực & Nhà hàng',
    'Đặt bữa tối chào mừng tại Alpensia. Tìm quán K-BBQ tốt nhất ở Myeongdong. Đảm bảo có lựa chọn Halal/Chay nếu cần.'
  ),
  (
    'Budget & Admin',
    'Collect team fund (Won). Keep all receipts. Daily expense tracking.',
    'Tham',
    '💰',
    'Ngân sách & Quản trị',
    'Thu quỹ đội (Won). Giữ tất cả hóa đơn. Theo dõi chi tiêu hàng ngày.'
  ),
  (
    'Media & Content',
    'Document daily highlights. Take team photos. Create trip vlog/reels for social media.',
    'My',
    '📸',
    'Truyền thông & Nội dung',
    'Ghi lại những điểm nổi bật hàng ngày. Chụp ảnh đội. Tạo vlog/reels cho mạng xã hội.'
  ),
  (
    'Safety & Health',
    'Prepare first aid kit. Check weather updates. Monitor team health during ski activities.',
    'Binh',
    '🏥',
    'An toàn & Sức khỏe',
    'Chuẩn bị túi sơ cứu. Kiểm tra cập nhật thời tiết. Theo dõi sức khỏe đội trong hoạt động trượt tuyết.'
  ),
  (
    'Communication',
    'Set up group chat (KakaoTalk/Zalo). Share daily schedule updates. Coordinate meetup points.',
    'Kevin',
    '📱',
    'Giao tiếp',
    'Thiết lập nhóm chat (KakaoTalk/Zalo). Chia sẻ cập nhật lịch trình hàng ngày. Phối hợp điểm hẹn.'
  ),
  (
    'Shopping & Souvenirs',
    'Research best shopping spots in Myeongdong/Insadong. List must-buy items. Budget allocation.',
    'Abby',
    '🛍️',
    'Mua sắm & Quà lưu niệm',
    'Nghiên cứu điểm mua sắm tốt nhất ở Myeongdong/Insadong. Danh sách đồ cần mua. Phân bổ ngân sách.'
  );

-- Insert Info Cards (Travel Essentials)
INSERT INTO info_cards (title, content, icon, title_vi, content_vi) VALUES
  (
    'Visa & Documents',
    'Check visa requirements for Vietnam passport holders. Bring passport (valid 6+ months), ARC if applicable, travel insurance, and emergency contact numbers.',
    'passport',
    'Visa & Giấy tờ',
    'Kiểm tra yêu cầu visa cho người mang hộ chiếu Việt Nam. Mang theo hộ chiếu (còn hạn 6+ tháng), ARC nếu có, bảo hiểm du lịch, và số liên lạc khẩn cấp.'
  ),
  (
    'Essential Apps',
    'Download: KakaoTalk (messaging), Naver Map/Kakao Map (navigation), Papago (translation), T-money app (transport card), Currency converter.',
    'phone',
    'Ứng dụng cần thiết',
    'Tải xuống: KakaoTalk (nhắn tin), Naver Map/Kakao Map (điều hướng), Papago (dịch thuật), T-money app (thẻ giao thông), Chuyển đổi tiền tệ.'
  ),
  (
    'Packing List',
    'Warm clothes (layers), waterproof jacket, thermal wear, ski gear (if bringing), comfortable walking shoes, power adapter (Type C/F), portable charger, Korean Won cash.',
    'luggage',
    'Danh sách đóng gói',
    'Quần áo ấm (nhiều lớp), áo khoác chống thấm nước, đồ giữ nhiệt, đồ trượt tuyết (nếu mang theo), giày đi bộ thoải mái, bộ chuyển đổi nguồn (Type C/F), sạc dự phòng, tiền Won Hàn Quốc.'
  ),
  (
    'Transportation',
    'T-money card for subway/bus (available at convenience stores). Airport Express (AREX) to Seoul. Private bus to Alpensia. Taxi apps: Kakao T or Uber.',
    'train',
    'Giao thông',
    'Thẻ T-money cho tàu điện ngầm/xe buýt (có tại cửa hàng tiện lợi). Airport Express (AREX) đến Seoul. Xe bus riêng đến Alpensia. Ứng dụng taxi: Kakao T hoặc Uber.'
  ),
  (
    'Weather & Clothing',
    'January in Korea: -5°C to 5°C average. Pack thermal layers, down jacket, gloves, beanie, warm socks. Waterproof boots for snow. Check weather forecast daily.',
    'cloud',
    'Thời tiết & Quần áo',
    'Tháng 1 ở Hàn Quốc: -5°C đến 5°C trung bình. Mang theo đồ giữ nhiệt, áo khoác lông vũ, găng tay, mũ len, tất ấm. Giày chống thấm nước cho tuyết. Kiểm tra dự báo thời tiết hàng ngày.'
  ),
  (
    'Money & Budget',
    'Exchange rate: ~1 USD = 1,300 KRW. Bring some cash (Won) for small purchases. Credit cards widely accepted. ATMs available at convenience stores. Budget: ~100,000-150,000 KRW/day per person.',
    'credit-card',
    'Tiền & Ngân sách',
    'Tỷ giá: ~1 USD = 1,300 KRW. Mang một ít tiền mặt (Won) cho mua sắm nhỏ. Thẻ tín dụng được chấp nhận rộng rãi. Máy ATM có tại cửa hàng tiện lợi. Ngân sách: ~100,000-150,000 KRW/ngày/người.'
  ),
  (
    'Food & Dining',
    'Must-try: K-BBQ, Korean fried chicken, bibimbap, tteokbokki, kimchi jjigae. Myeongdong for street food. Check for Halal/Vegetarian options. Tipping not required (10% service charge sometimes).',
    'utensils',
    'Ẩm thực & Nhà hàng',
    'Phải thử: K-BBQ, gà rán Hàn Quốc, bibimbap, tteokbokki, kimchi jjigae. Myeongdong cho đồ ăn đường phố. Kiểm tra lựa chọn Halal/Chay. Không cần tip (đôi khi có phí dịch vụ 10%).'
  ),
  (
    'Cultural Tips',
    'Remove shoes indoors. Use both hands when giving/receiving. Bow slightly when greeting. No tipping culture. Be quiet on public transport. Respect elderly (give up seats).',
    'heart',
    'Mẹo văn hóa',
    'Cởi giày trong nhà. Dùng cả hai tay khi đưa/nhận. Cúi chào nhẹ khi chào hỏi. Không có văn hóa tip. Giữ yên lặng trên phương tiện công cộng. Tôn trọng người già (nhường ghế).'
  ),
  (
    'Emergency Contacts',
    'Emergency: 112 (Police), 119 (Fire/Ambulance). Tourist Hotline: 1330 (24/7, English/Korean). Embassy of Vietnam in Seoul: +82-2-730-5800. Keep hotel address in Korean.',
    'phone-call',
    'Liên hệ khẩn cấp',
    'Khẩn cấp: 112 (Cảnh sát), 119 (Cứu hỏa/Xe cứu thương). Đường dây nóng du lịch: 1330 (24/7, tiếng Anh/Hàn). Đại sứ quán Việt Nam tại Seoul: +82-2-730-5800. Giữ địa chỉ khách sạn bằng tiếng Hàn.'
  ),
  (
    'WiFi & Internet',
    'Free WiFi widely available (cafes, subway, public areas). Consider eSIM or portable WiFi router for constant connection. KakaoTalk for free messaging/calls over WiFi.',
    'wifi',
    'WiFi & Internet',
    'WiFi miễn phí có sẵn rộng rãi (quán cà phê, tàu điện ngầm, khu vực công cộng). Cân nhắc eSIM hoặc bộ định tuyến WiFi di động để kết nối liên tục. KakaoTalk để nhắn tin/gọi miễn phí qua WiFi.'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_info_cards_created_at ON info_cards(created_at);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE info_cards ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON info_cards FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated insert" ON tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated insert" ON info_cards FOR INSERT WITH CHECK (auth.role() = 'authenticated');

