-- ============================================
-- 填充官方 "Korea Team Building 2026" 任务数据
-- Populate Official "Korea Team Building 2026" Tasks
-- ============================================
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本
-- Usage: Run this script in Supabase SQL Editor

-- 步骤 1: 清空 tasks 表的所有数据
-- Step 1: Clear all existing data from tasks table
TRUNCATE TABLE tasks;

-- 步骤 2: 插入官方任务数据（越南语）
-- Step 2: Insert official team building tasks (Vietnamese)

INSERT INTO tasks (title, description, assignee, icon, title_vi, description_vi) VALUES
  (
    'Điều phối phương tiện & Lịch trình (Transport)',
    'Xác nhận xe đưa đón. 7/1: Đón đoàn tại Incheon (07:00) -> Pyeongchang. 9/1: Xe quay lại Seoul. Phối hợp tài xế và điểm dừng nghỉ.',
    'Trieu',
    '🚐',
    'Điều phối phương tiện & Lịch trình (Transport)',
    'Xác nhận xe đưa đón. 7/1: Đón đoàn tại Incheon (07:00) -> Pyeongchang. 9/1: Xe quay lại Seoul. Phối hợp tài xế và điểm dừng nghỉ.'
  ),
  (
    'Thiết kế hoạt động & Team Building',
    'Thiết kế trượt tuyết, snowboard, đêm K-pop hoặc tắm suối nước nóng. Phối hợp khách sạn tổ chức khóa học trượt tuyết. Sắp xếp giao lưu buổi tối.',
    'Diem',
    '🎿',
    'Thiết kế hoạt động & Team Building',
    'Thiết kế trượt tuyết, snowboard, đêm K-pop hoặc tắm suối nước nóng. Phối hợp khách sạn tổ chức khóa học trượt tuyết. Sắp xếp giao lưu buổi tối.'
  ),
  (
    'Điều phối ăn uống (Food & Dining)',
    'Sắp xếp bữa sáng/tối hằng ngày. Gợi ý món Hàn (thịt nướng, lẩu). 9/1: Sắp xếp tiệc đoàn tụ tại Seoul.',
    'Juli',
    '🍽️',
    'Điều phối ăn uống (Food & Dining)',
    'Sắp xếp bữa sáng/tối hằng ngày. Gợi ý món Hàn (thịt nướng, lẩu). 9/1: Sắp xếp tiệc đoàn tụ tại Seoul.'
  ),
  (
    'Hành chính & Ngân sách (Finance)',
    'Tổng hợp chi phí khách sạn, di chuyển. Đảm bảo chứng từ, hóa đơn. Xác định ngân sách tối đa cho từng hoạt động.',
    'Tham',
    '🧾',
    'Hành chính & Ngân sách (Finance)',
    'Tổng hợp chi phí khách sạn, di chuyển. Đảm bảo chứng từ, hóa đơn. Xác định ngân sách tối đa cho từng hoạt động.'
  ),
  (
    'Ghi hình & Truyền thông (Media)',
    'Chụp ảnh/quay video hằng ngày. Tổng hợp tư liệu để chia sẻ nội bộ hoặc đăng mạng xã hội.',
    'My',
    '📸',
    'Ghi hình & Truyền thông (Media)',
    'Chụp ảnh/quay video hằng ngày. Tổng hợp tư liệu để chia sẻ nội bộ hoặc đăng mạng xã hội.'
  ),
  (
    'MC & Hỗ trợ điều phối (Event Host)',
    'Làm MC và hướng dẫn hiện trường. Hỗ trợ thông dịch Hàn-Anh/Việt. Dẫn dắt không khí vui vẻ.',
    'Binh',
    '🎤',
    'MC & Hỗ trợ điều phối (Event Host)',
    'Làm MC và hướng dẫn hiện trường. Hỗ trợ thông dịch Hàn-Anh/Việt. Dẫn dắt không khí vui vẻ.'
  );

-- ✅ 完成！执行后，您的 "Nhiệm vụ" 区域将显示这 6 个官方任务
-- ✅ Done! After execution, your "Tasks" section will display these 6 official tasks

