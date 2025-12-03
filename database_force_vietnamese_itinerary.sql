-- ============================================
-- 强制将所有行程数据转换为越南语
-- Force Convert ALL Itinerary Data to Vietnamese
-- ============================================
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本
-- Usage: Run this script in Supabase SQL Editor

-- 步骤 1: 完全清空 itinerary 表
-- Step 1: Completely clear itinerary table
TRUNCATE TABLE itinerary CASCADE;

-- 步骤 2: 插入完整的官方越南语行程数据（24 项）
-- Step 2: Insert complete official Vietnamese itinerary (24 items)

INSERT INTO itinerary (day_number, date, start_time, title, description, location, category, owner, title_vi, description_vi) VALUES
  -- NGÀY 1 (7 tháng 1)
  (
    1,
    '2026-01-07',
    '07:00',
    'Khởi hành từ sân bay Tân Sơn Nhất',
    'Chuyến bay: LJ082 (T-WAY) 07:00-10:30',
    'Sân bay Tân Sơn Nhất',
    'FLIGHT',
    'Trieu',
    'Khởi hành từ sân bay Tân Sơn Nhất',
    'Chuyến bay: LJ082 (T-WAY) 07:00-10:30'
  ),
  (
    1,
    '2026-01-07',
    '10:30',
    'Đến sân bay quốc tế Incheon',
    'Trieu phụ trách xác nhận xe đón tại sân bay',
    'Incheon Airport',
    'FLIGHT',
    'Trieu',
    'Đến sân bay quốc tế Incheon',
    'Trieu phụ trách xác nhận xe đón tại sân bay'
  ),
  (
    1,
    '2026-01-07',
    '11:00',
    'Khởi hành đi Pyeongchang',
    'Thời gian di chuyển khoảng 2,5-3 giờ, có dừng nghỉ tại các trạm dọc đường.',
    'Route to Pyeongchang',
    'TRANSPORT',
    'Trieu',
    'Khởi hành đi Pyeongchang',
    'Thời gian di chuyển khoảng 2,5-3 giờ, có dừng nghỉ tại các trạm dọc đường.'
  ),
  (
    1,
    '2026-01-07',
    '14:00',
    'Nghỉ ngơi ăn trưa',
    'Ăn trưa tại trạm dừng nghỉ trên đường cao tốc',
    'Rest Area',
    'FOOD',
    'Juli',
    'Nghỉ ngơi ăn trưa',
    'Ăn trưa tại trạm dừng nghỉ trên đường cao tốc'
  ),
  (
    1,
    '2026-01-07',
    '15:00',
    'Check-in InterContinental Alpensia',
    'Nhận phòng, phân chia phòng và nghỉ ngơi tự do',
    'Alpensia Resort',
    'HOTEL',
    'Zoe',
    'Check-in InterContinental Alpensia',
    'Nhận phòng, phân chia phòng và nghỉ ngơi tự do'
  ),
  (
    1,
    '2026-01-07',
    '18:30',
    'Tiệc tối chào mừng (Welcome Dinner)',
    'Nhà hàng trong khu nghỉ dưỡng hoặc nhà hàng Hàn Quốc lân cận',
    'Alpensia Resort',
    'FOOD',
    'Juli',
    'Tiệc tối chào mừng (Welcome Dinner)',
    'Nhà hàng trong khu nghỉ dưỡng hoặc nhà hàng Hàn Quốc lân cận'
  ),
  (
    1,
    '2026-01-07',
    '20:00',
    'Họp đoàn phổ biến lịch trình',
    'Giới thiệu lịch trình chi tiết và các lưu ý quan trọng',
    'Hotel Lobby',
    'ACTIVITY',
    'Rofi',
    'Họp đoàn phổ biến lịch trình',
    'Giới thiệu lịch trình chi tiết và các lưu ý quan trọng'
  ),

  -- NGÀY 2 (8 tháng 1)
  (
    2,
    '2026-01-08',
    '08:00',
    'Ăn sáng tại khách sạn',
    'Buffet sáng',
    'Hotel Restaurant',
    'FOOD',
    'Juli',
    'Ăn sáng tại khách sạn',
    'Buffet sáng'
  ),
  (
    2,
    '2026-01-08',
    '09:30',
    'Thuê dụng cụ trượt tuyết',
    'Nhận đồ trượt tuyết, phân nhóm huấn luyện viên',
    'Ski House',
    'ACTIVITY',
    'Diem',
    'Thuê dụng cụ trượt tuyết',
    'Nhận đồ trượt tuyết, phân nhóm huấn luyện viên'
  ),
  (
    2,
    '2026-01-08',
    '10:00',
    'Bắt đầu khóa học trượt tuyết',
    'Chia nhóm học trượt tuyết cơ bản/nâng cao (khoảng 3 giờ). Phụ trách: Diem điều phối',
    'Ski Slope',
    'ACTIVITY',
    'Diem',
    'Bắt đầu khóa học trượt tuyết',
    'Chia nhóm học trượt tuyết cơ bản/nâng cao (khoảng 3 giờ). Phụ trách: Diem điều phối'
  ),
  (
    2,
    '2026-01-08',
    '13:00',
    'Ăn trưa',
    'Nhà hàng tại khu trượt tuyết hoặc resort',
    'Ski Cafeteria',
    'FOOD',
    'Juli',
    'Ăn trưa',
    'Nhà hàng tại khu trượt tuyết hoặc resort'
  ),
  (
    2,
    '2026-01-08',
    '14:30',
    'Thời gian trượt tuyết tự do',
    'Tự do tập luyện hoặc khám phá các tiện ích của khu nghỉ dưỡng',
    'Ski Slope',
    'ACTIVITY',
    'Diem',
    'Thời gian trượt tuyết tự do',
    'Tự do tập luyện hoặc khám phá các tiện ích của khu nghỉ dưỡng'
  ),
  (
    2,
    '2026-01-08',
    '19:00',
    'Ăn tối thịt nướng Hàn Quốc',
    'Tiệc nướng BBQ, chia sẻ trải nghiệm trượt tuyết trong ngày',
    'K-BBQ Restaurant',
    'FOOD',
    'Juli',
    'Ăn tối thịt nướng Hàn Quốc',
    'Tiệc nướng BBQ, chia sẻ trải nghiệm trượt tuyết trong ngày'
  ),

  -- NGÀY 3 (9 tháng 1)
  (
    3,
    '2026-01-09',
    '10:00',
    'Trả phòng, khởi hành đi Seoul',
    'Thời gian di chuyển khoảng 2,5-3 giờ. Phụ trách: Trieu sắp xếp xe',
    'Route to Seoul',
    'TRANSPORT',
    'Trieu',
    'Trả phòng, khởi hành đi Seoul',
    'Thời gian di chuyển khoảng 2,5-3 giờ. Phụ trách: Trieu sắp xếp xe'
  ),
  (
    3,
    '2026-01-09',
    '13:00',
    'Đến trung tâm Seoul',
    'Gửi hành lý tại khách sạn hoặc check-in',
    'Seoul Hotel',
    'HOTEL',
    'Trieu',
    'Đến trung tâm Seoul',
    'Gửi hành lý tại khách sạn hoặc check-in'
  ),
  (
    3,
    '2026-01-09',
    '15:30',
    'Tự do mua sắm tại Myeongdong',
    'Mua sắm, ẩm thực đường phố, trải nghiệm văn hóa. Phụ trách: Rofi cung cấp list mua sắm',
    'Myeongdong',
    'ACTIVITY',
    'Rofi',
    'Tự do mua sắm tại Myeongdong',
    'Mua sắm, ẩm thực đường phố, trải nghiệm văn hóa. Phụ trách: Rofi cung cấp list mua sắm'
  ),
  (
    3,
    '2026-01-09',
    '19:00',
    'Ăn tối tại Myeongdong',
    'Tự do lựa chọn hoặc ăn chung cả đoàn',
    'Myeongdong',
    'FOOD',
    'Juli',
    'Ăn tối tại Myeongdong',
    'Tự do lựa chọn hoặc ăn chung cả đoàn'
  ),

  -- NGÀY 4 (10 tháng 1)
  (
    4,
    '2026-01-10',
    '09:30',
    'Tham quan Cung điện Gyeongbokgung',
    'Trải nghiệm văn hóa truyền thống, thuê Hanbok',
    'Gyeongbokgung Palace',
    'ACTIVITY',
    'Rofi',
    'Tham quan Cung điện Gyeongbokgung',
    'Trải nghiệm văn hóa truyền thống, thuê Hanbok'
  ),
  (
    4,
    '2026-01-10',
    '11:30',
    'Làng cổ Bukchon Hanok',
    'Chụp ảnh check-in, ngắm kiến trúc truyền thống',
    'Bukchon Hanok Village',
    'ACTIVITY',
    'My',
    'Làng cổ Bukchon Hanok',
    'Chụp ảnh check-in, ngắm kiến trúc truyền thống'
  ),
  (
    4,
    '2026-01-10',
    '15:00',
    'Khám phá khu Gangnam',
    'COEX Mall, Thư viện Starfield. Phụ trách: Rofi',
    'Gangnam COEX',
    'ACTIVITY',
    'Rofi',
    'Khám phá khu Gangnam',
    'COEX Mall, Thư viện Starfield. Phụ trách: Rofi'
  ),
  (
    4,
    '2026-01-10',
    '18:30',
    'Ăn tối BBQ tại Gangnam',
    'Trải nghiệm nhà hàng thịt nướng cao cấp',
    'Gangnam BBQ',
    'FOOD',
    'Juli',
    'Ăn tối BBQ tại Gangnam',
    'Trải nghiệm nhà hàng thịt nướng cao cấp'
  ),

  -- NGÀY 5 (11 tháng 1)
  (
    5,
    '2026-01-11',
    '10:00',
    'Thời gian mua sắm cuối cùng',
    'Khu Hongdae, Ewha hoặc cửa hàng miễn thuế',
    'Hongdae',
    'ACTIVITY',
    'Rofi',
    'Thời gian mua sắm cuối cùng',
    'Khu Hongdae, Ewha hoặc cửa hàng miễn thuế'
  ),
  (
    5,
    '2026-01-11',
    '14:00',
    'Di chuyển ra sân bay Incheon',
    'Thời gian di chuyển khoảng 1 giờ',
    'Route to Airport',
    'TRANSPORT',
    'Trieu',
    'Di chuyển ra sân bay Incheon',
    'Thời gian di chuyển khoảng 1 giờ'
  ),
  (
    5,
    '2026-01-11',
    '17:05',
    'Chuyến bay về Việt Nam',
    'Chuyến bay: LJ083 (T-WAY) 17:05-18:40 -> TP.HCM (or Taipei transit)',
    'Incheon Airport',
    'FLIGHT',
    'Trieu',
    'Chuyến bay về Việt Nam',
    'Chuyến bay: LJ083 (T-WAY) 17:05-18:40 -> TP.HCM (or Taipei transit)'
  );

-- ✅ 完成！执行后，所有行程数据将完全转换为越南语
-- ✅ Done! After execution, ALL itinerary data will be completely converted to Vietnamese

