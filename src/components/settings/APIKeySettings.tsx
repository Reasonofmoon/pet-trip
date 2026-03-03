'use client';

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, Sparkles, ExternalLink } from 'lucide-react';

interface APIKeySettingsProps {
  onClose?: () => void;
}

export default function APIKeySettings({ onClose }: APIKeySettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pettrip_gemini_key') || '';
    setApiKey(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem('pettrip_gemini_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    localStorage.removeItem('pettrip_gemini_key');
    setApiKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      setTestResult(res.ok ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  const maskedKey = apiKey ? apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4) : '';

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      maxWidth: 520,
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      position: 'relative',
    }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
        >
          <X size={20} />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #4285f4, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>AI 설정</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Gemini API 키를 입력해 AI 코스를 활성화하세요
          </p>
        </div>
      </div>

      <div style={{
        background: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        margin: '20px 0',
        fontSize: '0.8125rem',
        color: '#1a56db',
        lineHeight: 1.6,
      }}>
        💡 <strong>무료 API 키 발급</strong>: Google AI Studio에서 Gemini API 키를 무료로 받을 수 있습니다.
        키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
        <br />
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: '#1a56db', fontWeight: 600, marginTop: 8,
          }}
        >
          Google AI Studio 바로가기 <ExternalLink size={12} />
        </a>
      </div>

      <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: 8 }}>
        <Key size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Gemini API Key
      </label>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={showKey ? apiKey : maskedKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setTestResult(null);
              setSaved(false);
            }}
            placeholder="AIza..."
            className="input"
            style={{ paddingRight: 40, fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={!apiKey.trim()} style={{ flex: 1 }}>
          {saved ? <><Check size={16} /> 저장됨!</> : '💾 저장'}
        </button>
        <button className="btn btn-secondary" onClick={handleTest} disabled={!apiKey.trim() || testing}>
          {testing ? '테스트 중...' : '🧪 테스트'}
        </button>
        {apiKey && (
          <button className="btn btn-ghost" onClick={handleDelete} style={{ color: '#ef4444' }}>
            삭제
          </button>
        )}
      </div>

      {testResult && (
        <div style={{
          padding: 12, borderRadius: 10,
          background: testResult === 'success' ? '#ecfdf5' : '#fef2f2',
          color: testResult === 'success' ? '#065f46' : '#991b1b',
          fontSize: '0.8125rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {testResult === 'success' ? (
            <><Check size={16} /> API 키가 정상적으로 작동합니다! AI 코스 추천이 활성화됩니다.</>
          ) : (
            <><X size={16} /> API 키가 유효하지 않습니다. 확인 후 다시 시도해주세요.</>
          )}
        </div>
      )}
    </div>
  );
}
