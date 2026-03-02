'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  PawPrint,
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  TreePine,
  Coffee,
  UtensilsCrossed,
  Waves,
  Palette,
  ShoppingBag,
  Target,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_AREAS, AREA_EMOJI } from '@/lib/mock-data';
import { PetSize, PetTemperament } from '@/types';

const STEPS = [
  { num: 1, label: '여행지', icon: <MapPin size={18} /> },
  { num: 2, label: '일정', icon: <Calendar size={18} /> },
  { num: 3, label: '반려동물', icon: <PawPrint size={18} /> },
  { num: 4, label: '선호도', icon: <Settings size={18} /> },
];

const PET_SIZES: { value: PetSize; label: string; emoji: string; desc: string }[] = [
  { value: 'small', label: '소형', emoji: '🐶', desc: '5kg 미만' },
  { value: 'medium', label: '중형', emoji: '🐕', desc: '5~15kg' },
  { value: 'large', label: '대형', emoji: '🦮', desc: '15kg 이상' },
];

const TEMPERAMENTS: { value: PetTemperament; label: string; desc: string }[] = [
  { value: 'calm', label: '차분함', desc: '새로운 환경에 편안함' },
  { value: 'active', label: '활발함', desc: '에너지가 넘치고 탐험적' },
  { value: 'anxious', label: '예민함', desc: '낯선 환경에 긴장함' },
];

const CATEGORIES = [
  { id: 'nature', label: '자연/산책', icon: <TreePine size={20} /> },
  { id: 'cafe', label: '카페', icon: <Coffee size={20} /> },
  { id: 'restaurant', label: '맛집', icon: <UtensilsCrossed size={20} /> },
  { id: 'beach', label: '해변', icon: <Waves size={20} /> },
  { id: 'culture', label: '문화/체험', icon: <Palette size={20} /> },
  { id: 'shopping', label: '쇼핑', icon: <ShoppingBag size={20} /> },
  { id: 'activity', label: '액티비티', icon: <Target size={20} /> },
];

const BREEDS = [
  '골든리트리버', '푸들', '비숑프리제', '말티즈', '시바이누',
  '웰시코기', '보더콜리', '라브라도레트리버', '포메라니안', '치와와',
  '프렌치불독', '시추', '비글', '허스키', '기타',
];

export default function PlanNewPage() {
  const router = useRouter();
  const {
    wizard, setWizardStep, setDestination, setDates,
    setPet, setPreferences, setIsGenerating, isGenerating,
    setCurrentTrip,
  } = useAppStore();

  const [localBreed, setLocalBreed] = useState(wizard.pet.breed);
  const [localCategories, setLocalCategories] = useState<string[]>(wizard.preferences.categories);

  const step = wizard.step;

  const canNext = useCallback(() => {
    switch (step) {
      case 1: return !!wizard.destination.areaCode;
      case 2: return !!wizard.dates.startDate && !!wizard.dates.endDate;
      case 3: return !!wizard.pet.size;
      case 4: return localCategories.length > 0;
      default: return false;
    }
  }, [step, wizard, localCategories]);

  const handleNext = () => {
    if (step === 3) {
      setPet(wizard.pet.size, localBreed, wizard.pet.temperament);
    }
    if (step === 4) {
      setPreferences(localCategories, wizard.preferences.pace, wizard.preferences.budgetLevel);
    }
    if (step < 4) {
      setWizardStep(step + 1);
    }
  };

  const handleGenerate = async () => {
    setPreferences(localCategories, wizard.preferences.pace, wizard.preferences.budgetLevel);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/course/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: wizard.destination,
          dates: wizard.dates,
          pet: { ...wizard.pet, breed: localBreed },
          preferences: { ...wizard.preferences, categories: localCategories },
        }),
      });

      const data = await res.json();
      setCurrentTrip(data);
      router.push(`/plan/${data.tripId}`);
    } catch (err) {
      console.error('Failed to generate course:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCategory = (id: string) => {
    setLocalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            🐾 여행 코스 만들기
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            AI가 반려동물 맞춤 여행 코스를 설계합니다
          </p>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 40,
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => s.num < step && setWizardStep(s.num)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: s.num <= step ? 'pointer' : 'default',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  transition: 'all var(--transition-base)',
                  background:
                    s.num === step
                      ? 'var(--color-accent)'
                      : s.num < step
                      ? 'var(--color-accent-subtle)'
                      : 'var(--color-bg-card)',
                  color:
                    s.num === step
                      ? 'var(--color-text-primary)'
                      : s.num < step
                      ? 'var(--color-accent-dark)'
                      : 'var(--color-text-muted)',
                }}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  size={16}
                  style={{ margin: '0 4px', color: 'var(--color-text-muted)', opacity: 0.4 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div
          className="glass-card animate-fade-in"
          key={step}
          style={{ padding: 32, marginBottom: 24 }}
        >
          {/* Step 1: Destination */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
                어디로 떠나시나요?
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 24,
                }}
              >
                반려동물과 함께 여행할 지역을 선택해주세요
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 12,
                }}
              >
                {MOCK_AREAS.map((area) => (
                  <button
                    key={area.code}
                    onClick={() => setDestination(area.code, area.name)}
                    style={{
                      padding: 20,
                      borderRadius: 'var(--radius-md)',
                      border:
                        wizard.destination.areaCode === area.code
                          ? '2px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                      background:
                        wizard.destination.areaCode === area.code
                          ? 'var(--color-accent-subtle)'
                          : 'var(--color-bg-secondary)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all var(--transition-base)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>
                      {AREA_EMOJI[area.code] || '📍'}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        color:
                          wizard.destination.areaCode === area.code
                            ? 'var(--color-accent-light)'
                            : 'var(--color-text-primary)',
                      }}
                    >
                      {area.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
                여행 일정을 선택하세요
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 24,
                }}
              >
                최대 7박 8일까지 설정 가능합니다
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.875rem',
                      color: 'var(--color-text-primary)',
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={16} style={{ color: 'var(--color-secondary)' }} />
                    출발일
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={wizard.dates.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDates(e.target.value, wizard.dates.endDate || e.target.value)}
                    style={{
                      padding: '14px 16px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      border: wizard.dates.startDate ? '2px solid var(--color-secondary)' : '1.5px solid var(--color-border)',
                      background: wizard.dates.startDate ? 'var(--color-secondary-glow)' : 'var(--color-bg-card)',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.875rem',
                      color: 'var(--color-text-primary)',
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={16} style={{ color: 'var(--color-tertiary)' }} />
                    도착일
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={wizard.dates.endDate}
                    min={wizard.dates.startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDates(wizard.dates.startDate, e.target.value)}
                    style={{
                      padding: '14px 16px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      border: wizard.dates.endDate ? '2px solid var(--color-tertiary)' : '1.5px solid var(--color-border)',
                      background: wizard.dates.endDate ? 'var(--color-tertiary-glow)' : 'var(--color-bg-card)',
                    }}
                  />
                </div>
              </div>
              {wizard.dates.startDate && wizard.dates.endDate && (
                <div
                  className="badge badge-accent"
                  style={{ marginTop: 16 }}
                >
                  📅{' '}
                  {Math.ceil(
                    (new Date(wizard.dates.endDate).getTime() -
                      new Date(wizard.dates.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                  박{' '}
                  {Math.ceil(
                    (new Date(wizard.dates.endDate).getTime() -
                      new Date(wizard.dates.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}
                  일 여행
                </div>
              )}
            </div>
          )}

          {/* Step 3: Pet Info */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
                반려동물 정보를 알려주세요
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 24,
                }}
              >
                반려동물 크기에 따라 입장 가능 여부가 달라집니다
              </p>

              {/* Size */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: 12,
                    display: 'block',
                  }}
                >
                  반려동물 크기
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {PET_SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setPet(s.value, localBreed, wizard.pet.temperament)}
                      style={{
                        padding: 20,
                        borderRadius: 'var(--radius-md)',
                        border:
                          wizard.pet.size === s.value
                            ? '2px solid var(--color-accent)'
                            : '1px solid var(--color-border)',
                        background:
                          wizard.pet.size === s.value
                            ? 'var(--color-accent-subtle)'
                            : 'var(--color-bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-base)',
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
                      <div
                        style={{
                          fontWeight: 600,
                          color:
                            wizard.pet.size === s.value
                              ? 'var(--color-accent-light)'
                              : 'var(--color-text-primary)',
                        }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Breed */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: 8,
                    display: 'block',
                  }}
                >
                  견종 (선택)
                </label>
                <select
                  className="input"
                  value={localBreed}
                  onChange={(e) => setLocalBreed(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {BREEDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Temperament */}
              <div>
                <label
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: 12,
                    display: 'block',
                  }}
                >
                  성격
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {TEMPERAMENTS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setPet(wizard.pet.size, localBreed, t.value)}
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border:
                          wizard.pet.temperament === t.value
                            ? '2px solid var(--color-secondary)'
                            : '1px solid var(--color-border)',
                        background:
                          wizard.pet.temperament === t.value
                            ? 'var(--color-secondary-glow)'
                            : 'var(--color-bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-base)',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color:
                            wizard.pet.temperament === t.value
                              ? 'var(--color-secondary-light)'
                              : 'var(--color-text-primary)',
                        }}
                      >
                        {t.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
                여행 취향을 설정하세요
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 24,
                }}
              >
                선호하는 카테고리를 선택하면 AI가 맞춤 코스를 구성합니다
              </p>

              {/* Categories */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, display: 'block' }}>
                  선호 카테고리 (복수 선택)
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 10,
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCategory(c.id)}
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: localCategories.includes(c.id)
                          ? '2px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                        background: localCategories.includes(c.id)
                          ? 'var(--color-accent-subtle)'
                          : 'var(--color-bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-base)',
                        color: localCategories.includes(c.id)
                          ? 'var(--color-accent-light)'
                          : 'var(--color-text-primary)',
                      }}
                    >
                      {c.icon}
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8, display: 'block' }}>
                  여행 페이스
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { value: 'relaxed' as const, label: '여유롭게', emoji: '🧘' },
                    { value: 'moderate' as const, label: '보통', emoji: '🚶' },
                    { value: 'active' as const, label: '알차게', emoji: '🏃' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPreferences(localCategories, p.value, wizard.preferences.budgetLevel)}
                      style={{
                        padding: 14,
                        borderRadius: 'var(--radius-md)',
                        border: wizard.preferences.pace === p.value ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                        background: wizard.preferences.pace === p.value ? 'var(--color-secondary-glow)' : 'var(--color-bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-base)',
                        color: wizard.preferences.pace === p.value ? 'var(--color-secondary-light)' : 'var(--color-text-primary)',
                      }}
                    >
                      <div style={{ fontSize: 24 }}>{p.emoji}</div>
                      <div style={{ fontWeight: 500, fontSize: '0.8125rem', marginTop: 4 }}>{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8, display: 'block' }}>
                  예산 수준
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { value: 'low' as const, label: '절약', emoji: '💰' },
                    { value: 'medium' as const, label: '보통', emoji: '💰💰' },
                    { value: 'high' as const, label: '여유', emoji: '💰💰💰' },
                  ].map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setPreferences(localCategories, wizard.preferences.pace, b.value)}
                      style={{
                        padding: 14,
                        borderRadius: 'var(--radius-md)',
                        border: wizard.preferences.budgetLevel === b.value ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                        background: wizard.preferences.budgetLevel === b.value ? 'var(--color-accent-subtle)' : 'var(--color-bg-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all var(--transition-base)',
                        color: wizard.preferences.budgetLevel === b.value ? 'var(--color-accent-light)' : 'var(--color-text-primary)',
                      }}
                    >
                      <div style={{ fontSize: 20 }}>{b.emoji}</div>
                      <div style={{ fontWeight: 500, fontSize: '0.8125rem', marginTop: 4 }}>{b.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={() => setWizardStep(step - 1)}>
              <ChevronLeft size={18} />
              이전
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canNext()}
              style={{ opacity: canNext() ? 1 : 0.5 }}
            >
              다음
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg animate-pulse-glow"
              onClick={handleGenerate}
              disabled={!canNext() || isGenerating}
              style={{ opacity: canNext() && !isGenerating ? 1 : 0.5 }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  AI 코스 생성 중...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  AI 코스 생성하기
                </>
              )}
            </button>
          )}
        </div>

        {/* Summary Preview */}
        {(wizard.destination.areaName || wizard.dates.startDate) && (
          <div
            className="glass-card"
            style={{
              padding: 20,
              marginTop: 24,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
            }}
          >
            {wizard.destination.areaName && (
              <span className="badge badge-accent">
                📍 {wizard.destination.areaName}
              </span>
            )}
            {wizard.dates.startDate && (
              <span className="badge badge-secondary">
                📅 {wizard.dates.startDate} ~ {wizard.dates.endDate}
              </span>
            )}
            {wizard.pet.size && (
              <span className="badge badge-tertiary">
                🐾 {PET_SIZES.find((s) => s.value === wizard.pet.size)?.label}견
                {localBreed && ` · ${localBreed}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
