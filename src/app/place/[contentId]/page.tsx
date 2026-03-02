'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin, Clock, Phone, ParkingCircle, PawPrint,
  ArrowLeft, Globe, Calendar, AlertTriangle, Star, ExternalLink,
} from 'lucide-react';
import { MOCK_JEJU_PLACES } from '@/lib/mock-data';
import { Place, CONTENT_TYPE_MAP } from '@/types';

interface PlaceFullDetail {
  place: Place;
  petPolicy: {
    acmpyPsblCpam?: string;
    acmpyNeedMtr?: string;
    etcAcmpyInfo?: string;
    relaPosesFclty?: string;
    relaFrnshPrdlst?: string;
  } | null;
  intro: {
    restDate?: string;
    useTime?: string;
    parking?: string;
    openPeriod?: string;
  } | null;
  images: { originImgUrl: string; smallImageUrl: string }[];
}

export default function PlaceDetailPage() {
  const params = useParams();
  const contentId = params.contentId as string;
  const [detail, setDetail] = useState<PlaceFullDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/places/${contentId}`);
        if (res.ok) {
          const data = await res.json();
          setDetail(data);
        } else {
          throw new Error('API failed');
        }
      } catch {
        // Mock fallback
        const mockPlace = MOCK_JEJU_PLACES.find((p) => p.contentId === contentId) || MOCK_JEJU_PLACES[0];
        setDetail({
          place: mockPlace,
          petPolicy: {
            acmpyPsblCpam: '소형견, 중형견, 대형견 모두 가능',
            acmpyNeedMtr: '목줄, 배변봉투 필수 지참',
            etcAcmpyInfo: '야외 테라스 이용 시 반려동물 동반 가능. 실내 입장은 소형견만 허용.',
            relaPosesFclty: '반려동물 전용 급수대, 배변처리 시설',
            relaFrnshPrdlst: '반려동물 물그릇, 간식 구매 가능',
          },
          intro: {
            restDate: '매주 화요일',
            useTime: '09:00 ~ 18:00',
            parking: '무료 주차 가능 (50대)',
            openPeriod: '연중무휴 (휴무일 제외)',
          },
          images: [
            { originImgUrl: mockPlace.firstImage || '', smallImageUrl: mockPlace.firstImage || '' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [contentId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!detail) return null;

  const { place, petPolicy, intro, images } = detail;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 64 }}>
      {/* Hero Image */}
      <div
        style={{
          height: 360,
          background: images.length > 0 && images[0].originImgUrl
            ? `url(${images[activeImage]?.originImgUrl || images[0].originImgUrl}) center/cover`
            : 'var(--gradient-card)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 40%, rgba(12,14,20,0.9))',
          }}
        />
        <div
          className="container"
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px var(--space-lg)',
          }}
        >
          <a href="/search" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <ArrowLeft size={16} /> 뒤로
          </a>

          <div>
            <span className="badge badge-accent" style={{ marginBottom: 8 }}>
              {CONTENT_TYPE_MAP[place.contentTypeId] || '관광'}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
              {place.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              <MapPin size={16} /> {place.addr1}
            </div>
          </div>
        </div>
      </div>

      {/* Image thumbnails */}
      {images.length > 1 && (
        <div className="container" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  borderRadius: 'var(--radius-sm)',
                  background: `url(${img.smallImageUrl || img.originImgUrl}) center/cover`,
                  border: i === activeImage ? '2px solid var(--color-accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="container" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Main Content */}
          <div>
            {/* Overview */}
            {place.overview && (
              <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 12 }}>
                  소개
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  {place.overview}
                </p>
              </div>
            )}

            {/* Pet Policy — Key Info */}
            {petPolicy && (
              <div
                className="glass-card"
                style={{
                  padding: 24,
                  marginBottom: 20,
                  borderColor: 'rgba(20, 184, 166, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'var(--color-secondary)',
                  }}
                />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PawPrint size={20} style={{ color: 'var(--color-secondary)' }} />
                  반려동물 동반 정보
                </h2>

                <div style={{ display: 'grid', gap: 16 }}>
                  {petPolicy.acmpyPsblCpam && (
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-secondary-light)', marginBottom: 4 }}>
                        동반 가능 동물
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                        {petPolicy.acmpyPsblCpam}
                      </div>
                    </div>
                  )}
                  {petPolicy.acmpyNeedMtr && (
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent-light)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={14} /> 필수 준비물
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                        {petPolicy.acmpyNeedMtr}
                      </div>
                    </div>
                  )}
                  {petPolicy.etcAcmpyInfo && (
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        기타 안내
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                        {petPolicy.etcAcmpyInfo}
                      </div>
                    </div>
                  )}
                  {petPolicy.relaPosesFclty && (
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        편의시설
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                        {petPolicy.relaPosesFclty}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Operation Info */}
            {intro && (
              <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>
                  운영 정보
                </h3>
                <div style={{ display: 'grid', gap: 14 }}>
                  {intro.useTime && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem' }}>
                      <Clock size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>이용시간</div>
                        <div style={{ color: 'var(--color-text-secondary)' }}>{intro.useTime}</div>
                      </div>
                    </div>
                  )}
                  {intro.restDate && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem' }}>
                      <Calendar size={16} style={{ color: 'var(--color-tertiary)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>휴무일</div>
                        <div style={{ color: 'var(--color-text-secondary)' }}>{intro.restDate}</div>
                      </div>
                    </div>
                  )}
                  {intro.parking && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem' }}>
                      <ParkingCircle size={16} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>주차</div>
                        <div style={{ color: 'var(--color-text-secondary)' }}>{intro.parking}</div>
                      </div>
                    </div>
                  )}
                  {place.tel && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem' }}>
                      <Phone size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>연락처</div>
                        <div style={{ color: 'var(--color-text-secondary)' }}>{place.tel}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="glass-card" style={{ padding: 20 }}>
              <a href="/plan/new" className="btn btn-primary" style={{ width: '100%', marginBottom: 8 }}>
                <PawPrint size={18} />
                이 장소로 코스 만들기
              </a>
              <button className="btn btn-secondary" style={{ width: '100%' }}>
                <Star size={18} />
                즐겨찾기 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
