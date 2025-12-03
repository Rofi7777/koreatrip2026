-- ============================================
-- 清理并填充真实任务数据 (Clean & Seed Real Tasks)
-- ============================================
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本
-- Usage: Run this script in Supabase SQL Editor

-- 步骤 1: 清空 tasks 表的所有数据
-- Step 1: Clear all existing data from tasks table
TRUNCATE TABLE tasks;

-- 步骤 2: 插入真实的团队任务数据（越南语）
-- Step 2: Insert real team tasks (Vietnamese)

INSERT INTO tasks (title, description, assignee, icon, title_vi, description_vi) VALUES
  (
    'Vận chuyển & Hậu cần',
    'Đặt xe bus riêng Incheon->Alpensia. Theo dõi chuyến bay LJ082. Chuẩn bị thẻ T-money cho cả đội.',
    'Trieu',
    '🚐',
    'Vận chuyển & Hậu cần',
    'Đặt xe bus riêng Incheon->Alpensia. Theo dõi chuyến bay LJ082. Chuẩn bị thẻ T-money cho cả đội.'
  ),
  (
    'Hoạt động Trượt tuyết',
    'Liên hệ thuê đồ trượt tuyết. Đặt huấn luyện viên (nói tiếng Trung/Anh). Tổ chức game team building trên tuyết.',
    'Diem',
    '🎿',
    'Hoạt động Trượt tuyết',
    'Liên hệ thuê đồ trượt tuyết. Đặt huấn luyện viên (nói tiếng Trung/Anh). Tổ chức game team building trên tuyết.'
  ),
  (
    'Ẩm thực & Nhà hàng',
    'Đặt tiệc tối Welcome Dinner tại Alpensia. Tìm quán thịt nướng ngon nhất ở Myeongdong và đặt bàn trước.',
    'Juli',
    '🍖',
    'Ẩm thực & Nhà hàng',
    'Đặt tiệc tối Welcome Dinner tại Alpensia. Tìm quán thịt nướng ngon nhất ở Myeongdong và đặt bàn trước.'
  ),
  (
    'Ngân sách & Hành chính',
    'Thu quỹ team (Won). Giữ lại tất cả hóa đơn. Theo dõi chi tiêu hàng ngày của đoàn.',
    'Tham',
    '💰',
    'Ngân sách & Hành chính',
    'Thu quỹ team (Won). Giữ lại tất cả hóa đơn. Theo dõi chi tiêu hàng ngày của đoàn.'
  ),
  (
    'Hình ảnh & Video',
    'Chụp ảnh khoảnh khắc team. Tạo album Google Photos chia sẻ. Dựng video highlight sau chuyến đi.',
    'My',
    '📸',
    'Hình ảnh & Video',
    'Chụp ảnh khoảnh khắc team. Tạo album Google Photos chia sẻ. Dựng video highlight sau chuyến đi.'
  ),
  (
    'MC & Khuấy động',
    'Dẫn chương trình mini game trên xe bus. Thông báo lịch trình hàng ngày. Giữ lửa cho team!',
    'Binh',
    '🎤',
    'MC & Khuấy động',
    'Dẫn chương trình mini game trên xe bus. Thông báo lịch trình hàng ngày. Giữ lửa cho team!'
  );

-- ✅ 完成！执行后，您的 "Nhiệm vụ" 区域将显示这 6 个真实任务
-- ✅ Done! After execution, your "Tasks" section will display these 6 real tasks

