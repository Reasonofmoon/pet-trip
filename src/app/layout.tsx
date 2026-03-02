import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetTrip Planner 🐾 | AI 반려동물 동반여행 코스 플래너",
  description:
    "반려동물과 함께하는 완벽한 여행 코스를 AI가 자동으로 설계해드립니다. 반려동물 크기별 맞춤 추천, 이동 동선 최적화, 휴무일 충돌 검사까지.",
  keywords: [
    "반려동물 여행",
    "펫 트립",
    "반려견 동반 여행",
    "AI 여행 플래너",
    "반려동물 동반 관광",
    "펫 프렌들리",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {/* ===== Header — clean, minimal, sunday.ai-inspired ===== */}
        <header
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
            padding: "8px 8px 8px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "auto",
            maxWidth: "calc(100% - 32px)",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "var(--color-text-primary)",
              marginRight: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>🐾</span>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
              PetTrip
            </span>
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="/plan/new" className="btn btn-ghost btn-sm">
              코스 만들기
            </a>
            <a href="/search" className="btn btn-ghost btn-sm">
              장소 검색
            </a>
            <a href="/plan/new" className="btn btn-primary btn-sm">
              여행 시작하기
            </a>
          </nav>
        </header>

        {/* Main */}
        <main style={{ paddingTop: 0, minHeight: "100vh" }}>{children}</main>

        {/* ===== Footer ===== */}
        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "48px 0 32px",
            background: "var(--color-bg)",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 32,
                marginBottom: 32,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>🐾</span>
                  <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>PetTrip Planner</span>
                </div>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  AI가 설계하는 반려동물 맞춤 여행 코스.
                  <br />
                  당신과 반려동물의 완벽한 여행을 시작하세요.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  서비스
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href="/plan/new" style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>AI 코스 생성</a>
                  <a href="/search" style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>장소 검색</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  데이터 출처
                </h4>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem", lineHeight: 1.7 }}>
                  한국관광공사<br />반려동물 동반여행 API
                </p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 16, textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
              © 2026 PetTrip Planner. Built with 🐾 & AI.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
