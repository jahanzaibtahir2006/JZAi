// components/DashboardSkeleton.tsx
// Tumhare dashboard ka exact layout replicate karta hai loading pe
// CSS variables same hain jo dashboard/page.tsx use karta hai

export default function DashboardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .sk {
          background: linear-gradient(
            90deg,
            var(--bg2) 25%,
            var(--bg3) 50%,
            var(--bg2) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ── SIDEBAR SKELETON ── */}
        <div style={{
          width: 260, flexShrink: 0,
          background: "var(--card-bg)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          padding: "28px 24px", gap: 16,
        }}>
          {/* Logo */}
          <div className="sk" style={{ height: 28, width: 72, marginBottom: 8 }} />

          {/* User block */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 0", borderBottom: "1px solid var(--border)",
          }}>
            <div className="sk" style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
              <div className="sk" style={{ height: 13, width: "70%" }} />
              <div className="sk" style={{ height: 10, width: "50%" }} />
            </div>
          </div>

          {/* Nav items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {/* Active nav item — red tint like .db-nav-item.active */}
            <div style={{
              height: 40, borderRadius: 8,
              background: "var(--red-dim)",
              border: "1px solid rgba(232,25,60,0.2)",
            }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="sk" style={{ height: 40, borderRadius: 8 }} />
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
            <div className="sk" style={{ height: 40, borderRadius: 8 }} />
          </div>

          {/* Sidebar bottom */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <div className="sk" style={{ height: 12, width: 80 }} />
              <div className="sk" style={{ height: 24, width: 44, borderRadius: 12 }} />
            </div>
            <div className="sk" style={{ height: 40, borderRadius: 8 }} />
          </div>
        </div>

        {/* ── MAIN CONTENT SKELETON ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Topbar */}
          <div style={{
            padding: "20px 40px",
            borderBottom: "1px solid var(--border)",
            background: "var(--card-bg)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div className="sk" style={{ height: 22, width: 120 }} />
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="sk" style={{ height: 26, width: 100, borderRadius: 20 }} />
              <div className="sk" style={{ height: 38, width: 100, borderRadius: 8 }} />
            </div>
          </div>

          {/* Content area */}
          <div style={{ padding: "36px 40px", flex: 1 }}>

            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: "var(--red)" }} />
              <div className="sk" style={{ height: 11, width: 80 }} />
            </div>

            {/* Stats grid — 4 cards like .db-stats-grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginBottom: 40,
            }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 14, padding: 24,
                }}>
                  {/* Icon */}
                  <div className="sk" style={{ width: 28, height: 28, borderRadius: 8, marginBottom: 14 }} />
                  {/* Big number */}
                  <div className="sk" style={{ height: 36, width: "55%", marginBottom: 8 }} />
                  {/* Label */}
                  <div className="sk" style={{ height: 11, width: "75%" }} />
                  {/* Change */}
                  <div className="sk" style={{ height: 10, width: "45%", marginTop: 10 }} />
                </div>
              ))}
            </div>

            {/* Two column cards — like .db-two-col */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}>
              {[1, 2].map(i => (
                <div key={i} style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 14, overflow: "hidden",
                }}>
                  {/* Card header */}
                  <div style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div className="sk" style={{ height: 16, width: 100 }} />
                    <div className="sk" style={{ height: 12, width: 60 }} />
                  </div>
                  {/* Card body — activity items */}
                  <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                    {[1, 2, 3].map(j => (
                      <div key={j} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 0",
                        borderBottom: j < 3 ? "1px solid var(--border)" : "none",
                      }}>
                        {/* Dot / avatar */}
                        <div className="sk" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div className="sk" style={{ height: 13, width: "65%" }} />
                          <div className="sk" style={{ height: 10, width: "45%" }} />
                        </div>
                        {/* Status badge */}
                        <div className="sk" style={{ height: 22, width: 54, borderRadius: 20 }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
