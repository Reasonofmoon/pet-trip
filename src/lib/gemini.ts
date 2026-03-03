// ===== Gemini AI Client for PetTrip Planner =====
// BYOK: User provides their own API key via UI

import { GoogleGenerativeAI } from '@google/generative-ai';

interface PlaceForAI {
  contentId: string;
  title: string;
  addr1: string;
  category: string;
  contentTypeId: string;
  mapX: number;
  mapY: number;
}

interface AICoursePlan {
  days: {
    dayNumber: number;
    theme: string;
    spots: {
      contentId: string;
      reason: string; // AI가 이 장소를 추천한 이유
    }[];
  }[];
  overallTip: string; // 전체 여행 팁
}

const SYSTEM_PROMPT = `당신은 반려동물 동반 여행 전문가입니다.
사용자의 조건(지역, 날짜, 반려동물 정보, 선호도)과 실제 반려동물 동반 가능 장소 목록을 분석하여 최적의 여행 코스를 설계합니다.

규칙:
1. 반드시 제공된 장소 목록의 contentId만 사용하세요.
2. 하루 4-6개 장소를 배치하세요.
3. 이동 거리를 최소화하는 동선을 설계하세요.
4. 관광지 → 식당 → 관광지 → 카페 순서로 자연스럽게 배치하세요.
5. 대형견이면 넓은 야외 장소를 우선하세요.
6. 각 장소 추천 이유를 1-2문장으로 설명하세요.
7. 각 Day에 어울리는 감성적인 테마명을 지어주세요 (예: "한강변 힐링 산책", "강릉 바다향 코스").

JSON 형식으로만 응답하세요.`;

export async function generateAICourse(
  apiKey: string,
  places: PlaceForAI[],
  options: {
    areaName: string;
    dayCount: number;
    startDate: string;
    petSize: string;
    petBreed: string;
    petTemperament: string;
    pace: string;
    categories: string[];
  }
): Promise<AICoursePlan> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const placeSummary = places.slice(0, 60).map(p => 
    `- [${p.contentId}] ${p.title} (${p.category}) @ ${p.addr1} [${p.mapY},${p.mapX}]`
  ).join('\n');

  const userPrompt = `## 여행 조건
- 지역: ${options.areaName}
- 여행 기간: ${options.startDate}부터 ${options.dayCount}일
- 반려동물: ${options.petBreed} (${options.petSize}, 성격: ${options.petTemperament})
- 여행 페이스: ${options.pace}
- 선호 카테고리: ${options.categories.join(', ') || '전체'}

## 이용 가능한 반려동물 동반 장소 (총 ${places.length}개)
${placeSummary}

## 요청
위 장소를 활용하여 ${options.dayCount}일 코스를 설계해주세요.

응답 JSON 형식:
{
  "days": [
    {
      "dayNumber": 1,
      "theme": "테마명",
      "spots": [
        { "contentId": "장소ID", "reason": "추천 이유" }
      ]
    }
  ],
  "overallTip": "전체 여행 팁"
}`;

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: userPrompt },
  ]);

  const text = result.response.text();
  return JSON.parse(text) as AICoursePlan;
}
