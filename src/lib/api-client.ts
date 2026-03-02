// ===== 한국관광공사 KorPetTourService2 API Client =====

const BASE_URL = 'https://apis.data.go.kr/B551011/KorPetTourService2';

// ----- In-Memory Cache -----
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

// TTL constants
const TTL = {
  AREA_CODES: 24 * 60 * 60 * 1000,       // 24h
  PLACE_LIST: 6 * 60 * 60 * 1000,         // 6h
  PLACE_DETAIL: 12 * 60 * 60 * 1000,      // 12h
  PLACE_INTRO: 3 * 60 * 60 * 1000,        // 3h
  PET_TOUR: 6 * 60 * 60 * 1000,           // 6h
  IMAGES: 24 * 60 * 60 * 1000,            // 24h
};

// ----- Common Params -----
function getCommonParams(): URLSearchParams {
  const key = process.env.DATA_GO_KR_KEY;
  if (!key) throw new Error('DATA_GO_KR_KEY is not set');
  return new URLSearchParams({
    serviceKey: key,
    MobileOS: 'ETC',
    MobileApp: 'PetTripPlanner',
    _type: 'json',
  });
}

// ----- Generic API Call -----
async function callApi<T>(endpoint: string, params: URLSearchParams, cacheKey?: string, ttl?: number): Promise<T[]> {
  // Check cache
  if (cacheKey) {
    const cached = getCached<T[]>(cacheKey);
    if (cached) return cached;
  }

  const url = `${BASE_URL}/${endpoint}?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`API call failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const items = json?.response?.body?.items?.item;

  const result: T[] = Array.isArray(items) ? items : items ? [items] : [];

  // Store in cache
  if (cacheKey && ttl) {
    setCache(cacheKey, result, ttl);
  }

  return result;
}

// ===== Public API Methods =====

/** 지역코드 조회 */
export async function getAreaCodes(areaCode?: string) {
  const params = getCommonParams();
  if (areaCode) params.set('areaCode', areaCode);
  params.set('numOfRows', '50');

  const key = `areaCodes_${areaCode || 'all'}`;
  return callApi<{ code: string; name: string; rnum: number }>(
    'areaCode2', params, key, TTL.AREA_CODES
  );
}

/** 지역기반 관광정보 조회 */
export async function getAreaBasedList(options: {
  areaCode: string;
  sigunguCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
  arrange?: string;
}) {
  const params = getCommonParams();
  params.set('areaCode', options.areaCode);
  if (options.sigunguCode) params.set('sigunguCode', options.sigunguCode);
  if (options.contentTypeId) params.set('contentTypeId', options.contentTypeId);
  params.set('numOfRows', String(options.numOfRows || 100));
  params.set('pageNo', String(options.pageNo || 1));
  params.set('arrange', options.arrange || 'Q');

  const key = `areaList_${options.areaCode}_${options.sigunguCode || ''}_${options.contentTypeId || ''}_p${options.pageNo || 1}`;
  return callApi<{
    contentid: string;
    contenttypeid: string;
    title: string;
    addr1: string;
    addr2?: string;
    areacode: string;
    sigungucode?: string;
    mapx: string;
    mapy: string;
    tel?: string;
    firstimage?: string;
    firstimage2?: string;
    cat1?: string;
    cat2?: string;
    cat3?: string;
  }>('areaBasedList2', params, key, TTL.PLACE_LIST);
}

/** 위치기반 관광정보 조회 */
export async function getLocationBasedList(options: {
  mapX: string;
  mapY: string;
  radius?: string;
  contentTypeId?: string;
  numOfRows?: number;
  arrange?: string;
}) {
  const params = getCommonParams();
  params.set('mapX', options.mapX);
  params.set('mapY', options.mapY);
  params.set('radius', options.radius || '5000');
  if (options.contentTypeId) params.set('contentTypeId', options.contentTypeId);
  params.set('numOfRows', String(options.numOfRows || 20));
  params.set('arrange', options.arrange || 'E');

  return callApi<{
    contentid: string;
    contenttypeid: string;
    title: string;
    addr1: string;
    mapx: string;
    mapy: string;
    dist: string;
    firstimage?: string;
    tel?: string;
  }>('locationBasedList2', params);
}

/** 키워드 검색 */
export async function searchKeyword(options: {
  keyword: string;
  areaCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
}) {
  const params = getCommonParams();
  params.set('keyword', encodeURIComponent(options.keyword));
  if (options.areaCode) params.set('areaCode', options.areaCode);
  if (options.contentTypeId) params.set('contentTypeId', options.contentTypeId);
  params.set('numOfRows', String(options.numOfRows || 20));
  params.set('pageNo', String(options.pageNo || 1));

  return callApi<{
    contentid: string;
    contenttypeid: string;
    title: string;
    addr1: string;
    mapx: string;
    mapy: string;
    firstimage?: string;
    tel?: string;
  }>('searchKeyword2', params);
}

/** 공통정보 조회 */
export async function getDetailCommon(contentId: string) {
  const params = getCommonParams();
  params.set('contentId', contentId);
  params.set('defaultYN', 'Y');
  params.set('firstImageYN', 'Y');
  params.set('areacodeYN', 'Y');
  params.set('addrinfoYN', 'Y');
  params.set('mapinfoYN', 'Y');
  params.set('overviewYN', 'Y');

  const key = `detailCommon_${contentId}`;
  return callApi<{
    contentid: string;
    contenttypeid: string;
    title: string;
    addr1: string;
    addr2?: string;
    areacode: string;
    sigungucode?: string;
    mapx: string;
    mapy: string;
    overview?: string;
    firstimage?: string;
    firstimage2?: string;
    tel?: string;
    homepage?: string;
  }>('detailCommon2', params, key, TTL.PLACE_DETAIL);
}

/** 소개정보 조회 */
export async function getDetailIntro(contentId: string, contentTypeId: string) {
  const params = getCommonParams();
  params.set('contentId', contentId);
  params.set('contentTypeId', contentTypeId);

  const key = `detailIntro_${contentId}`;
  return callApi<Record<string, string>>('detailIntro2', params, key, TTL.PLACE_INTRO);
}

/** 반려동물 동반여행 정보 조회 */
export async function getDetailPetTour(contentId: string) {
  const params = getCommonParams();
  params.set('contentId', contentId);

  const key = `detailPetTour_${contentId}`;
  return callApi<{
    contentid: string;
    petturla?: string;
    relaAcdntRiskMtr?: string;
    acmpyTypeCd?: string;
    relaPosesFclty?: string;
    relaFrnshPrdlst?: string;
    etcAcmpyInfo?: string;
    relaPurcPrdlst?: string;
    acmpyPsblCpam?: string;
    acmpyNeedMtr?: string;
  }>('detailPetTour2', params, key, TTL.PET_TOUR);
}

/** 이미지 정보 조회 */
export async function getDetailImage(contentId: string) {
  const params = getCommonParams();
  params.set('contentId', contentId);
  params.set('imageYN', 'Y');

  const key = `detailImage_${contentId}`;
  return callApi<{
    contentid: string;
    originimgurl: string;
    smallimageurl: string;
    imgname?: string;
    serialnum: string;
  }>('detailImage2', params, key, TTL.IMAGES);
}
