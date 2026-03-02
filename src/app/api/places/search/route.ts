import { NextResponse } from 'next/server';
import { searchKeyword } from '@/lib/api-client';
import { MOCK_JEJU_PLACES } from '@/lib/mock-data';
import { Place } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';
  const areaCode = searchParams.get('areaCode') || undefined;
  const contentTypeId = searchParams.get('contentTypeId') || undefined;

  try {
    if (!process.env.DATA_GO_KR_KEY) {
      throw new Error('No API key');
    }

    const rawItems = await searchKeyword({
      keyword: keyword || '반려동물',
      areaCode,
      contentTypeId,
      numOfRows: 30,
    });

    const items: Place[] = rawItems.map((item) => ({
      contentId: item.contentid,
      contentTypeId: item.contenttypeid,
      title: item.title,
      addr1: item.addr1,
      areaCode: areaCode || '',
      mapX: parseFloat(item.mapx) || 0,
      mapY: parseFloat(item.mapy) || 0,
      firstImage: item.firstimage,
      tel: item.tel,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Search failed:', error);
    // Mock fallback
    const filtered = MOCK_JEJU_PLACES.filter((p) => {
      if (keyword && !p.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (areaCode && p.areaCode !== areaCode) return false;
      return true;
    });
    return NextResponse.json({ items: filtered });
  }
}
