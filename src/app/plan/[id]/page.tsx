'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  MapPin, Clock, PawPrint, Navigation, ChevronRight,
  Calendar, Star, Route, ArrowLeft, Share2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TripPlan, CourseSpot } from '@/types';
import { generateMockCourse } from '@/lib/mock-data';
import { CATEGORY_ICONS } from '@/lib/mock-data';

// Dynamic import - Leaflet must be client-only
const CourseMap = dynamic(() => import('@/components/map/CourseMap'), { ssr: false });

const TIME_COLORS: Record<string, string> = {
  morning: 'var(--route-morning)',
  afternoon: 'var(--route-afternoon)',
  evening: 'var(--route-evening)',
};

function getTimeOfDay(time: string): 'morning' | 'afternoon' | 'evening' {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function PlanResultPage() {
  const params = useParams();
  const { currentTrip, selectedDay, setSelectedDay } = useAppStore();
  const [trip, setTrip] = useState<TripPlan | null>(currentTrip);
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  useEffect(() => {
    // If no trip data in store, generate mock
    if (!trip) {
      const mockTrip = generateMockCourse('39', '2026-04-10', '2026-04-12', 'medium');
      setTrip(mockTrip);
    }
  }, [trip]);

  if (!trip) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const currentDay = trip.days.find((d) => d.dayNumber === selectedDay) || trip.days[0];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header Bar */}
      <div
        style={{
          background: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
          padding: '16px 0',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/plan/new" className="btn btn-ghost btn-icon" style={{ width: 36, height: 36 }}>
              <ArrowLeft size={18} />
            </a>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{trip.title}</h1>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} /> {trip.days.length}일 코스
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Route size={14} /> {trip.summary.totalSpots}곳
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={14} style={{ color: 'var(--color-accent)' }} /> {trip.summary.petFriendlyScore}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">
            <Share2 size={16} />
            공유
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div
        style={{
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '12px 0',
          position: 'sticky',
          top: 64,
          zIndex: 50,
        }}
      >
        <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {trip.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              style={{
                flexShrink: 0,
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                transition: 'all var(--transition-base)',
                background: selectedDay === day.dayNumber ? 'var(--gradient-hero)' : 'var(--color-bg-card)',
                color: selectedDay === day.dayNumber ? 'white' : 'var(--color-text-secondary)',
              }}
            >
              <div>Day {day.dayNumber}</div>
              <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: 2 }}>
                {day.theme}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Map + Timeline */}
      <div className="container" style={{ padding: '24px var(--space-lg)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: 24,
            minHeight: 'calc(100vh - 220px)',
          }}
        >
          {/* Map */}
          <div
            className="glass-card"
            style={{ overflow: 'hidden', height: 'calc(100vh - 220px)', position: 'sticky', top: 140 }}
          >
            <CourseMap
              spots={currentDay.spots}
              activeSpot={activeSpot}
              onSpotClick={setActiveSpot}
            />
          </div>

          {/* Timeline */}
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingRight: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                <Calendar size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                {currentDay.date} · {currentDay.theme}
              </h2>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Timeline vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: 19,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'var(--color-border)',
                }}
              />

              {currentDay.spots.map((spot, idx) => (
                <div key={`${spot.contentId}-${idx}`}>
                  {/* Spot Card */}
                  <div
                    className="animate-fade-in"
                    style={{
                      display: 'flex',
                      gap: 16,
                      marginBottom: spot.travelTimeToNext > 0 ? 8 : 20,
                      animationDelay: `${idx * 80}ms`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveSpot(spot.contentId)}
                  >
                    {/* Timeline dot */}
                    <div style={{ position: 'relative', flexShrink: 0, width: 40, display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: TIME_COLORS[getTimeOfDay(spot.arrivalTime)],
                          border: activeSpot === spot.contentId ? '3px solid white' : '2px solid var(--color-bg)',
                          boxShadow: activeSpot === spot.contentId ? `0 0 12px ${TIME_COLORS[getTimeOfDay(spot.arrivalTime)]}` : 'none',
                          transition: 'all var(--transition-base)',
                          marginTop: 4,
                        }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className="glass-card"
                      style={{
                        flex: 1,
                        padding: 16,
                        borderColor: activeSpot === spot.contentId ? 'var(--color-accent)' : undefined,
                        background: activeSpot === spot.contentId ? 'var(--color-accent-subtle)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: '0.75rem', color: TIME_COLORS[getTimeOfDay(spot.arrivalTime)], fontWeight: 600 }}>
                              {spot.arrivalTime}
                            </span>
                            <span className="badge badge-accent" style={{ fontSize: '0.6875rem' }}>
                              {CATEGORY_ICONS[spot.category] || '📍'} {spot.category}
                            </span>
                          </div>
                          <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{spot.title}</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {spot.duration}분
                        </span>
                      </div>

                      {spot.addr && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {spot.addr}
                        </div>
                      )}

                      {/* Pet Policy Badge */}
                      {spot.petPolicy && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>
                            🐾 {spot.petPolicy.sizeAllowed}
                          </span>
                          {spot.petPolicy.leashRequired && (
                            <span className="badge badge-tertiary" style={{ fontSize: '0.6875rem' }}>
                              🦮 목줄 필수
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel time between spots */}
                  {spot.travelTimeToNext > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 8,
                        paddingLeft: 40,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 12px',
                          background: 'var(--color-surface)',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        <Navigation size={12} />
                        이동 {spot.travelTimeToNext}분
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
