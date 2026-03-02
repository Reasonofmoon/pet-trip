'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, PawPrint, Loader2 } from 'lucide-react';
import { MOCK_AREAS, MOCK_JEJU_PLACES, AREA_EMOJI } from '@/lib/mock-data';
import { Place, CONTENT_TYPE_MAP } from '@/types';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [contentTypeId, setContentTypeId] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim() && !areaCode) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (areaCode) params.set('areaCode', areaCode);
      if (contentTypeId) params.set('contentTypeId', contentTypeId);

      const res = await fetch(`/api/places/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      console.error('Search failed:', err);
      // Fallback to mock
      const filtered = MOCK_JEJU_PLACES.filter((p) => {
        if (keyword && !p.title.includes(keyword)) return false;
        if (areaCode && p.areaCode !== areaCode) return false;
        return true;
      });
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            🔍 반려동물 동반 장소 검색
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            반려동물과 함께 갈 수 있는 관광지, 숙박, 식당을 찾아보세요
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                className="input"
                placeholder="장소명, 키워드 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ paddingLeft: 42 }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
              검색
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select
              className="input"
              style={{ width: 'auto', minWidth: 140 }}
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            >
              <option value="">전체 지역</option>
              {MOCK_AREAS.map((a) => (
                <option key={a.code} value={a.code}>
                  {AREA_EMOJI[a.code]} {a.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              style={{ width: 'auto', minWidth: 140 }}
              value={contentTypeId}
              onChange={(e) => setContentTypeId(e.target.value)}
            >
              <option value="">전체 유형</option>
              {Object.entries(CONTENT_TYPE_MAP).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>

            {(areaCode || contentTypeId) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setAreaCode('');
                  setContentTypeId('');
                }}
              >
                <X size={14} /> 필터 초기화
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 64,
              color: 'var(--color-text-muted)',
            }}
          >
            <PawPrint size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 8 }}>
              검색 결과가 없습니다
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              다른 키워드나 지역으로 검색해보세요
            </div>
          </div>
        ) : (
          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {results.map((place) => (
              <a
                key={place.contentId}
                href={`/place/${place.contentId}`}
                className="glass-card"
                style={{ textDecoration: 'none', color: 'var(--color-text-primary)', overflow: 'hidden' }}
              >
                {/* Image */}
                <div
                  style={{
                    height: 180,
                    background: place.firstImage
                      ? `url(${place.firstImage}) center/cover`
                      : 'var(--gradient-card)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 12,
                  }}
                >
                  <span className="badge badge-accent">
                    {CONTENT_TYPE_MAP[place.contentTypeId] || '관광'}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6 }}>
                    {place.title}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <MapPin size={12} />
                    {place.addr1}
                  </div>
                  {place.tel && (
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        marginTop: 4,
                      }}
                    >
                      📞 {place.tel}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>
                      🐾 반려동물 동반
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Quick Links if not searched */}
        {!hasSearched && (
          <div>
            <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                인기 지역으로 빠르게 검색
              </h3>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {['39', '32', '6', '38', '36'].map((code) => {
                const area = MOCK_AREAS.find((a) => a.code === code);
                return (
                  <button
                    key={code}
                    className="btn btn-secondary"
                    onClick={() => {
                      setAreaCode(code);
                      setKeyword('');
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    {AREA_EMOJI[code]} {area?.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
