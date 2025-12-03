export interface ExplorerOption {
  value: string;
  label: string;
  labelVi: string;
}

export interface CategoryOption extends ExplorerOption {
  subCategories: ExplorerOption[];
}

export const CITIES: ExplorerOption[] = [
  { value: "seoul", label: "Seoul", labelVi: "Seoul" },
  { value: "pyeongchang", label: "Pyeongchang", labelVi: "Pyeongchang" },
];

export const CATEGORIES: CategoryOption[] = [
  {
    value: "food",
    label: "Food",
    labelVi: "Ẩm thực",
    subCategories: [
      { value: "bbq", label: "BBQ", labelVi: "Thịt nướng" },
      { value: "fried-chicken", label: "Fried Chicken", labelVi: "Gà rán" },
      { value: "traditional", label: "Traditional", labelVi: "Truyền thống" },
      { value: "cafe", label: "Cafe", labelVi: "Cà phê" },
      { value: "street-food", label: "Street Food", labelVi: "Đồ ăn vặt" },
    ],
  },
  {
    value: "shopping",
    label: "Shopping",
    labelVi: "Mua sắm",
    subCategories: [
      { value: "department-store", label: "Department Store", labelVi: "TTTM" },
      { value: "cosmetics", label: "Cosmetics", labelVi: "Mỹ phẩm" },
      { value: "souvenirs", label: "Souvenirs", labelVi: "Quà lưu niệm" },
      { value: "underground-mall", label: "Underground Mall", labelVi: "Khu mua sắm ngầm" },
    ],
  },
  {
    value: "attractions",
    label: "Attractions",
    labelVi: "Tham quan",
    subCategories: [
      { value: "historical", label: "Historical", labelVi: "Di tích" },
      { value: "nature", label: "Nature", labelVi: "Thiên nhiên" },
      { value: "photo-spots", label: "Photo Spots", labelVi: "Check-in" },
      { value: "museums", label: "Museums", labelVi: "Bảo tàng" },
    ],
  },
  {
    value: "nightlife",
    label: "Nightlife",
    labelVi: "Giải trí",
    subCategories: [
      { value: "bars-pubs", label: "Bars/Pubs", labelVi: "Quán bar/Pub" },
      { value: "karaoke", label: "Karaoke", labelVi: "Noraebang" },
      { value: "night-market", label: "Night Market", labelVi: "Chợ đêm" },
    ],
  },
];

export interface Recommendation {
  name: string;
  korean_name: string;
  reason: string;
  estimated_rating: number;
}

