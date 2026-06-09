"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}

        [data-theme="dark"]{
          --bg:#050507;--bg2:#0d0d12;--bg3:#13131a;
          --red:#e8193c;
          --red-dim:rgba(232,25,60,0.08);
          --red-glow:rgba(232,25,60,0.18);
          --text:#f5f5f7;--text2:#8a8a9a;--text3:#5a5a6a;
          --border:#2a2a35;--card-bg:#13131a;
        }
        [data-theme="light"]{
          --bg:#fafafa;--bg2:#f0f0f5;--bg3:#e8e8f0;
          --red:#d0102e;
          --red-dim:rgba(208,16,46,0.07);
          --red-glow:rgba(208,16,46,0.12);
          --text:#0f0f14;--text2:#5a5a6a;--text3:#9a9aaa;
          --border:#d8d8e4;--card-bg:#ffffff;
        }

        body{
          font-family:'DM Sans',sans-serif;
          background:var(--bg);
          color:var(--text);
          min-height:100vh;
        }

        .err-wrap{
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:40px 24px;
          position:relative;overflow:hidden;
          background:var(--bg);
        }

        .err-wrap::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse 60% 60% at 50% 50%, var(--red-glow), transparent 70%);
          pointer-events:none;
        }

        .err-grid{
          position:absolute;inset:0;pointer-events:none;
          background-image:
            linear-gradient(rgba(232,25,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,25,60,0.04) 1px, transparent 1px);
          background-size:60px 60px;
          animation:gridShift 20s linear infinite;
        }
        @keyframes gridShift{
          0%{background-position:0 0;}
          100%{background-position:60px 60px;}
        }

        .err-card{
          position:relative;z-index:2;
          background:var(--card-bg);
          border:1px solid var(--border);
          border-radius:20px;
          padding:52px 48px;
          max-width:480px;width:100%;
          text-align:center;
          animation:fadeUp 0.6s ease both;
        }
        @keyframes fadeUp{
          from{opacity:0;transform:translateY(20px);}
          to{opacity:1;transform:translateY(0);}
        }

        .err-code{
          font-family:'Syne',sans-serif;
          font-size:80px;font-weight:800;
          letter-spacing:-4px;line-height:1;
          color:var(--text);opacity:0.07;
          margin-bottom:8px;user-select:none;
        }

        .err-badge{
          display:inline-flex;align-items:center;gap:8px;
          background:var(--red-dim);
          border:1px solid rgba(232,25,60,0.25);
          border-radius:40px;padding:6px 16px;
          font-size:11px;font-weight:700;
          letter-spacing:1.5px;text-transform:uppercase;
          color:var(--red);margin-bottom:24px;
        }
        .err-badge::before{
          content:'';width:6px;height:6px;
          background:var(--red);border-radius:50%;
          animation:pulseDot 2s ease infinite;
        }
        @keyframes pulseDot{
          0%,100%{transform:scale(1);opacity:1;}
          50%{transform:scale(1.6);opacity:0.5;}
        }

        .err-title{
          font-family:'Syne',sans-serif;
          font-size:28px;font-weight:800;
          letter-spacing:-0.8px;color:var(--text);
          margin-bottom:12px;
        }

        .err-sub{
          font-size:15px;font-weight:300;
          color:var(--text2);line-height:1.7;
          margin-bottom:36px;
        }

        .err-digest{
          font-size:11px;color:var(--text3);
          font-family:monospace;
          margin-bottom:28px;
          padding:8px 14px;
          background:var(--bg2);
          border:1px solid var(--border);
          border-radius:6px;display:inline-block;
        }

        .err-btns{
          display:flex;gap:12px;
          justify-content:center;flex-wrap:wrap;
        }

        .err-btn-primary{
          background:var(--red);color:#fff;
          padding:13px 28px;border-radius:8px;
          font-size:14px;font-weight:600;
          font-family:'DM Sans',sans-serif;
          border:none;cursor:pointer;
          display:inline-flex;align-items:center;gap:8px;
          transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
          position:relative;overflow:hidden;
        }
        .err-btn-primary:hover{
          background:#a01028;
          transform:translateY(-2px);
          box-shadow:0 12px 40px var(--red-glow);
        }

        .err-btn-ghost{
          border:1px solid var(--border);color:var(--text2);
          padding:13px 28px;border-radius:8px;
          font-size:14px;font-weight:500;
          font-family:'DM Sans',sans-serif;
          cursor:pointer;background:transparent;
          display:inline-flex;align-items:center;gap:8px;
          transition:border-color 0.2s,color 0.2s,background 0.2s;
          text-decoration:none;
        }
        .err-btn-ghost:hover{
          border-color:rgba(232,25,60,0.4);
          color:var(--text);
          background:var(--red-dim);
        }
      `}</style>

      <div className="err-wrap">
        <div className="err-grid" />

        <div className="err-card">
          <div className="err-code">500</div>

          <div className="err-badge">Server Error</div>

          <h1 className="err-title">Something went wrong</h1>

          <p className="err-sub">
            An unexpected server error occurred. Please try again or return to the home page.
          </p>

          {error?.digest && (
            <div className="err-digest">Error ID: {error.digest}</div>
          )}

          <div className="err-btns">
            <button className="err-btn-primary" onClick={reset}>
              Try Again
            </button>
            <Link href="/" className="err-btn-ghost">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
