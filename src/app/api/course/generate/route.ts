import { NextResponse } from 'next/server';
import { getAreaBasedList } from '@/lib/api-client';
import { generateAICourse } from '@/lib/gemini';
import { generateMockCourse, MOCK_AREAS } from '@/lib/mock-data';
import { CourseGenerateRequest, CourseDay, CourseSpot } from '@/types';

// Category mapping from contentTypeId
const CONTENT_TYPE_CATEGORY: Record<string, string> = {
  '12': 'nature',
  '14': 'culture',
  '15': 'activity',
  '25': 'nature',
  '28': 'activity',
  '32': 'accommodation',
  '38': 'shopping',
  '39': 'restaurant',
};

const CATEGORY_LABELS: Record<string, string> = {
  nature: '자연/관광',
  culture: '문화시설',
  activity: '레포츠',
  accommodation: '숙박',
  shopping: '쇼핑',
  restaurant: '음식점',
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTravelTime(distKm: number): number {
  return Math.round(distKm / 40 * 60) + 5;
}

// Time slot templates for algorithmic fallback
const TIME_TEMPLATES: Record<string, { time: string; duration: number; types: string[] }[]> = {
  relaxed: [
    { time: '10:00', duration: 90, types: ['12', '28'] },
    { time: '12:00', duration: 90, types: ['39'] },
    { time: '14:00', duration: 60, types: ['14', '12'] },
    { time: '16:00', duration: 60, types: ['39'] },
  ],
  moderate: [
    { time: '09:30', duration: 90, types: ['12', '28'] },
    { time: '11:30', duration: 60, types: ['39'] },
    { time: '13:00', duration: 90, types: ['12', '14'] },
    { time: '15:00', duration: 60, types: ['39'] },
    { time: '16:30', duration: 60, types: ['14', '12'] },
  ],
  active: [
    { time: '09:00', duration: 90, types: ['12', '28'] },
    { time: '11:00', duration: 60, types: ['39'] },
    { time: '12:30', duration: 90, types: ['12', '14'] },
    { time: '14:30', duration: 60, types: ['39'] },
    { time: '16:00', duration: 90, types: ['12', '28'] },
    { time: '18:00', duration: 60, types: ['39'] },
  ],
};

interface PlaceWithCategory {
  contentId: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  addr2?: string;
  areaCode: string;
  sigunguCode?: string;
  mapX: number;
  mapY: number;
  firstImage?: string;
  firstImage2?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  category: string;
}

export async function POST(request: Request) {
  const body: CourseGenerateRequest & { geminiApiKey?: string } = await request.json();
  const { destination, dates, pet, preferences, geminiApiKey } = body;

  const areaName = MOCK_AREAS.find((a) => a.code === destination.areaCode)?.name || '여행';
  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);
  const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  try {
    if (!process.env.DATA_GO_KR_KEY) {
      throw new Error('No API key');
    }

    // 1) Fetch all places in the area from real API
    const rawPlaces = await getAreaBasedList({
      areaCode: destination.areaCode,
      sigunguCode: destination.sigunguCode,
      numOfRows: 200,
      arrange: 'Q',
    });

    if (!rawPlaces || rawPlaces.length === 0) {
      throw new Error('No places found for this area');
    }

    // Convert to typed objects
    const places: PlaceWithCategory[] = rawPlaces.map((item) => ({
      contentId: item.contentid,
      contentTypeId: item.contenttypeid,
      title: item.title,
      addr1: item.addr1,
      addr2: item.addr2,
      areaCode: item.areacode,
      sigunguCode: item.sigungucode,
      mapX: parseFloat(item.mapx) || 0,
      mapY: parseFloat(item.mapy) || 0,
      firstImage: item.firstimage,
      firstImage2: item.firstimage2,
      cat1: item.cat1,
      cat2: item.cat2,
      cat3: item.cat3,
      category: CONTENT_TYPE_CATEGORY[item.contenttypeid] || 'nature',
    }));

    const validPlaces = places.filter((p) => p.mapX > 0 && p.mapY > 0);

    // 2) Try AI course generation if user provided API key
    if (geminiApiKey) {
      try {
        const aiPlan = await generateAICourse(geminiApiKey, validPlaces.map(p => ({
          contentId: p.contentId,
          title: p.title,
          addr1: p.addr1,
          category: CATEGORY_LABELS[p.category] || p.category,
          contentTypeId: p.contentTypeId,
          mapX: p.mapX,
          mapY: p.mapY,
        })), {
          areaName,
          dayCount,
          startDate: dates.startDate,
          petSize: pet.size,
          petBreed: pet.breed,
          petTemperament: pet.temperament,
          pace: preferences.pace,
          categories: preferences.categories,
        });

        // Convert AI plan to CourseDay format
        const placeMap = new Map(validPlaces.map(p => [p.contentId, p]));
        const days: CourseDay[] = [];
        const timeSlots = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];

        for (const aiDay of aiPlan.days) {
          const spots: CourseSpot[] = [];

          for (let i = 0; i < aiDay.spots.length; i++) {
            const aiSpot = aiDay.spots[i];
            const place = placeMap.get(aiSpot.contentId);
            if (!place) continue;

            spots.push({
              order: i + 1,
              contentId: place.contentId,
              title: place.title,
              category: place.category,
              arrivalTime: timeSlots[i] || `${17 + i}:00`,
              duration: place.category === 'restaurant' ? 90 : 60,
              travelTimeToNext: 0,
              petPolicy: {
                sizeAllowed: pet.size === 'large' ? '대형견 포함 가능' : '모든 크기 가능',
                leashRequired: true,
                restrictions: aiSpot.reason,
              },
              coordinates: { mapX: place.mapX, mapY: place.mapY },
              image: place.firstImage,
              addr: place.addr1,
            });
          }

          // Fill travel times
          for (let i = 0; i < spots.length - 1; i++) {
            const dist = calculateDistance(
              spots[i].coordinates.mapY, spots[i].coordinates.mapX,
              spots[i + 1].coordinates.mapY, spots[i + 1].coordinates.mapX,
            );
            spots[i].travelTimeToNext = estimateTravelTime(dist);
          }

          const dayDate = new Date(startDate);
          dayDate.setDate(dayDate.getDate() + aiDay.dayNumber - 1);

          days.push({
            dayNumber: aiDay.dayNumber,
            date: dayDate.toISOString().split('T')[0],
            theme: aiDay.theme,
            spots,
          });
        }

        const totalSpots = days.reduce((sum, d) => sum + d.spots.length, 0);
        const totalTravelTime = days.reduce(
          (sum, d) => sum + d.spots.reduce((s, spot) => s + spot.travelTimeToNext, 0), 0,
        );

        return NextResponse.json({
          tripId: `trip_${Date.now()}`,
          title: `${areaName} ${dayCount}일 반려견 여행 코스`,
          days,
          summary: {
            totalSpots,
            totalTravelTime,
            petFriendlyScore: 4.5,
          },
          aiGenerated: true,
          aiTip: aiPlan.overallTip,
        });
      } catch (aiError) {
        console.error('AI generation failed, falling back to algorithm:', aiError);
        // Fall through to algorithmic generation below
      }
    }

    // 3) Algorithmic fallback (greedy TSP)
    const timeTemplate = TIME_TEMPLATES[preferences.pace] || TIME_TEMPLATES.moderate;
    const usedContentIds = new Set<string>();
    const days: CourseDay[] = [];

    const themes = [
      `${areaName} 핵심 관광 코스`, `${areaName} 자연 힐링 코스`,
      `${areaName} 문화·맛집 투어`, `${areaName} 숨은 명소 발견`,
      `${areaName} 감성 산책 코스`, `${areaName} 바다뷰 카페 투어`,
      `${areaName} 전통·체험 코스`,
    ];

    for (let d = 0; d < dayCount && d < 7; d++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + d);
      const spots: CourseSpot[] = [];
      let lastCoord = { mapX: 0, mapY: 0 };

      for (const slot of timeTemplate) {
        const candidates = validPlaces.filter((p) =>
          !usedContentIds.has(p.contentId) && slot.types.includes(p.contentTypeId)
        );

        if (lastCoord.mapX > 0) {
          candidates.sort((a, b) =>
            calculateDistance(lastCoord.mapY, lastCoord.mapX, a.mapY, a.mapX) -
            calculateDistance(lastCoord.mapY, lastCoord.mapX, b.mapY, b.mapX)
          );
        }

        let selected = candidates[0];
        if (!selected) {
          const fallback = validPlaces.filter((p) => !usedContentIds.has(p.contentId));
          if (lastCoord.mapX > 0) {
            fallback.sort((a, b) =>
              calculateDistance(lastCoord.mapY, lastCoord.mapX, a.mapY, a.mapX) -
              calculateDistance(lastCoord.mapY, lastCoord.mapX, b.mapY, b.mapX)
            );
          }
          selected = fallback[0];
        }
        if (!selected) continue;

        usedContentIds.add(selected.contentId);
        spots.push({
          order: spots.length + 1,
          contentId: selected.contentId,
          title: selected.title,
          category: selected.category,
          arrivalTime: slot.time,
          duration: slot.duration,
          travelTimeToNext: 0,
          petPolicy: {
            sizeAllowed: pet.size === 'large' ? '대형견 포함 가능' : '모든 크기 가능',
            leashRequired: true,
            restrictions: '목줄 필수, 배변봉투 지참',
          },
          coordinates: { mapX: selected.mapX, mapY: selected.mapY },
          image: selected.firstImage,
          addr: selected.addr1,
        });
        lastCoord = { mapX: selected.mapX, mapY: selected.mapY };
      }

      for (let i = 0; i < spots.length - 1; i++) {
        const dist = calculateDistance(
          spots[i].coordinates.mapY, spots[i].coordinates.mapX,
          spots[i + 1].coordinates.mapY, spots[i + 1].coordinates.mapX,
        );
        spots[i].travelTimeToNext = estimateTravelTime(dist);
      }

      days.push({
        dayNumber: d + 1,
        date: dayDate.toISOString().split('T')[0],
        theme: themes[d % themes.length],
        spots,
      });
    }

    const totalSpots = days.reduce((sum, d) => sum + d.spots.length, 0);
    const totalTravelTime = days.reduce(
      (sum, d) => sum + d.spots.reduce((s, spot) => s + spot.travelTimeToNext, 0), 0,
    );

    return NextResponse.json({
      tripId: `trip_${Date.now()}`,
      title: `${areaName} ${dayCount}일 반려견 여행 코스`,
      days,
      summary: { totalSpots, totalTravelTime, petFriendlyScore: 4.2 },
      aiGenerated: false,
    });
  } catch (error) {
    console.error('Course generation failed, using mock:', error);
    const mockCourse = generateMockCourse(
      destination.areaCode,
      dates.startDate,
      dates.endDate,
      pet.size,
    );
    return NextResponse.json({ ...mockCourse, aiGenerated: false });
  }
}
