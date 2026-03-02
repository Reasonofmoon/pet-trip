// ===== PetTrip Planner — Core Types =====

// ----- Pet -----
export type PetSize = 'small' | 'medium' | 'large';
export type PetTemperament = 'calm' | 'active' | 'anxious';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  size: PetSize;
  weight?: number;
  temperament: PetTemperament;
}

// ----- Area & Category Codes -----
export interface AreaCode {
  code: string;
  name: string;
  rnum: number;
}

export interface SigunguCode {
  code: string;
  name: string;
  rnum: number;
}

export interface CategoryCode {
  code: string;
  name: string;
  rnum: number;
}

// ----- Place & Details -----
export interface Place {
  contentId: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  addr2?: string;
  areaCode: string;
  sigunguCode?: string;
  mapX: number;
  mapY: number;
  tel?: string;
  firstImage?: string;
  firstImage2?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  overview?: string;
}

export interface PetPolicy {
  contentId: string;
  petTurla?: string;       // 반려동물 동반 가능 장소
  relaAcdntRiskMtr?: string; // 관련사고 위험요인
  acmpyTypeCd?: string;    // 동반유형코드
  relaPosesFclty?: string; // 관련편의시설
  relaFrnshPrdlst?: string;// 관련비품목록
  etcAcmpyInfo?: string;   // 기타동반정보
  relaPurcPrdlst?: string; // 관련구매목록
  acmpyPsblCpam?: string;  // 동반가능동물
  acmpyNeedMtr?: string;   // 동반필요사항
}

export interface PlaceDetail {
  contentId: string;
  contentTypeId: string;
  restDate?: string;
  useTime?: string;
  parking?: string;
  openPeriod?: string;
  homepage?: string;
}

export interface PlaceImage {
  contentId: string;
  originImgUrl: string;
  smallImageUrl: string;
  imgName?: string;
  serialNum: string;
}

// ----- Course / Trip -----
export interface CourseSpot {
  order: number;
  contentId: string;
  title: string;
  category: string;
  arrivalTime: string;
  duration: number;          // minutes
  travelTimeToNext: number;  // minutes
  petPolicy?: {
    sizeAllowed: string;
    leashRequired: boolean;
    restrictions?: string;
  };
  coordinates: {
    mapX: number;
    mapY: number;
  };
  image?: string;
  addr?: string;
}

export interface CourseDay {
  dayNumber: number;
  date: string;
  theme: string;
  spots: CourseSpot[];
}

export interface TripPlan {
  tripId: string;
  title: string;
  days: CourseDay[];
  summary: {
    totalSpots: number;
    totalTravelTime: number;
    petFriendlyScore: number;
  };
}

// ----- API Request / Response -----
export interface CourseGenerateRequest {
  destination: {
    areaCode: string;
    sigunguCode?: string;
  };
  dates: {
    startDate: string;
    endDate: string;
  };
  pet: {
    size: PetSize;
    breed: string;
    temperament: PetTemperament;
  };
  preferences: {
    categories: string[];
    pace: 'relaxed' | 'moderate' | 'active';
    budgetLevel: 'low' | 'medium' | 'high';
  };
}

export interface CourseGenerateResponse {
  tripId: string;
  title: string;
  days: CourseDay[];
  summary: {
    totalSpots: number;
    totalTravelTime: number;
    petFriendlyScore: number;
  };
}

// ----- Filter / UI State -----
export interface SearchFilters {
  keyword: string;
  areaCode: string;
  sigunguCode?: string;
  contentTypeId?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  arrange?: 'A' | 'C' | 'D' | 'O' | 'Q' | 'R';
}

// ----- Wizard State -----
export interface WizardState {
  step: number;
  destination: {
    areaCode: string;
    areaName: string;
    sigunguCode?: string;
    sigunguName?: string;
  };
  dates: {
    startDate: string;
    endDate: string;
  };
  pet: {
    size: PetSize;
    breed: string;
    temperament: PetTemperament;
  };
  preferences: {
    categories: string[];
    pace: 'relaxed' | 'moderate' | 'active';
    budgetLevel: 'low' | 'medium' | 'high';
  };
}

// ----- Content Type Map -----
export const CONTENT_TYPE_MAP: Record<string, string> = {
  '12': '관광지',
  '14': '문화시설',
  '15': '축제공연행사',
  '25': '여행코스',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점',
};

// ----- Area Code Map -----
export const AREA_CODE_MAP: Record<string, string> = {
  '1': '서울',
  '2': '인천',
  '3': '대전',
  '4': '대구',
  '5': '광주',
  '6': '부산',
  '7': '울산',
  '8': '세종',
  '31': '경기',
  '32': '강원',
  '33': '충북',
  '34': '충남',
  '35': '경북',
  '36': '경남',
  '37': '전북',
  '38': '전남',
  '39': '제주',
};
