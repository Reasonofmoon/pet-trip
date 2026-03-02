import { NextResponse } from 'next/server';
import { getLocationBasedList } from '@/lib/api-client';
import { Place } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mapX = searchParams.get('mapX');
  const mapY = searchParams.get('mapY');
  const radius = searchParams.get('radius') || '5000';
  const contentTypeId = searchParams.get('contentTypeId') || undefined;

  if (!mapX || !mapY) {
    return NextResponse.json(
      { error: 'mapX and mapY are required' },
      { status: 400 }
    );
  }

  try {
    if (!process.env.DATA_GO_KR_KEY) {
      throw new Error('No API key');
    }

    const rawItems = await getLocationBasedList({
      mapX,
      mapY,
      radius,
      contentTypeId,
      numOfRows: 20,
    });

    const items: Place[] = rawItems.map((item) => ({
      contentId: item.contentid,
      contentTypeId: item.contenttypeid,
      title: item.title,
      addr1: item.addr1,
      areaCode: '',
      mapX: parseFloat(item.mapx) || 0,
      mapY: parseFloat(item.mapy) || 0,
      firstImage: item.firstimage,
      tel: item.tel,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Nearby search failed:', error);
    return NextResponse.json({ items: [] });
  }
}
