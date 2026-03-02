// ===== Mock Data for PetTrip Planner MVP =====
// Used when API keys are not available

import { TripPlan, Place, CourseDay, AreaCode } from '@/types';

export const MOCK_AREAS: AreaCode[] = [
  { code: '1', name: '서울', rnum: 1 },
  { code: '2', name: '인천', rnum: 2 },
  { code: '6', name: '부산', rnum: 3 },
  { code: '31', name: '경기', rnum: 4 },
  { code: '32', name: '강원', rnum: 5 },
  { code: '33', name: '충북', rnum: 6 },
  { code: '34', name: '충남', rnum: 7 },
  { code: '35', name: '경북', rnum: 8 },
  { code: '36', name: '경남', rnum: 9 },
  { code: '37', name: '전북', rnum: 10 },
  { code: '38', name: '전남', rnum: 11 },
  { code: '39', name: '제주', rnum: 12 },
];

export const AREA_EMOJI: Record<string, string> = {
  '1': '🏙️', '2': '🌊', '3': '🏛️', '4': '🌸',
  '5': '🎨', '6': '🌅', '7': '⚓', '8': '🏢',
  '31': '🌳', '32': '⛰️', '33': '🏔️', '34': '🌾',
  '35': '🎎', '36': '🐚', '37': '🎭', '38': '🌿', '39': '🍊',
};

export const CATEGORY_ICONS: Record<string, string> = {
  nature: '🌿',
  cafe: '☕',
  restaurant: '🍽️',
  accommodation: '🏨',
  beach: '🏖️',
  culture: '🎭',
  shopping: '🛍️',
  activity: '🎯',
};

// Region-specific mock places
const MOCK_PLACES_BY_REGION: Record<string, Place[]> = {
  '1': [ // 서울
    { contentId: 'S001', contentTypeId: '12', title: '서울숲 반려견 놀이터', addr1: '서울특별시 성동구 뚝섬로 273', areaCode: '1', mapX: 127.0377, mapY: 37.5445, firstImage: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800' },
    { contentId: 'S002', contentTypeId: '39', title: '멍멍 브런치 카페', addr1: '서울특별시 성동구 서울숲길 17', areaCode: '1', mapX: 127.0420, mapY: 37.5468, firstImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' },
    { contentId: 'S003', contentTypeId: '12', title: '북악산 한양도성 산책길', addr1: '서울특별시 종로구 삼청동', areaCode: '1', mapX: 126.9818, mapY: 37.5912, firstImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' },
    { contentId: 'S004', contentTypeId: '39', title: '이태원 도그카페', addr1: '서울특별시 용산구 이태원로 200', areaCode: '1', mapX: 126.9948, mapY: 37.5346, firstImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
    { contentId: 'S005', contentTypeId: '12', title: '한강공원 반포지구', addr1: '서울특별시 서초구 반포동', areaCode: '1', mapX: 126.9958, mapY: 37.5097, firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { contentId: 'S006', contentTypeId: '39', title: '연남동 댕댕식당', addr1: '서울특별시 마포구 연남동 239-44', areaCode: '1', mapX: 126.9247, mapY: 37.5668, firstImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    { contentId: 'S007', contentTypeId: '12', title: '올림픽공원 반려견 산책로', addr1: '서울특별시 송파구 올림픽로 424', areaCode: '1', mapX: 127.1212, mapY: 37.5202, firstImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' },
    { contentId: 'S008', contentTypeId: '39', title: '삼청동 왈왈카페', addr1: '서울특별시 종로구 삼청로 115', areaCode: '1', mapX: 126.9822, mapY: 37.5849, firstImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800' },
    { contentId: 'S009', contentTypeId: '32', title: '강남 펫프렌들리 호텔', addr1: '서울특별시 강남구 테헤란로 152', areaCode: '1', mapX: 127.0292, mapY: 37.5010, firstImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
  ],
  '6': [ // 부산
    { contentId: 'B001', contentTypeId: '12', title: '해운대 달맞이길', addr1: '부산광역시 해운대구 달맞이길', areaCode: '6', mapX: 129.1915, mapY: 35.1562, firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { contentId: 'B002', contentTypeId: '39', title: '광안리 도그카페', addr1: '부산광역시 수영구 광안해변로 300', areaCode: '6', mapX: 129.1182, mapY: 35.1531, firstImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' },
    { contentId: 'B003', contentTypeId: '12', title: '태종대 유원지', addr1: '부산광역시 영도구 전망로 24', areaCode: '6', mapX: 129.0848, mapY: 35.0518, firstImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' },
    { contentId: 'B004', contentTypeId: '39', title: '해운대 냥멍레스토랑', addr1: '부산광역시 해운대구 해운대해변로 264', areaCode: '6', mapX: 129.1605, mapY: 35.1587, firstImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    { contentId: 'B005', contentTypeId: '12', title: '이기대 해안산책로', addr1: '부산광역시 남구 이기대공원로', areaCode: '6', mapX: 129.1218, mapY: 35.1143, firstImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
    { contentId: 'B006', contentTypeId: '39', title: '전포 댕댕카페', addr1: '부산광역시 부산진구 전포대로 199', areaCode: '6', mapX: 129.0650, mapY: 35.1519, firstImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
    { contentId: 'B007', contentTypeId: '12', title: '오륙도 스카이워크', addr1: '부산광역시 남구 오륙도로 137', areaCode: '6', mapX: 129.1235, mapY: 35.1002, firstImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' },
    { contentId: 'B008', contentTypeId: '39', title: '기장 펫브런치', addr1: '부산광역시 기장군 일광면', areaCode: '6', mapX: 129.2230, mapY: 35.2581, firstImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800' },
    { contentId: 'B009', contentTypeId: '32', title: '해운대 펫호텔', addr1: '부산광역시 해운대구 마린시티', areaCode: '6', mapX: 129.1467, mapY: 35.1583, firstImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
  ],
  '32': [ // 강원
    { contentId: 'G001', contentTypeId: '12', title: '경포대 해변 산책로', addr1: '강원특별자치도 강릉시 경포로', areaCode: '32', mapX: 128.9084, mapY: 37.7958, firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { contentId: 'G002', contentTypeId: '39', title: '강릉 도그프렌들리 카페', addr1: '강원특별자치도 강릉시 안목해변로', areaCode: '32', mapX: 128.9469, mapY: 37.7729, firstImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' },
    { contentId: 'G003', contentTypeId: '12', title: '정동진 해안', addr1: '강원특별자치도 강릉시 강동면 정동진리', areaCode: '32', mapX: 129.0329, mapY: 37.6929, firstImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' },
    { contentId: 'G004', contentTypeId: '39', title: '속초 멍카페', addr1: '강원특별자치도 속초시 해오름로', areaCode: '32', mapX: 128.5946, mapY: 38.2070, firstImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
    { contentId: 'G005', contentTypeId: '12', title: '낙산해변', addr1: '강원특별자치도 양양군 강현면 해맞이길', areaCode: '32', mapX: 128.6321, mapY: 38.1176, firstImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
    { contentId: 'G006', contentTypeId: '39', title: '춘천 닭갈비 골목', addr1: '강원특별자치도 춘천시 금강로 62번길', areaCode: '32', mapX: 127.7315, mapY: 37.8813, firstImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    { contentId: 'G007', contentTypeId: '12', title: '대관령 양떼목장', addr1: '강원특별자치도 평창군 대관령면', areaCode: '32', mapX: 128.7347, mapY: 37.6868, firstImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' },
    { contentId: 'G008', contentTypeId: '39', title: '양양 서핑카페', addr1: '강원특별자치도 양양군 현북면 하조대해안길', areaCode: '32', mapX: 128.6300, mapY: 38.0600, firstImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800' },
    { contentId: 'G009', contentTypeId: '32', title: '강릉 펫펜션', addr1: '강원특별자치도 강릉시 사천면', areaCode: '32', mapX: 128.8558, mapY: 37.8199, firstImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
  ],
};

// Jeju is the default fallback
export const MOCK_JEJU_PLACES: Place[] = [
  { contentId: '2871364', contentTypeId: '12', title: '월정리 해안산책로', addr1: '제주특별자치도 제주시 구좌읍 월정리', areaCode: '39', mapX: 126.7945, mapY: 33.5559, firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { contentId: '2871365', contentTypeId: '39', title: '댕댕이네 브런치', addr1: '제주특별자치도 제주시 구좌읍 월정리 123-4', areaCode: '39', mapX: 126.7960, mapY: 33.5565, firstImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' },
  { contentId: '2871366', contentTypeId: '12', title: '함덕해수욕장', addr1: '제주특별자치도 제주시 조천읍 함덕리', areaCode: '39', mapX: 126.6694, mapY: 33.5432, firstImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
  { contentId: '2871367', contentTypeId: '39', title: '바다뷰 펫카페', addr1: '제주특별자치도 제주시 조천읍 함덕리 456', areaCode: '39', mapX: 126.6710, mapY: 33.5440, firstImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
  { contentId: '2871368', contentTypeId: '32', title: '제주 펫스테이', addr1: '제주특별자치도 제주시 애월읍 애월리 789', areaCode: '39', mapX: 126.3297, mapY: 33.4638, firstImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
  { contentId: '2871369', contentTypeId: '12', title: '한라산 어리목 탐방로', addr1: '제주특별자치도 제주시 해안동', areaCode: '39', mapX: 126.4935, mapY: 33.3629, firstImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' },
  { contentId: '2871370', contentTypeId: '39', title: '애월 멍뭉식당', addr1: '제주특별자치도 제주시 애월읍 애월리 101', areaCode: '39', mapX: 126.3310, mapY: 33.4645, firstImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  { contentId: '2871371', contentTypeId: '12', title: '협재해수욕장', addr1: '제주특별자치도 제주시 한림읍 협재리', areaCode: '39', mapX: 126.2396, mapY: 33.3939, firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { contentId: '2871372', contentTypeId: '32', title: '서귀포 도그빌라', addr1: '제주특별자치도 서귀포시 성산읍', areaCode: '39', mapX: 126.9284, mapY: 33.4588, firstImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
];

function getMockPlaces(areaCode: string): Place[] {
  return MOCK_PLACES_BY_REGION[areaCode] || MOCK_JEJU_PLACES;
}

export function generateMockCourse(
  areaCode: string,
  startDate: string,
  endDate: string,
  petSize: string,
): TripPlan {
  const areaName = MOCK_AREAS.find(a => a.code === areaCode)?.name || '여행';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const places = getMockPlaces(areaCode);

  const themes = [
    `${areaName} 핵심 관광 코스`,
    `${areaName} 문화·맛집 투어`,
    `${areaName} 자연 힐링 코스`,
    `${areaName} 숨은 명소 발견`,
    `${areaName} 감성 산책 코스`,
    `${areaName} 로컬 맛집 투어`,
    `${areaName} 카페 투어`,
  ];

  const timeSlots = [
    { time: '09:30', duration: 90, category: 'nature' },
    { time: '11:30', duration: 60, category: 'cafe' },
    { time: '12:30', duration: 90, category: 'restaurant' },
    { time: '14:30', duration: 120, category: 'nature' },
    { time: '17:00', duration: 60, category: 'cafe' },
  ];

  const days: CourseDay[] = [];
  let spotIndex = 0;

  for (let d = 0; d < dayCount && d < 7; d++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + d);

    const daySpots = timeSlots.map((slot, i) => {
      const place = places[spotIndex % places.length];
      spotIndex++;
      return {
        order: i + 1,
        contentId: place.contentId,
        title: place.title,
        category: slot.category,
        arrivalTime: slot.time,
        duration: slot.duration,
        travelTimeToNext: i < timeSlots.length - 1 ? 15 + Math.floor(Math.random() * 20) : 0,
        petPolicy: {
          sizeAllowed: petSize === 'large' ? '대형견 가능' : '모든 크기',
          leashRequired: true,
          restrictions: '목줄 필수, 배변봉투 지참',
        },
        coordinates: { mapX: place.mapX, mapY: place.mapY },
        image: place.firstImage,
        addr: place.addr1,
      };
    });

    days.push({
      dayNumber: d + 1,
      date: dayDate.toISOString().split('T')[0],
      theme: themes[d % themes.length],
      spots: daySpots,
    });
  }

  return {
    tripId: `trip_${Date.now()}`,
    title: `${areaName} ${dayCount}일 반려견 여행 코스`,
    days,
    summary: {
      totalSpots: days.reduce((sum, d) => sum + d.spots.length, 0),
      totalTravelTime: days.reduce(
        (sum, d) => sum + d.spots.reduce((s, spot) => s + spot.travelTimeToNext, 0), 0
      ),
      petFriendlyScore: 4.2,
    },
  };
}
