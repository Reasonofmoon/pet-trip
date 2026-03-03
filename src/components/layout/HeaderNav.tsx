'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import APIKeySettings from '@/components/settings/APIKeySettings';

export default function HeaderNav() {
  const [showSettings, setShowSettings] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('pettrip_gemini_key');
    setHasKey(!!key);
    // Listen for storage changes
    const handler = () => setHasKey(!!localStorage.getItem('pettrip_gemini_key'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Re-check after settings close
  useEffect(() => {
    if (!showSettings) {
      setHasKey(!!localStorage.getItem('pettrip_gemini_key'));
    }
  }, [showSettings]);

  return (
    <>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <a href="/plan/new" className="btn btn-ghost btn-sm">
          코스 만들기
        </a>
        <a href="/search" className="btn btn-ghost btn-sm">
          장소 검색
        </a>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowSettings(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          title="AI 설정"
        >
          <Sparkles size={14} />
          <span style={{
            fontSize: '0.6875rem',
            padding: '1px 6px',
            borderRadius: 8,
            fontWeight: 600,
            background: hasKey ? '#ecfdf5' : '#fef3c7',
            color: hasKey ? '#065f46' : '#92400e',
          }}>
            {hasKey ? 'AI ON' : 'AI OFF'}
          </span>
        </button>
        <a href="/plan/new" className="btn btn-primary btn-sm">
          여행 시작하기
        </a>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}
        >
          <APIKeySettings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </>
  );
}
