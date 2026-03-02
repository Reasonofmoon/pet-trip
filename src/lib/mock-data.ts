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

export const MOCK_JEJU_PLACES: Place[] = [
  {
    contentId: '2871364',
    contentTypeId: '12',
    title: '월정리 해안산책로',
    addr1: '제주특별자치도 제주시 구좌읍 월정리',
    areaCode: '39',
    mapX: 126.7945,
    mapY: 33.5559,
    firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    overview: '아름다운 에메랄드빛 바다가 펼쳐지는 해안산책로로, 반려견과 함께 산책하기 좋은 코스입니다.',
  },
  {
    contentId: '2871365',
    contentTypeId: '39',
    title: '댕댕이네 브런치',
    addr1: '제주특별자치도 제주시 구좌읍 월정리 123-4',
    areaCode: '39',
    mapX: 126.7960,
    mapY: 33.5565,
    firstImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    overview: '반려동물 동반 가능한 브런치 카페. 테라스 좌석에서 바다를 바라보며 식사할 수 있습니다.',
  },
  {
    contentId: '2871366',
    contentTypeId: '12',
    title: '함덕해수욕장',
    addr1: '제주특별자치도 제주시 조천읍 함덕리',
    areaCode: '39',
    mapX: 126.6694,
    mapY: 33.5432,
    firstImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    overview: '맑고 투명한 물과 하얀 백사장이 아름다운 해수욕장. 반려견 산책구역이 지정되어 있습니다.',
  },
  {
    contentId: '2871367',
    contentTypeId: '39',
    title: '바다뷰 펫카페',
    addr1: '제주특별자치도 제주시 조천읍 함덕리 456',
    areaCode: '39',
    mapX: 126.6710,
    mapY: 33.5440,
    firstImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    overview: '오션뷰 테라스에서 반려동물과 함께 커피를 즐길 수 있는 펫 프렌들리 카페.',
  },
  {
    contentId: '2871368',
    contentTypeId: '32',
    title: '제주 펫스테이',
    addr1: '제주특별자치도 제주시 애월읍 애월리 789',
    areaCode: '39',
    mapX: 126.3297,
    mapY: 33.4638,
    firstImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    overview: '반려동물 전용 펜션. 전용 마당과 반려동물 목욕시설을 갖추고 있습니다.',
  },
  {
    contentId: '2871369',
    contentTypeId: '12',
    title: '한라산 어리목 탐방로',
    addr1: '제주특별자치도 제주시 해안동',
    areaCode: '39',
    mapX: 126.4935,
    mapY: 33.3629,
    firstImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    overview: '한라산 서쪽 탐방로. 반려견 동반 등산 구간이 일부 지정되어 있습니다.',
  },
  {
    contentId: '2871370',
    contentTypeId: '39',
    title: '애월 멍뭉식당',
    addr1: '제주특별자치도 제주시 애월읍 애월리 101',
    areaCode: '39',
    mapX: 126.3310,
    mapY: 33.4645,
    firstImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    overview: '반려동물과 함께 하는 제주 현지 음식. 마당 좌석이 있어 대형견도 편하게 동반 가능.',
  },
  {
    contentId: '2871371',
    contentTypeId: '12',
    title: '협재해수욕장',
    addr1: '제주특별자치도 제주시 한림읍 협재리',
    areaCode: '39',
    mapX: 126.2396,
    mapY: 33.3939,
    firstImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    overview: '제주의 대표 해수욕장. 비규하기 좋은 자연과 석양이 아름다운 곳.',
  },
  {
    contentId: '2871372',
    contentTypeId: '32',
    title: '서귀포 도그빌라',
    addr1: '제주특별자치도 서귀포시 성산읍',
    areaCode: '39',
    mapX: 126.9284,
    mapY: 33.4588,
    firstImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    overview: '반려동물 전용 풀빌라. 프라이빗 수영장과 넓은 정원이 특징.',
  },
];

export function generateMockCourse(
  areaCode: string,
  startDate: string,
  endDate: string,
  petSize: string,
): TripPlan {
  const areaName = MOCK_AREAS.find(a => a.code === areaCode)?.name || '제주';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const themes = [
    `${areaName} 동부 해안 탐험`,
    `${areaName} 문화·맛집 투어`,
    `${areaName} 서부 자연 힐링`,
    `${areaName} 숨은 명소 발견`,
    `${areaName} 감성 산책 코스`,
    `${areaName} 오름·숲 트레킹`,
    `${areaName} 바다뷰 카페 투어`,
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
      const place = MOCK_JEJU_PLACES[spotIndex % MOCK_JEJU_PLACES.length];
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
