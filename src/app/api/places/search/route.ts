import { NextResponse } from 'next/server';
import { searchKeyword, getAreaBasedList } from '@/lib/api-client';
import { MOCK_JEJU_PLACES, MOCK_AREAS } from '@/lib/mock-data';
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

    let items: Place[];

    if (keyword) {
      // Keyword search
      const rawItems = await searchKeyword({
        keyword,
        areaCode,
        contentTypeId,
        numOfRows: 50,
      });

      items = rawItems.map((item) => ({
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
    } else if (areaCode) {
      // Area-based browse
      const rawItems = await getAreaBasedList({
        areaCode,
        contentTypeId,
        numOfRows: 50,
        arrange: 'Q', // popular first
      });

      items = rawItems.map((item) => ({
        contentId: item.contentid,
        contentTypeId: item.contenttypeid,
        title: item.title,
        addr1: item.addr1,
        areaCode: item.areacode,
        mapX: parseFloat(item.mapx) || 0,
        mapY: parseFloat(item.mapy) || 0,
        firstImage: item.firstimage,
        tel: item.tel,
      }));
    } else {
      // Default: search all pet-friendly places
      const rawItems = await searchKeyword({
        keyword: '반려동물',
        numOfRows: 50,
      });

      items = rawItems.map((item) => ({
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
    }

    const areaName = areaCode ? MOCK_AREAS.find(a => a.code === areaCode)?.name : undefined;

    return NextResponse.json({
      items,
      total: items.length,
      areaName,
    });
  } catch (error) {
    console.error('Search failed:', error);
    // Mock fallback
    const filtered = MOCK_JEJU_PLACES.filter((p) => {
      if (keyword && !p.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (areaCode && p.areaCode !== areaCode) return false;
      return true;
    });
    return NextResponse.json({ items: filtered, total: filtered.length, fallback: true });
  }
}
