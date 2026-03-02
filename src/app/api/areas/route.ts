import { NextResponse } from 'next/server';
import { getAreaCodes } from '@/lib/api-client';
import { MOCK_AREAS } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const areaCode = searchParams.get('areaCode') || undefined;

  try {
    if (!process.env.DATA_GO_KR_KEY) {
      return NextResponse.json({ items: MOCK_AREAS });
    }

    const items = await getAreaCodes(areaCode);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch area codes:', error);
    return NextResponse.json({ items: MOCK_AREAS });
  }
}
