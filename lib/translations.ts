export type LanguageCode = "vi" | "zh-TW";

type TranslationMap = Record<string, string>;

export const TRANSLATIONS: Record<LanguageCode, TranslationMap> = {
  vi: {
    app_title: "Korea Trip Assistant 2026",
    nav_brand_subtitle: "POPMART Vietnam",
    nav_home: "Tổng quan",
    nav_schedule: "Lịch trình",
    nav_tasks: "Nhiệm vụ",
    nav_info: "Thông tin",
    nav_tools: "Công cụ",
    nav_gallery: "Moodboard",
    nav_logout: "Đăng xuất",

    hero_badge: "Tháng 1 2026 · Team Offsite",
    hero_title: "Chuyến Du lịch Hàn Quốc 2026",
    hero_subtitle:
      "Seoul · Khu nghỉ dưỡng trượt tuyết Alpensia · Đội POPMART Vietnam",
    countdown_title: "Thời gian còn lại đến ngày khởi hành",
    countdown_days: "Ngày",
    countdown_hours: "Giờ",
    countdown_minutes: "Phút",
    countdown_simulated_date: "Ngày hiện tại (giả lập): 2026-01-07",

    schedule_title: "Lịch trình",
    schedule_items_label: "mục trong lịch trình",
    schedule_day_prefix: "Ngày",
    schedule_loading: "Đang tải lịch trình...",
    schedule_error: "Không tải được lịch trình.",
    schedule_empty_day: "Chưa có hoạt động cho ngày này.",

    tasks_title: "Nhiệm vụ của đội",
    tasks_travel_title: "Di chuyển & Check-in",
    tasks_travel_body:
      "Xác nhận giờ bay, quy định hành lý và thủ tục nhận phòng khách sạn cho cả đội.",
    tasks_alignment_title: "Định hướng đội",
    tasks_alignment_body:
      "Thống nhất mục tiêu POPMART, kỳ vọng và các chủ đề thảo luận chính trong chuyến đi.",
    tasks_fun_title: "Vui chơi & An toàn",
    tasks_fun_body:
      "Đảm bảo mọi người đều nắm thông tin về an toàn khi trượt tuyết, thời tiết và liên lạc khẩn cấp.",

    info_title: "Thông tin chuyến đi",
    info_transport_title: "Di chuyển & Kết nối",
    info_transport_body:
      "Chuẩn bị thẻ T-money, tuyến tàu điện ở Seoul, shuttle tới Alpensia và các lựa chọn Wi‑Fi cho cả đội.",
    info_docs_title: "Giấy tờ & Vật dụng cần thiết",
    info_docs_body:
      "Giữ hộ chiếu, ARC (nếu có), bảo hiểm du lịch và số liên lạc khẩn cấp. Chuẩn bị trang phục giữ ấm cho khu trượt tuyết.",

    tools_title: "Công cụ tiện ích",
    tools_maps_title: "Naver / Kakao Map",
    tools_maps_body:
      "Dùng các app bản đồ nội địa Hàn Quốc để có chỉ đường đi bộ và tuyến xe buýt chính xác hơn.",
    tools_translate_title: "Dịch / Papago",
    tools_translate_body:
      "Hữu ích khi đọc menu, biển báo và giao tiếp với nhân viên bằng tiếng Hàn.",
    tools_ai_title: "AI Trip Guide",
    tools_ai_body:
      "Nhấn bong bóng chat tím để hỏi về lịch trình hoặc gợi ý ăn uống, mua sắm gần đó.",
    tools_weather_title: "Thời tiết",

    reviews_title: "Đánh giá trực tiếp",
    reviews_no_reviews: "Chưa có đánh giá",

    gallery_title: "Moodboard",
    gallery_seoul: "Seoul về đêm",
    gallery_han: "Sông Hàn",
    gallery_alpensia: "Alpensia Ski",
  },
  "zh-TW": {
    app_title: "韓國行程助理 2026",
    nav_brand_subtitle: "POPMART 越南團隊",
    nav_home: "總覽",
    nav_schedule: "行程表",
    nav_tasks: "任務",
    nav_info: "資訊",
    nav_tools: "工具",
    nav_gallery: "靈感牆",
    nav_logout: "登出",

    hero_badge: "2026 年 1 月 · 團建旅行",
    hero_title: "韓國團建之旅 2026",
    hero_subtitle:
      "首爾 · Alpensia 滑雪度假村 · POPMART 越南團隊",
    countdown_title: "距離出發還有",
    countdown_days: "天",
    countdown_hours: "小時",
    countdown_minutes: "分鐘",
    countdown_simulated_date: "模擬當前日期：2026-01-07",

    schedule_title: "行程時間表",
    schedule_items_label: "個行程項目",
    schedule_day_prefix: "第",
    schedule_loading: "正在載入行程...",
    schedule_error: "無法載入行程。",
    schedule_empty_day: "這一天目前沒有安排。",

    tasks_title: "團隊任務",
    tasks_travel_title: "交通與入住",
    tasks_travel_body:
      "確認所有成員的航班時間、行李規定及飯店入住細節。",
    tasks_alignment_title: "目標對齊",
    tasks_alignment_body:
      "對齊 POPMART 目標、預期成果以及此次團建的重要討論主題。",
    tasks_fun_title: "玩樂與安全",
    tasks_fun_body:
      "讓大家了解滑雪安全、天氣狀況與緊急聯絡方式，安心享受旅程。",

    info_title: "旅程資訊",
    info_transport_title: "交通與網路",
    info_transport_body:
      "準備 T-money 卡、首爾地鐵路線、往 Alpensia 接駁車，以及全隊的網路方案。",
    info_docs_title: "證件與必備物品",
    info_docs_body:
      "護照、居留證（如有）、旅遊保險與緊急聯絡資料請隨身攜帶，並準備保暖衣物前往滑雪場。",

    tools_title: "實用工具",
    tools_maps_title: "Naver / Kakao 地圖",
    tools_maps_body:
      "使用韓國在地地圖 App，取得更準確的步行導航與公車路線。",
    tools_translate_title: "翻譯 / Papago",
    tools_translate_body:
      "閱讀菜單、招牌或與店員溝通時，可善用翻譯工具。",
    tools_ai_title: "AI 旅遊顧問",
    tools_ai_body:
      "點擊右下角紫色聊天按鈕，詢問行程或附近美食、購物建議。",
    tools_weather_title: "天氣",

    reviews_title: "即時評價",
    reviews_no_reviews: "暫無評價",

    gallery_title: "靈感牆",
    gallery_seoul: "首爾夜景",
    gallery_han: "漢江風景",
    gallery_alpensia: "Alpensia 滑雪",
  },
  en: {
    app_title: "Korea Trip Assistant 2026",
    nav_brand_subtitle: "POPMART Vietnam",
    nav_home: "Overview",
    nav_schedule: "Schedule",
    nav_tasks: "Tasks",
    nav_info: "Info",
    nav_tools: "Tools",
    nav_gallery: "Moodboard",
    nav_logout: "Logout",

    hero_badge: "January 2026 · Team Offsite",
    hero_title: "Korea Trip 2026",
    hero_subtitle:
      "Seoul · Alpensia Ski Resort · POPMART Vietnam Team",
    countdown_title: "Time until departure",
    countdown_days: "Days",
    countdown_hours: "Hours",
    countdown_minutes: "Minutes",
    countdown_simulated_date: "Simulated current date: 2026-01-07",

    schedule_title: "Trip Schedule",
    schedule_items_label: "items in itinerary",
    schedule_day_prefix: "Day",
    schedule_loading: "Loading itinerary...",
    schedule_error: "Failed to load itinerary.",
    schedule_empty_day: "No itinerary items for this day yet.",

    tasks_title: "Team Tasks",
    tasks_travel_title: "Travel & Check-in",
    tasks_travel_body:
      "Confirm flight times, baggage rules, and hotel check-in for all team members.",
    tasks_alignment_title: "Team Alignment",
    tasks_alignment_body:
      "Align on POPMART goals, expectations, and key discussion topics for the offsite.",
    tasks_fun_title: "Fun & Safety",
    tasks_fun_body:
      "Make sure everyone understands ski safety, weather conditions, and emergency contacts.",

    info_title: "Trip Info",
    info_transport_title: "Transport & Connectivity",
    info_transport_body:
      "Arrange T-money cards, Seoul subway routes, shuttle to Alpensia, and Wi‑Fi options for the whole team.",
    info_docs_title: "Documents & Essentials",
    info_docs_body:
      "Keep passport, ARC (if any), travel insurance, and emergency contacts handy. Pack warm clothes for the ski resort.",

    tools_title: "Utility Tools",
    tools_maps_title: "Naver / Kakao Map",
    tools_maps_body:
      "Use local Korean map apps for more accurate walking directions and bus routes.",
    tools_translate_title: "Translate / Papago",
    tools_translate_body:
      "Great for reading menus, signs, and chatting with staff in Korean.",
    tools_ai_title: "AI Trip Guide",
    tools_ai_body:
      "Tap the purple chat bubble to ask about the itinerary or get nearby food & shopping suggestions.",
    tools_weather_title: "Weather",

    reviews_title: "Live Reviews",
    reviews_no_reviews: "No reviews available",

    gallery_title: "Moodboard",
    gallery_seoul: "Seoul Night",
    gallery_han: "Han River",
    gallery_alpensia: "Alpensia Ski",
  },
};


