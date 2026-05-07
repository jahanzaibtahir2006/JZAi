"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

const services = [
  {
    num: "01",
    icon: "🧠",
    name: "AI & Machine Learning",
    desc: "Custom AI models, LLM integrations, computer vision, and intelligent automation pipelines built for production at scale.",
    tags: ["LLMs", "PyTorch", "TensorFlow", "Computer Vision"],
  },
  {
    num: "02",
    icon: "🌐",
    name: "Web Development",
    desc: "High-performance web applications using modern stacks — from landing pages to complex SaaS platforms that scale effortlessly.",
    tags: ["React", "Next.js", "Node.js", "Tailwind"],
  },
  {
    num: "03",
    icon: "☁️",
    name: "Cloud & DevOps",
    desc: "Resilient cloud infrastructure, CI/CD pipelines, containerization, and microservices architecture for enterprise-grade reliability.",
    tags: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    num: "04",
    icon: "💬",
    name: "AI Chatbots & NLP",
    desc: "Intelligent conversational agents, RAG systems, and NLP solutions that understand context and deliver human-like interactions.",
    tags: ["Claude API", "OpenAI", "RAG", "LangChain"],
  },
  {
    num: "05",
    icon: "📊",
    name: "Data Engineering",
    desc: "End-to-end data pipelines, real-time analytics dashboards, and data warehousing solutions that turn raw data into competitive advantage.",
    tags: ["Python", "Spark", "SQL", "Tableau"],
  },
  {
    num: "06",
    icon: "🎨",
    name: "UI/UX Design",
    desc: "User-centric design systems, interactive prototypes, and brand identities that captivate users and drive conversion.",
    tags: ["Figma", "Framer", "Design Systems", "Adobe XD"],
  },
];

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Deep dive into your goals, challenges, and technical requirements to craft the perfect strategy.",
  },
  {
    num: "02",
    title: "Architecture",
    desc: "Design scalable system architecture, tech stack selection, and detailed project roadmap.",
  },
  {
    num: "03",
    title: "Build & Iterate",
    desc: "Agile development sprints with continuous delivery, testing, and feedback loops.",
  },
  {
    num: "04",
    title: "Launch & Scale",
    desc: "Seamless deployment, monitoring, performance optimization, and ongoing support.",
  },
];

export default function ServicesPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync theme across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "theme") setTheme(e.newValue || "dark");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>Services — JZAI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --red: #e11d48;
          --red-dark: #9f1239;
          --red-glow: rgba(225,29,72,0.15);
          --bg: #060606;
          --bg2: #0d0d0d;
          --bg3: #111;
          --border: rgba(225,29,72,0.12);
          --text: #f0f0f0;
          --text-muted: rgba(240,240,240,0.45);
          --card-bg: #0f0f0f;
          --nav-bg: rgba(6,6,6,0.92);
        }
        [data-theme="light"] {
          --bg: #f8f8f8;
          --bg2: #ffffff;
          --bg3: #f0f0f0;
          --border: rgba(225,29,72,0.15);
          --text: #0a0a0a;
          --text-muted: rgba(10,10,10,0.5);
          --card-bg: #ffffff;
          --nav-bg: rgba(248,248,248,0.92);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          transition: background 0.3s, color 0.3s;
          overflow-x: hidden;
        }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
          transition: background 0.3s;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800;
          color: var(--text); text-decoration: none;
          letter-spacing: -0.5px;
        }
        .nav-logo span { color: var(--red); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a {
          font-size: 13.5px; font-weight: 500;
          color: var(--text-muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-links a.active { color: var(--red); }
        .nav-right { display: flex; align-items: center; gap: 14px; }
        .theme-btn {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--bg3); border: 1px solid var(--border);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.2s; color: var(--text);
        }
        .theme-btn:hover { border-color: var(--red); transform: scale(1.08); }
        .nav-cta {
          background: linear-gradient(135deg, var(--red-dark), var(--red));
          color: #fff; border: none; border-radius: 8px;
          padding: 9px 20px; font-size: 13px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(225,29,72,0.35); }

        .hero {
          padding: 140px 40px 80px;
          max-width: 1200px; margin: 0 auto;
          position: relative;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--red-glow); border: 1px solid rgba(225,29,72,0.25);
          border-radius: 40px; padding: 7px 18px;
          font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--red); margin-bottom: 32px;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.8s ease 0.2s forwards;
        }
        .hero-eyebrow::before {
          content:''; width:6px; height:6px; background:var(--red);
          border-radius:50%; animation: blink 2s infinite; flex-shrink:0;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -2px; margin-bottom: 20px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero h1 em { font-style: normal; color: var(--red); }
        .hero p {
          font-size: 17px; color: var(--text-muted); max-width: 560px;
          line-height: 1.7; margin-bottom: 40px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .red-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
          margin: 0 40px 70px;
          opacity: 0.4;
        }

        .services-section {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px 100px;
        }
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          color: var(--red); text-transform: uppercase;
          margin-bottom: 14px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; letter-spacing: -1.5px;
          margin-bottom: 60px; line-height: 1.1;
        }
        .section-title em { font-style: normal; color: var(--red); }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
        .service-card {
          background: var(--card-bg);
          padding: 36px 32px;
          position: relative;
          transition: background 0.3s;
          cursor: default;
        }
        .service-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(225,29,72,0.04), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .service-card:hover::before { opacity: 1; }
        .service-card:hover { background: var(--bg3); }

        .service-num {
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 700;
          color: var(--red); letter-spacing: 2px;
          margin-bottom: 16px; opacity: 0.7;
        }
        .service-icon { font-size: 32px; margin-bottom: 16px; display: block; }
        .service-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          margin-bottom: 12px; letter-spacing: -0.3px;
          color: var(--text);
        }
        .service-desc {
          font-size: 13.5px; line-height: 1.65;
          color: var(--text-muted); margin-bottom: 20px;
        }
        .service-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
        .tag {
          font-size: 11px; font-weight: 600;
          background: var(--red-glow); border: 1px solid rgba(225,29,72,0.2);
          color: var(--red); border-radius: 6px;
          padding: 3px 10px; letter-spacing: 0.2px;
        }
        .service-arrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: var(--red);
          text-decoration: none; opacity: 0.7;
          transition: opacity 0.2s, gap 0.2s;
        }
        .service-card:hover .service-arrow { opacity: 1; gap: 10px; }

        .process-section {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 80px 40px;
          margin-bottom: 80px;
        }
        .process-inner { max-width: 1200px; margin: 0 auto; }
        .process-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
          margin-top: 50px;
        }
        .process-step {
          padding: 32px 28px; position: relative;
          text-align: center;
        }
        .process-step::after {
          content: '→';
          position: absolute; right: -8px; top: 40px;
          color: var(--red); opacity: 0.4; font-size: 20px;
        }
        .process-step:last-child::after { display: none; }
        .step-circle {
          width: 80px; height: 80px; margin: 0 auto 20px;
          background: var(--card-bg); border: 2px solid var(--border);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
          color: var(--text); transition: all 0.3s;
        }
        .process-step:hover .step-circle {
          background: var(--red); border-color: var(--red); color: #fff;
        }
        .step-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700;
          margin-bottom: 10px; color: var(--text);
        }
        .step-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

        .cta-section {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px 100px;
          text-align: center;
        }
        .cta-box {
          background: linear-gradient(135deg, #0d0205, #150308, #0d0205);
          border: 1px solid rgba(225,29,72,0.2);
          border-radius: 20px; padding: 70px 40px;
          position: relative; overflow: hidden;
        }
        [data-theme="light"] .cta-box {
          background: linear-gradient(135deg, #fff0f2, #fff5f7, #fff0f2);
        }
        .cta-box::before {
          content: '';
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(225,29,72,0.1), transparent 70%);
        }
        .cta-box h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 48px); font-weight: 800;
          letter-spacing: -1.5px; margin-bottom: 16px;
          position: relative;
        }
        .cta-box h2 em { font-style: normal; color: var(--red); }
        .cta-box p {
          font-size: 16px; color: var(--text-muted);
          margin-bottom: 36px; position: relative;
        }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }
        .btn-primary {
          background: linear-gradient(135deg, var(--red-dark), var(--red));
          color: #fff; border: none; border-radius: 10px;
          padding: 14px 32px; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(225,29,72,0.35); }
        .btn-secondary {
          background: transparent;
          color: var(--text); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 14px 32px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-secondary:hover { border-color: var(--red); color: var(--red); }

        footer {
          border-top: 1px solid var(--border);
          padding: 30px 40px;
          display: flex; align-items: center; justify-content: space-between;
          background: var(--bg2);
        }
        .footer-logo {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800;
          color: var(--text); text-decoration: none;
        }
        .footer-logo span { color: var(--red); }
        .footer-text { font-size: 12px; color: var(--text-muted); }

        @media(max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .process-step::after { display: none; }
          nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero, .services-section, .cta-section { padding-left: 20px; padding-right: 20px; }
          .red-line { margin: 0 20px 50px; }
        }
        @media(max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
          .process-grid { grid-template-columns: 1fr; }
          .hero { padding-top: 110px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nav-logo">
          JZ<span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/services" className="active">Services</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#tech">Tech Stack</Link>
          <Link href="/#about">About</Link>
        </div>
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <Link href="/#contact" className="nav-cta">
            Get in Touch
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Our Services</div>
        <h1>
          What We <em>Build</em>
          <br />& Engineer
        </h1>
        <p>
          From intelligent AI systems to high-performance web platforms — every solution is
          engineered with precision, built to scale, and designed to deliver real results.
        </p>
      </section>

      <div className="red-line" />

      {/* SERVICES */}
      <section className="services-section">
        <div className="section-label">Core Services</div>
        <div className="section-title">
          Everything You Need to
          <br />
          <em>Dominate Digitally</em>
        </div>

        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.num}>
              <div className="service-num">{s.num}</div>
              <span className="service-icon">{s.icon}</span>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-tags">
                {s.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              <Link href="/#contact" className="service-arrow">
                Start a Project →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <div className="process-inner">
          <div className="section-label">How We Work</div>
          <div className="section-title">
            Our <em>Process</em>
          </div>
          <div className="process-grid">
            {steps.map((step) => (
              <div className="process-step" key={step.num}>
                <div className="step-circle">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>
            Ready to Build Something <em>Extraordinary?</em>
          </h2>
          <p>Have a project in mind? Let&apos;s turn your vision into a high-performing AI-powered reality.</p>
          <div className="cta-btns">
            <a href="mailto:jahanzaibtahir2006@gmail.com" className="btn-primary">
              Start a Project →
            </a>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link href="/" className="footer-logo">
          JZ<span>AI</span>
        </Link>
        <div className="footer-text">© 2026 JZAI. Engineering Intelligence.</div>
      </footer>
    </>
  );
}
