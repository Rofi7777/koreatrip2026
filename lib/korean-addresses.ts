export interface KoreanLocation {
  id: string;
  name: string;
  nameKo: string;
  address: string;
  message: string;
}

export const LOCATIONS_KO: KoreanLocation[] = [
  {
    id: "alpensia",
    name: "Alpensia Resort",
    nameKo: "알펜시아 리조트",
    address: "강원도 평창군 대관령면 솔봉로 325 (알펜시아 리조트)",
    message: "기사님, 알펜시아 리조트로 가주세요.",
  },
  {
    id: "incheon-airport",
    name: "Sân bay Incheon",
    nameKo: "인천국제공항",
    address: "인천국제공항 제1여객터미널",
    message: "기사님, 인천공항으로 가주세요.",
  },
  {
    id: "myeongdong",
    name: "Myeongdong",
    nameKo: "명동",
    address: "서울 중구 명동역 (4호선)",
    message: "기사님, 명동역으로 가주세요.",
  },
  {
    id: "gyeongbokgung",
    name: "Cung điện Gyeongbokgung",
    nameKo: "경복궁",
    address: "서울 종로구 사직로 161 (경복궁)",
    message: "기사님, 경복궁으로 가주세요.",
  },
  {
    id: "coex",
    name: "Gangnam COEX",
    nameKo: "코엑스",
    address: "서울 강남구 영동대로 513 (코엑스)",
    message: "기사님, 코엑스로 가주세요.",
  },
  {
    id: "hotel-seoul",
    name: "Khách sạn Seoul",
    nameKo: "서울 호텔",
    address: "서울시 중구 [호텔 주소]",
    message: "기사님, 이 주소로 가주세요.",
  },
];

