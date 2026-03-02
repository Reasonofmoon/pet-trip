import { NextResponse } from 'next/server';
import { getDetailCommon, getDetailIntro, getDetailPetTour, getDetailImage } from '@/lib/api-client';
import { MOCK_JEJU_PLACES } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  const { contentId } = params;

  try {
    if (!process.env.DATA_GO_KR_KEY) {
      throw new Error('No API key');
    }

    // Parallel API calls
    const [commonArr, petTourArr, imageArr] = await Promise.all([
      getDetailCommon(contentId),
      getDetailPetTour(contentId),
      getDetailImage(contentId),
    ]);

    const common = commonArr[0] || null;
    const petTour = petTourArr[0] || null;

    // Get intro (requires contentTypeId)
    let intro = null;
    if (common?.contenttypeid) {
      const introArr = await getDetailIntro(contentId, common.contenttypeid);
      intro = introArr[0] || null;
    }

    return NextResponse.json({
      place: common
        ? {
            contentId: common.contentid,
            contentTypeId: common.contenttypeid,
            title: common.title,
            addr1: common.addr1,
            addr2: common.addr2,
            areaCode: common.areacode,
            sigunguCode: common.sigungucode,
            mapX: parseFloat(common.mapx) || 0,
            mapY: parseFloat(common.mapy) || 0,
            overview: common.overview,
            firstImage: common.firstimage,
            firstImage2: common.firstimage2,
            tel: common.tel,
          }
        : null,
      petPolicy: petTour
        ? {
            acmpyPsblCpam: petTour.acmpyPsblCpam,
            acmpyNeedMtr: petTour.acmpyNeedMtr,
            etcAcmpyInfo: petTour.etcAcmpyInfo,
            relaPosesFclty: petTour.relaPosesFclty,
            relaFrnshPrdlst: petTour.relaFrnshPrdlst,
          }
        : null,
      intro: intro
        ? {
            restDate: (intro as Record<string, string>).restdate || (intro as Record<string, string>).restdatefood,
            useTime: (intro as Record<string, string>).usetime || (intro as Record<string, string>).usetimefood || (intro as Record<string, string>).checkintime,
            parking: (intro as Record<string, string>).parking || (intro as Record<string, string>).parkingfood,
            openPeriod: (intro as Record<string, string>).openperiod,
          }
        : null,
      images: imageArr.map((img) => ({
        originImgUrl: img.originimgurl,
        smallImageUrl: img.smallimageurl,
      })),
    });
  } catch (error) {
    console.error('Place detail failed:', error);
    // Mock fallback
    const mockPlace = MOCK_JEJU_PLACES.find((p) => p.contentId === contentId) || MOCK_JEJU_PLACES[0];
    return NextResponse.json({
      place: mockPlace,
      petPolicy: {
        acmpyPsblCpam: '소형견, 중형견, 대형견 모두 가능',
        acmpyNeedMtr: '목줄, 배변봉투 필수 지참',
        etcAcmpyInfo: '야외 공간에서 반려동물과 함께 이용 가능합니다.',
        relaPosesFclty: '반려동물 전용 급수대',
        relaFrnshPrdlst: '반려동물 간식 구매 가능',
      },
      intro: {
        restDate: '매주 화요일',
        useTime: '09:00 ~ 18:00',
        parking: '무료 주차 가능',
        openPeriod: '연중무휴',
      },
      images: mockPlace.firstImage
        ? [{ originImgUrl: mockPlace.firstImage, smallImageUrl: mockPlace.firstImage }]
        : [],
    });
  }
}
