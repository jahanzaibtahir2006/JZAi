"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import Head from "next/head";

type Tab = "login" | "signup" | "forgot";
type AlertType = "error" | "success" | "";

export default function AuthPage() {
  const [theme, setTheme] = useState("dark");
  const [tab, setTab] = useState<Tab>("login");
  const [scrolled, setScrolled] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmailErr, setLoginEmailErr] = useState("");
  const [loginPassErr, setLoginPassErr] = useState("");

  // Signup fields
  const [signupFirst, setSignupFirst] = useState("");
  const [signupLast, setSignupLast] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupEmailErr, setSignupEmailErr] = useState("");
  const [signupPassErr, setSignupPassErr] = useState("");
  const [signupConfirmErr, setSignupConfirmErr] = useState("");
  const [strength, setStrength] = useState({ width: "0%", color: "transparent", label: "" });

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");

  // Alert
  const [alert, setAlert] = useState<{ type: AlertType; msg: string }>({ type: "", msg: "" });

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "theme") setTheme(e.newValue || "dark");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearErrors = () => {
    setLoginEmailErr(""); setLoginPassErr("");
    setSignupEmailErr(""); setSignupPassErr(""); setSignupConfirmErr("");
    setAlert({ type: "", msg: "" });
  };

  const showAlert = (type: AlertType, msg: string) => setAlert({ type, msg });

  const checkStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const map = [
      { width: "0%", color: "transparent", label: "" },
      { width: "25%", color: "#ef4444", label: "Weak" },
      { width: "50%", color: "#f97316", label: "Fair" },
      { width: "75%", color: "#eab308", label: "Good" },
      { width: "100%", color: "#22c55e", label: "Strong" },
    ];
    setStrength(map[score]);
  };

  const handleLogin = async () => {
    clearErrors();
    let valid = true;
    if (!isEmail(loginEmail)) { setLoginEmailErr("Please enter a valid email."); valid = false; }
    if (!loginPass) { setLoginPassErr("Password is required."); valid = false; }
    if (!valid) return;
    setLoginLoading(true);
    const res = await fetch("https://jzai-saas.jahanzaibtahir2006.workers.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const data = await res.json();
    setLoginLoading(false);
    if (!res.ok) {
      showAlert("error", data.error || "Invalid email or password.");
    } else {
      localStorage.setItem("jzai_user", JSON.stringify(data.user));
      showAlert("success", "Signed in! Redirecting…");
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    }
  };

  const handleSignup = async () => {
    clearErrors();
    let valid = true;
    if (!signupFirst.trim()) { showAlert("error", "First name is required."); valid = false; }
    if (!isEmail(signupEmail)) { setSignupEmailErr("Please enter a valid email."); valid = false; }
    if (signupPass.length < 8) { setSignupPassErr("Password must be at least 8 characters."); valid = false; }
    if (signupPass !== signupConfirm) { setSignupConfirmErr("Passwords do not match."); valid = false; }
    if (!valid) return;
    setSignupLoading(true);
    const res = await fetch("https://jzai-saas.jahanzaibtahir2006.workers.dev/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${signupFirst} ${signupLast}`, email: signupEmail, password: signupPass }),
    });
    const data = await res.json();
    setSignupLoading(false);
    if (!res.ok) {
      showAlert("error", data.error || "Signup failed.");
    } else {
      showAlert("success", "Account created! Please sign in.");
      setTimeout(() => setTab("login"), 1500);
    }
  };

  const handleForgot = () => {
    if (!isEmail(forgotEmail)) { showAlert("error", "Please enter a valid email address."); return; }
    showAlert("success", "Reset link sent! Check your inbox.");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (tab === "login") handleLogin();
      else if (tab === "signup") handleSignup();
    }
  };

  return (
    <>
      <Head>
        <title>Login — JZAI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        :root { --transition-theme: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        [data-theme="dark"] {
          --bg: #050507; --bg2: #0d0d12; --bg3: #13131a; --bg4: #1c1c26;
          --red: #e8193c; --red-dark: #a01028;
          --red-glow: rgba(232,25,60,0.18); --red-dim: rgba(232,25,60,0.08);
          --text: #f5f5f7; --text2: #8a8a9a; --text3: #5a5a6a;
          --border: #2a2a35; --border2: rgba(232,25,60,0.12);
          --nav-bg: rgba(5,5,7,0.85); --nav-bg-s: rgba(5,5,7,0.97);
          --card-bg: #13131a; --toggle-bg: #1c1c26; --toggle-border: #2a2a35;
          --grid-line: rgba(232,25,60,0.04); --stroke-text-color: rgba(245,245,247,0.25);
          --shadow: rgba(0,0,0,0.4); --footer-bg: #13131a;
        }
        [data-theme="light"] {
          --bg: #fafafa; --bg2: #f0f0f5; --bg3: #e8e8f0; --bg4: #dddde8;
          --red: #d0102e; --red-dark: #a01028;
          --red-glow: rgba(208,16,46,0.12); --red-dim: rgba(208,16,46,0.07);
          --text: #0f0f14; --text2: #5a5a6a; --text3: #9a9aaa;
          --border: #d8d8e4; --border2: rgba(208,16,46,0.15);
          --nav-bg: rgba(250,250,250,0.85); --nav-bg-s: rgba(250,250,250,0.98);
          --card-bg: #ffffff; --toggle-bg: #e8e8f0; --toggle-border: #d0d0dc;
          --grid-line: rgba(208,16,46,0.05); --stroke-text-color: rgba(15,15,20,0.2);
          --shadow: rgba(0,0,0,0.08); --footer-bg: #f0f0f5;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg); color: var(--text);
          overflow-x: hidden; min-height: 100vh;
          transition: background var(--transition-theme), color var(--transition-theme);
        }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 60px;
          background: var(--nav-bg); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border2);
          transition: padding 0.3s, background var(--transition-theme);
        }
        nav.scrolled { padding: 14px 60px; background: var(--nav-bg-s); }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); text-decoration: none; }
        .nav-logo span { color: var(--red); }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-link { color: var(--text2); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: var(--text); }
        .theme-toggle {
          position: relative; width: 52px; height: 28px;
          background: var(--toggle-bg); border: 1.5px solid var(--toggle-border);
          border-radius: 14px; cursor: pointer; outline: none;
          display: flex; align-items: center; padding: 0 3px;
          transition: background var(--transition-theme);
        }
        .toggle-thumb {
          width: 20px; height: 20px; border-radius: 50%; background: var(--red);
          display: flex; align-items: center; justify-content: center; font-size: 11px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 6px var(--shadow); user-select: none;
        }
        [data-theme="light"] .toggle-thumb { transform: translateX(24px); }

        .page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 100px 24px 60px; position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 40%, var(--red-glow), transparent 65%),
                      radial-gradient(ellipse 30% 30% at 10% 90%, rgba(232,25,60,0.04), transparent 60%);
        }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
                            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 60px 60px; animation: gridShift 20s linear infinite;
        }
        @keyframes gridShift { 0% { background-position: 0 0; } 100% { background-position: 60px 60px; } }

        .auth-wrap {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 960px; width: 100%; gap: 0;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 40px 80px var(--shadow);
          animation: fadeUp 0.7s ease 0.1s both;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        .left-panel {
          background: var(--bg2); padding: 52px 48px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .left-panel::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, var(--red-glow), transparent 70%);
          pointer-events: none;
        }
        .left-logo { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); margin-bottom: 36px; display: block; text-decoration: none; }
        .left-logo span { color: var(--red); }
        .left-heading { font-family: 'Syne', sans-serif; font-size: clamp(26px, 3vw, 36px); font-weight: 800; letter-spacing: -1px; line-height: 1.1; margin-bottom: 16px; color: var(--text); }
        .left-heading em { color: var(--red); font-style: normal; }
        .left-sub { font-size: 14px; color: var(--text2); line-height: 1.7; font-weight: 300; max-width: 280px; }
        .features-list { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text2); }
        .feature-ico { width: 30px; height: 30px; min-width: 30px; border-radius: 8px; background: var(--red-dim); border: 1px solid rgba(232,25,60,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .trust-row { display: flex; align-items: center; gap: 10px; margin-top: 48px; }
        .trust-avatars { display: flex; }
        .trust-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg2); background: var(--bg3); margin-left: -8px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--text2); font-family: 'Syne', sans-serif; }
        .trust-avatar:first-child { margin-left: 0; }
        .trust-avatar.red { background: var(--red); color: #fff; }
        .trust-text { font-size: 12px; color: var(--text2); margin-left: 4px; }
        .trust-text strong { color: var(--text); font-weight: 600; }

        .right-panel { padding: 52px 48px; display: flex; flex-direction: column; justify-content: center; }
        .tab-row { display: flex; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 36px; gap: 4px; }
        .tab-btn { flex: 1; padding: 9px; border-radius: 7px; font-size: 13px; font-weight: 600; text-align: center; cursor: pointer; color: var(--text2); transition: background 0.2s, color 0.2s; border: none; background: transparent; font-family: 'DM Sans', sans-serif; }
        .tab-btn.active { background: var(--red); color: #fff; }
        .form-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; color: var(--text); }
        .form-sub { font-size: 14px; color: var(--text2); margin-bottom: 28px; font-weight: 300; }

        .field-group { margin-bottom: 18px; position: relative; }
        .field-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text2); margin-bottom: 8px; display: block; }
        .field-label .req { color: var(--red); }
        .input-wrap { position: relative; }
        .input-ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; color: var(--text3); pointer-events: none; }
        input {
          width: 100%; background: var(--bg2); border: 1px solid var(--border);
          border-radius: 8px; padding: 13px 16px 13px 40px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: var(--text); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background var(--transition-theme);
        }
        input:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-dim); }
        input::placeholder { color: var(--text3); }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text3); font-size: 16px; transition: color 0.2s; padding: 0; }
        .eye-btn:hover { color: var(--text2); }
        .field-error { font-size: 12px; color: var(--red); margin-top: 6px; }
        .strength-bar { height: 3px; border-radius: 2px; background: var(--border); margin-top: 8px; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 2px; transition: width 0.4s, background 0.4s; }
        .strength-label { font-size: 11px; margin-top: 5px; }
        .forgot-row { display: flex; justify-content: flex-end; margin-top: -10px; margin-bottom: 18px; }
        .forgot-link { font-size: 12px; color: var(--text2); text-decoration: none; transition: color 0.2s; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
        .forgot-link:hover { color: var(--red); }
        .alert { border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .alert-error { background: rgba(232,25,60,0.08); border: 1px solid rgba(232,25,60,0.2); color: var(--red); }
        .alert-success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #22c55e; }
        .btn-submit {
          width: 100%; background: var(--red); color: #fff; border: none;
          border-radius: 8px; padding: 14px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden; margin-top: 6px;
        }
        .btn-submit:hover { background: var(--red-dark); transform: translateY(-1px); box-shadow: 0 8px 28px var(--red-glow); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; font-size: 12px; color: var(--text3); }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .btn-google { width: 100%; background: transparent; border: 1px solid var(--border); border-radius: 8px; padding: 13px; color: var(--text2); font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 10px; transition: border-color 0.2s, color 0.2s, background 0.2s; }
        .btn-google:hover { border-color: rgba(232,25,60,0.3); color: var(--text); background: var(--red-dim); }
        .terms-text { font-size: 11px; color: var(--text3); text-align: center; margin-top: 18px; line-height: 1.6; }
        .terms-text a { color: var(--text2); text-decoration: none; cursor: pointer; transition: color 0.2s; }
        .terms-text a:hover { color: var(--red); }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        footer { background: var(--footer-bg); border-top: 1px solid var(--border); padding: 24px 60px; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: var(--text); text-decoration: none; }
        .footer-logo span { color: var(--red); }
        .footer-text { font-size: 12px; color: var(--text2); }
        @media (max-width: 768px) {
          nav { padding: 18px 20px; }
          .auth-wrap { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 36px 28px; }
          footer { padding: 20px 24px; }
          .page { padding: 90px 16px 40px; }
        }
      `}</style>

      <nav className={scrolled ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">JZ<span>AI</span></Link>
        <div className="nav-right">
          <Link href="/" className="nav-link">← Back to Home</Link>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            <div className="toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</div>
          </button>
        </div>
      </nav>

      <div className="page" onKeyDown={handleKeyDown}>
        <div className="hero-bg" />
        <div className="grid-overlay" />

        <div className="auth-wrap">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div>
              <Link href="/" className="left-logo">JZ<span>AI</span></Link>
              <div className="left-heading">Your AI Chatbot<br /><em>Awaits.</em></div>
              <p className="left-sub">Join hundreds of businesses using JZAI to capture leads, support customers, and grow — 24/7.</p>
              <div className="features-list">
                {[
                  { ico: "🤖", text: "Custom AI chatbot trained on your data" },
                  { ico: "📊", text: "Analytics dashboard & lead tracking" },
                  { ico: "⚡", text: "Deploy in minutes — no code needed" },
                  { ico: "🔒", text: "Secure, isolated Cloudflare Workers" },
                ].map((f) => (
                  <div className="feature-item" key={f.text}>
                    <div className="feature-ico">{f.ico}</div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="trust-row">
              <div className="trust-avatars">
                {["A", "MK", "SR", "ZA"].map((a, i) => (
                  <div className={`trust-avatar${i === 0 ? " red" : ""}`} key={a}>{a}</div>
                ))}
              </div>
              <div className="trust-text"><strong>500+</strong> businesses trust JZAI</div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="tab-row">
              <button className={`tab-btn${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); clearErrors(); }}>Sign In</button>
              <button className={`tab-btn${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); clearErrors(); }}>Create Account</button>
            </div>

            {alert.type && (
              <div className={`alert ${alert.type === "error" ? "alert-error" : "alert-success"}`}>
                <span>{alert.type === "error" ? "⚠️" : "✓"}</span>
                <span>{alert.msg}</span>
              </div>
            )}

            {/* LOGIN */}
            {tab === "login" && (
              <>
                <div className="form-title">Welcome back</div>
                <div className="form-sub">Sign in to your JZAI dashboard.</div>
                <div className="field-group">
                  <label className="field-label">Email <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">✉</span>
                    <input type="email" placeholder="you@company.com" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); clearErrors(); }} />
                  </div>
                  {loginEmailErr && <div className="field-error">{loginEmailErr}</div>}
                </div>
                <div className="field-group">
                  <label className="field-label">Password <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">🔒</span>
                    <input type={showLoginPass ? "text" : "password"} placeholder="••••••••" value={loginPass} onChange={(e) => { setLoginPass(e.target.value); clearErrors(); }} />
                    <button className="eye-btn" onClick={() => setShowLoginPass(!showLoginPass)} type="button">{showLoginPass ? "🙈" : "👁"}</button>
                  </div>
                  {loginPassErr && <div className="field-error">{loginPassErr}</div>}
                </div>
                <div className="forgot-row">
                  <button className="forgot-link" onClick={() => setTab("forgot")}>Forgot password?</button>
                </div>
                <button className="btn-submit" onClick={handleLogin} disabled={loginLoading}>
                  {loginLoading ? <><span className="spinner" />Signing in…</> : <>Sign In <span>→</span></>}
                </button>
                <div className="divider">or continue with</div>
                <button className="btn-google" onClick={() => showAlert("error", "Google OAuth coming soon.")}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <div className="terms-text">Don't have an account? <a onClick={() => { setTab("signup"); clearErrors(); }}>Create one free →</a></div>
              </>
            )}

            {/* SIGNUP */}
            {tab === "signup" && (
              <>
                <div className="form-title">Create your account</div>
                <div className="form-sub">Start building your AI chatbot — free for 14 days.</div>
                <div className="two-col">
                  <div className="field-group">
                    <label className="field-label">First Name <span className="req">*</span></label>
                    <div className="input-wrap">
                      <span className="input-ico">👤</span>
                      <input type="text" placeholder="Ali" value={signupFirst} onChange={(e) => setSignupFirst(e.target.value)} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Last Name</label>
                    <div className="input-wrap">
                      <span className="input-ico">👤</span>
                      <input type="text" placeholder="Khan" value={signupLast} onChange={(e) => setSignupLast(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Email <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">✉</span>
                    <input type="email" placeholder="you@company.com" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); clearErrors(); }} />
                  </div>
                  {signupEmailErr && <div className="field-error">{signupEmailErr}</div>}
                </div>
                <div className="field-group">
                  <label className="field-label">Password <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">🔒</span>
                    <input type={showSignupPass ? "text" : "password"} placeholder="Min. 8 characters" value={signupPass} onChange={(e) => { setSignupPass(e.target.value); checkStrength(e.target.value); clearErrors(); }} />
                    <button className="eye-btn" onClick={() => setShowSignupPass(!showSignupPass)} type="button">{showSignupPass ? "🙈" : "👁"}</button>
                  </div>
                  <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                  {strength.label && <div className="strength-label" style={{ color: strength.color }}>{strength.label}</div>}
                  {signupPassErr && <div className="field-error">{signupPassErr}</div>}
                </div>
                <div className="field-group">
                  <label className="field-label">Confirm Password <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">🔒</span>
                    <input type={showConfirmPass ? "text" : "password"} placeholder="Re-enter password" value={signupConfirm} onChange={(e) => { setSignupConfirm(e.target.value); clearErrors(); }} />
                    <button className="eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)} type="button">{showConfirmPass ? "🙈" : "👁"}</button>
                  </div>
                  {signupConfirmErr && <div className="field-error">{signupConfirmErr}</div>}
                </div>
                <button className="btn-submit" onClick={handleSignup} disabled={signupLoading}>
                  {signupLoading ? <><span className="spinner" />Creating account…</> : <>Create Account <span>→</span></>}
                </button>
                <div className="divider">or continue with</div>
                <button className="btn-google" onClick={() => showAlert("error", "Google OAuth coming soon.")}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <div className="terms-text">By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</div>
              </>
            )}

            {/* FORGOT */}
            {tab === "forgot" && (
              <>
                <div className="form-title">Reset Password</div>
                <div className="form-sub">Enter your email and we'll send a reset link.</div>
                <div className="field-group">
                  <label className="field-label">Email <span className="req">*</span></label>
                  <div className="input-wrap">
                    <span className="input-ico">✉</span>
                    <input type="email" placeholder="you@company.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  </div>
                </div>
                <button className="btn-submit" onClick={handleForgot}>Send Reset Link <span>→</span></button>
                <div className="terms-text" style={{ marginTop: "16px" }}>
                  <a onClick={() => { setTab("login"); clearErrors(); }}>← Back to Sign In</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <footer>
        <Link href="/" className="footer-logo">JZ<span>AI</span></Link>
        <div className="footer-text">© 2026 JZAI. Engineering Intelligence.</div>
      </footer>
    </>
  );
}
