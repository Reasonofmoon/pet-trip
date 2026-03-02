'use client';

import { MapPin, Sparkles, PawPrint, Clock, ArrowRight, Shield } from 'lucide-react';
import { MOCK_AREAS, AREA_EMOJI } from '@/lib/mock-data';

const FEATURES = [
  {
    icon: <Sparkles size={24} />,
    title: 'AI 코스 자동 설계',
    desc: '여행지, 일정, 반려동물 정보만 입력하면 AI가 최적의 여행 코스를 자동으로 생성합니다.',
    color: '#F5C518',
    bg: '#FFF8E1',
    image: '/images/hero-dog-car.png',
  },
  {
    icon: <PawPrint size={24} />,
    title: '반려동물 맞춤 필터',
    desc: '대형견, 소형견 등 크기별 입장 가능 여부와 동반 조건을 사전에 확인합니다.',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.06)',
    image: '/images/pet-cafe.png',
  },
  {
    icon: <Clock size={24} />,
    title: '실시간 운영 정보',
    desc: '휴무일, 운영시간 충돌을 자동 감지하고 대체 장소를 추천합니다.',
    color: '#2D9F93',
    bg: 'rgba(45,159,147,0.06)',
    image: '/images/pet-beach.png',
  },
];

const POPULAR = ['39', '32', '6', '38', '36', '35'];

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO — sunday.ai inspired: massive centered text + full-width rounded image ===== */}
      <section style={{ padding: '140px 0 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Small badge */}
          <div className="badge badge-dark animate-fade-in" style={{ marginBottom: 24, fontSize: '0.8125rem' }}>
            🐾 AI 반려동물 동반여행 플래너
          </div>

          {/* Massive heading — sunday.ai style */}
          <h1
            className="display-heading animate-slide-up"
            style={{ marginBottom: 24 }}
          >
            반려동물과 함께,
            <br />
            <span style={{ color: 'var(--color-secondary)' }}>완벽한 여행</span>
          </h1>

          <p
            className="animate-fade-in"
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 540,
              margin: '0 auto 40px',
              lineHeight: 1.7,
              animationDelay: '200ms',
            }}
          >
            여행지와 반려동물 정보만 입력하세요.
            <br />
            AI가 동선, 휴무일, 반려동물 정책까지 고려한
            <br />
            최적의 코스를 설계합니다.
          </p>

          {/* CTA buttons — pill style */}
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              animationDelay: '300ms',
            }}
          >
            <a href="/plan/new" className="btn btn-primary btn-lg animate-pulse-glow">
              여행 코스 만들기
              <ArrowRight size={18} />
            </a>
            <a href="/search" className="btn btn-secondary btn-lg">
              장소 둘러보기
            </a>
          </div>
        </div>

        {/* Hero Image — sunday.ai style: big rounded container */}
        <div
          className="container animate-scale-in"
          style={{ marginTop: 64, animationDelay: '400ms' }}
        >
          <div
            className="hero-image-container"
            style={{
              height: 520,
              background: `url(/images/hero-dog-car.png) center/cover`,
              position: 'relative',
            }}
          >
            {/* Overlay with subtle gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.3))',
                borderRadius: 'inherit',
              }}
            />

            {/* Floating stats bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 32,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                padding: '16px 40px',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {[
                { value: '13', label: 'API 엔드포인트' },
                { value: '17', label: '시/도 지역' },
                { value: '24/7', label: 'AI 코스 생성' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Description Text — sunday.ai style: big paragraph ===== */}
      <section style={{ padding: '96px 0 48px' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              lineHeight: 1.6,
              color: 'var(--color-text-primary)',
              fontWeight: 500,
            }}
          >
            반려동물 1,500만 가구 시대. 단순한 장소 검색을 넘어,
            <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}> AI가 설계하는 맞춤 여행 코스</span>로
            반려동물과 함께하는 여행의 새로운 기준을 만듭니다.
          </p>
        </div>
      </section>

      {/* ===== Features with Images — 2-column cards ===== */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>핵심 기능</span>
            <h2 className="section-heading">
              왜 PetTrip Planner인가요?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className="glass-card animate-fade-in"
                style={{
                  display: 'grid',
                  gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                  minHeight: 380,
                  overflow: 'hidden',
                  animationDelay: `${idx * 150}ms`,
                }}
              >
                {/* Image side */}
                <div
                  style={{
                    order: idx % 2 === 0 ? 1 : 2,
                    background: `url(${f.image}) center/cover`,
                    minHeight: 300,
                  }}
                />

                {/* Content side */}
                <div
                  style={{
                    order: idx % 2 === 0 ? 2 : 1,
                    padding: '48px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: f.bg,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                      marginBottom: 20,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>
                    {f.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Popular Destinations — card grid ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-secondary" style={{ marginBottom: 16 }}>인기 여행지</span>
            <h2 className="section-heading" style={{ marginBottom: 16 }}>
              반려동물과 떠나기 좋은 곳
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
              AI가 추천하는 인기 반려동물 동반 여행 지역
            </p>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 16,
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            {POPULAR.map((code) => {
              const area = MOCK_AREAS.find((a) => a.code === code);
              if (!area) return null;
              return (
                <a
                  key={code}
                  href={`/plan/new?area=${code}`}
                  className="glass-card"
                  style={{
                    padding: '28px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>
                    {AREA_EMOJI[code] || '📍'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{area.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    반려동물 동반
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== How it Works — 3 steps ===== */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge badge-tertiary" style={{ marginBottom: 16 }}>이용 방법</span>
            <h2 className="section-heading">
              3단계로 완성하는 여행 코스
            </h2>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 32,
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {[
              { step: '01', icon: <MapPin size={28} />, title: '여행 조건 입력', desc: '여행지, 일정, 반려동물 정보, 선호 카테고리를 입력합니다.' },
              { step: '02', icon: <Sparkles size={28} />, title: 'AI 코스 생성', desc: 'AI가 반려동물 정책, 동선, 휴무일을 고려한 최적 코스를 설계합니다.' },
              { step: '03', icon: <PawPrint size={28} />, title: '코스 확인 & 출발', desc: '지도와 타임라인으로 코스를 확인하고, 여행을 시작하세요!' },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-card"
                style={{ padding: 36, textAlign: 'center', position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    fontSize: '3rem',
                    fontWeight: 900,
                    color: 'rgba(0,0,0,0.04)',
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-accent-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--color-accent-dark)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="/plan/new" className="btn btn-primary btn-lg">
              지금 바로 시작하기
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ===== Trust Section ===== */}
      <section style={{ padding: '48px 0' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
          }}
        >
          <Shield size={16} />
          <span>데이터 출처: 한국관광공사 반려동물 동반여행 서비스 API</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>공공데이터 인증 기반</span>
        </div>
      </section>
    </div>
  );
}
