"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import NumberFlow from "@number-flow/react";
import confetti from "canvas-confetti";
import { useRef } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcBots, setCalcBots] = useState(1);
  const [calcMsgs, setCalcMsgs] = useState(500);
  const [calcAddons, setCalcAddons] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const switchRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  initializePaddle({
    environment: "sandbox",
    token: "test_e6a7ddfbe07d84d8b2ba4e09937",
  }).then((paddleInstance) => {
    if (paddleInstance) setPaddle(paddleInstance);
  });
}, []);

const handleCheckout = (priceId: string) => {
  const user = localStorage.getItem("jzai_user");
  if (!user) {
    window.location.href = "/auth";
    return;
  }
  const userData = JSON.parse(user);
  paddle?.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: { email: userData.email },
    customData: { user_id: String(userData.id) },
  });
};
  const { theme } = useTheme();

useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem("jzai_user"));
}, []);

const plans = [
  {
    id: "starter",
    icon: "🚀",
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "Perfect for individuals and small businesses just getting started.",
    badge: null,
    features: [
      { text: "1 Chatbot", included: true },
      { text: "500 messages / month", included: true },
      { text: "Lead capture", included: true },
      { text: "Conversations history", included: true },
      { text: "Email support", included: true },
      { text: "Analytics dashboard", included: false },
      { text: "Custom branding", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started",
    ctaHref: "/auth", // baad mein override hoga
  },
  {
    id: "pro",
    icon: "⚡",
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 63,
    description: "For growing businesses that need more power and flexibility.",
    badge: "MOST POPULAR",
    features: [
      { text: "5 Chatbots", included: true },
      { text: "5,000 messages / month", included: true },
      { text: "Lead capture", included: true },
      { text: "Conversations history", included: true },
      { text: "Priority email support", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Custom branding", included: true },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/auth", // baad mein override hoga
  },
    {
      id: "enterprise",
      icon: "🏢",
      name: "Enterprise",
      monthlyPrice: null,
      yearlyPrice: null,
      description: "For large teams with advanced requirements and dedicated support.",
      badge: null,
      features: [
        { text: "Unlimited Chatbots", included: true },
        { text: "Unlimited messages", included: true },
        { text: "Lead capture", included: true },
        { text: "Conversations history", included: true },
        { text: "Dedicated support", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "Custom branding", included: true },
        { text: "Priority support", included: true },
        { text: "API access", included: true },
      ],
      cta: "Contact Sales",
      ctaHref: "mailto:hello@jzai.store",
    },
  ];

  const faqs = [
    {
      q: "Can I upgrade or downgrade my plan anytime?",
      a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.",
    },
    {
      q: "What happens if I exceed my message limit?",
      a: "Your chatbot will display a friendly message letting visitors know the monthly limit has been reached. You can upgrade anytime to restore service.",
    },
    {
      q: "Do you offer a free trial?",
      a: "We offer a 7-day money-back guarantee on all plans. Try risk-free and get a full refund if you're not satisfied.",
    },
    {
      q: "How does the yearly billing discount work?",
      a: "Choosing yearly billing saves you approximately 20% compared to monthly billing. You're charged once per year.",
    },
    {
      q: "Can I use my own OpenAI API key?",
      a: "Yes, on Pro and Enterprise plans you can bring your own OpenAI API key for full control over usage and costs.",
    },
  ];

  return (
    <>
          <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        :root{--transition-theme:0.4s cubic-bezier(0.4,0,0.2,1);}

        [data-theme="dark"]{
          --bg:#050507;--bg2:#0d0d12;--bg3:#13131a;--bg4:#1c1c26;
          --red:#e8193c;--red-dark:#a01028;
          --red-glow:rgba(232,25,60,0.18);--red-dim:rgba(232,25,60,0.08);
          --text:#f5f5f7;--text2:#8a8a9a;--text3:#5a5a6a;
          --border:#2a2a35;--border2:rgba(232,25,60,0.2);
          --card-bg:#13131a;--shadow:rgba(0,0,0,0.4);
          --check:#22c55e;--cross:#3a3a4a;
          --toggle-bg:#1c1c26;--toggle-border:#2a2a35;
          --stroke-color:rgba(245,245,247,0.15);
        }
        [data-theme="light"]{
          --bg:#fafafa;--bg2:#f0f0f5;--bg3:#e8e8f0;--bg4:#dddde8;
          --red:#d0102e;--red-dark:#a01028;
          --red-glow:rgba(208,16,46,0.12);--red-dim:rgba(208,16,46,0.07);
          --text:#0f0f14;--text2:#5a5a6a;--text3:#9a9aaa;
          --border:#d8d8e4;--border2:rgba(208,16,46,0.2);
          --card-bg:#ffffff;--shadow:rgba(0,0,0,0.08);
          --check:#16a34a;--cross:#d0d0dc;
          --toggle-bg:#e8e8f0;--toggle-border:#d0d0dc;
          --stroke-color:rgba(15,15,20,0.1);
        }

        body{
          font-family:'DM Sans',sans-serif;
          background:var(--bg);color:var(--text);
          overflow-x:hidden;
          transition:background var(--transition-theme),color var(--transition-theme);
        }

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.5;}}
        @keyframes gridShift{0%{background-position:0 0;}100%{background-position:60px 60px;}}

        /* HERO */
        .pr-hero{
          padding:140px 60px 80px;
          text-align:center;position:relative;overflow:hidden;
        }
        .pr-hero-bg{
          position:absolute;inset:0;
          background:radial-gradient(ellipse 60% 60% at 50% 30%,var(--red-glow) 0%,transparent 65%);
        }
        .pr-grid{
          position:absolute;inset:0;
          background-image:linear-gradient(var(--stroke-color) 1px,transparent 1px),
                           linear-gradient(90deg,var(--stroke-color) 1px,transparent 1px);
          background-size:60px 60px;
          animation:gridShift 20s linear infinite;
        }
        .pr-hero-inner{position:relative;z-index:2;}
        .pr-eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          background:var(--red-dim);border:1px solid var(--border2);
          border-radius:40px;padding:6px 16px;
          font-size:11px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;color:var(--red);margin-bottom:28px;
          animation:fadeUp 0.6s ease 0.1s both;
        }
        .pr-eyebrow::before{
          content:'';width:5px;height:5px;background:var(--red);
          border-radius:50%;animation:pulseDot 2s infinite;
        }
        .pr-h1{
          font-family:'Syne',sans-serif;
          font-size:clamp(36px,5vw,68px);
          font-weight:800;line-height:1.05;letter-spacing:-2px;
          margin-bottom:20px;color:var(--text);
          animation:fadeUp 0.7s ease 0.2s both;
        }
        .pr-h1 em{color:var(--red);font-style:normal;}
        .pr-hero-sub{
          font-size:17px;color:var(--text2);font-weight:300;
          max-width:520px;margin:0 auto 40px;line-height:1.7;
          animation:fadeUp 0.7s ease 0.3s both;
        }

        /* BILLING TOGGLE */
        .pr-billing-wrap{
          display:inline-flex;align-items:center;gap:0;
          background:var(--bg2);border:1px solid var(--border);
          border-radius:10px;padding:4px;margin-bottom:60px;
          animation:fadeUp 0.7s ease 0.4s both;
        }
        .pr-bill-btn{
          padding:9px 24px;border-radius:7px;font-size:13px;font-weight:600;
          cursor:pointer;border:none;font-family:'DM Sans',sans-serif;
          transition:background 0.2s,color 0.2s;
          background:transparent;color:var(--text2);
          display:flex;align-items:center;gap:8px;
        }
        .pr-bill-btn.active{background:var(--card-bg);color:var(--text);box-shadow:0 1px 4px var(--shadow);}
        .pr-save-badge{
          background:rgba(34,197,94,0.12);color:#16a34a;
          border-radius:20px;padding:2px 8px;font-size:10px;font-weight:700;
          letter-spacing:0.5px;
        }
        [data-theme="dark"] .pr-save-badge{color:#22c55e;background:rgba(34,197,94,0.15);}

        /* PLANS GRID */
        .pr-plans{
          max-width:1100px;margin:0 auto;
          padding:0 60px 80px;
          display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
        }
        .pr-plan-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:16px;overflow:hidden;
          transition:border-color 0.2s,transform 0.2s;
          animation:fadeUp 0.6s ease both;
          position:relative;
          display:flex;flex-direction:column;
        }
        .pr-plan-card:nth-child(1){animation-delay:0.1s;}
        .pr-plan-card:nth-child(2){animation-delay:0.2s;}
        .pr-plan-card:nth-child(3){animation-delay:0.3s;}
        .pr-plan-card:hover{transform:translateY(-4px);}
        .pr-plan-card.popular{
          border-color:var(--red);
          border-width:2px;
        }
        .pr-popular-badge{
          position:absolute;top:-1px;left:50%;transform:translateX(-50%);
          background:var(--red);color:#fff;
          font-size:10px;font-weight:700;letter-spacing:1.5px;
          padding:4px 16px;border-radius:0 0 8px 8px;
          white-space:nowrap;
        }
        .pr-plan-top{padding:28px 28px 24px;}
        .pr-plan-icon{font-size:28px;margin-bottom:14px;}
        .pr-plan-name{
          font-family:'Syne',sans-serif;font-size:20px;font-weight:800;
          color:var(--text);margin-bottom:6px;
        }
        .pr-plan-desc{font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:20px;}
        .pr-plan-price{
          display:flex;align-items:baseline;gap:4px;margin-bottom:4px;
        }
        .pr-price-num{
          font-family:'Syne',sans-serif;font-size:44px;font-weight:800;
          letter-spacing:-2px;color:var(--text);
        }
        .pr-price-num.red{color:var(--red);}
        .pr-price-suffix{font-size:14px;color:var(--text2);}
        .pr-price-original{
          font-size:13px;color:var(--text3);
          text-decoration:line-through;margin-left:4px;
        }
        .pr-plan-divider{height:1px;background:var(--border);margin:0 28px;}
        .pr-plan-features{padding:20px 28px;flex:1;}
        .pr-feature-item{
          display:flex;align-items:center;gap:10px;
          padding:7px 0;font-size:13px;color:var(--text2);
        }
        .pr-feature-check{
          width:18px;height:18px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;font-size:10px;font-weight:700;
        }
        .pr-feature-check.yes{background:rgba(34,197,94,0.12);color:var(--check);}
        .pr-feature-check.no{background:var(--bg2);color:var(--text3);}
        .pr-feature-text.included{color:var(--text);}
        .pr-feature-text.excluded{color:var(--text3);}
        .pr-plan-footer{padding:20px 28px 28px;}
        .pr-cta-btn{
          width:100%;padding:13px;border-radius:10px;
          font-size:14px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;text-decoration:none;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
          border:none;
        }
        .pr-cta-primary{
          background:var(--red);color:#fff;
        }
        .pr-cta-primary:hover{background:var(--red-dark);transform:translateY(-1px);box-shadow:0 6px 20px var(--red-glow);}
        .pr-cta-ghost{
          background:transparent;color:var(--text);
          border:1.5px solid var(--border);
        }
        .pr-cta-ghost:hover{border-color:var(--red);color:var(--red);}

        /* FEATURES TABLE */
        .pr-compare{max-width:1100px;margin:0 auto;padding:0 60px 80px;}
        .pr-compare-title{
          font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
          letter-spacing:-1px;color:var(--text);margin-bottom:8px;text-align:center;
        }
        .pr-compare-sub{
          font-size:15px;color:var(--text2);text-align:center;margin-bottom:40px;
        }
        .pr-compare-table{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:16px;overflow:hidden;width:100%;
          border-collapse:collapse;
        }
        .pr-compare-table th{
          padding:16px 24px;text-align:left;
          font-size:11px;font-weight:700;letter-spacing:1.5px;
          text-transform:uppercase;color:var(--text2);
          background:var(--bg2);border-bottom:1px solid var(--border);
        }
        .pr-compare-table th:not(:first-child){text-align:center;}
        .pr-compare-table td{
          padding:14px 24px;font-size:13px;
          border-bottom:1px solid var(--border);color:var(--text);
        }
        .pr-compare-table tr:last-child td{border-bottom:none;}
        .pr-compare-table td:not(:first-child){text-align:center;}
        .pr-compare-table .pr-col-highlight{
          background:rgba(232,25,60,0.03);
        }
        [data-theme="light"] .pr-compare-table .pr-col-highlight{
          background:rgba(208,16,46,0.03);
        }
        .pr-check-icon{font-size:16px;color:var(--check);}
        .pr-cross-icon{color:var(--cross);font-size:16px;}

       /* FAQ */
      .pr-faq{max-width:1100px;margin:0 auto;padding:0 60px 100px;}
      .pr-faq-title{
        font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
        letter-spacing:-1px;color:var(--text);margin-bottom:8px;text-align:center;
      }
      .pr-faq-sub{font-size:15px;color:var(--text2);text-align:center;margin-bottom:40px;}
      .pr-faq-item{
        background:var(--card-bg);border:1px solid var(--border);
        border-radius:12px;padding:20px 24px;margin-bottom:12px;
        cursor:pointer;transition:border-color 0.2s,background 0.2s;
        animation:fadeUp 0.5s ease both;
      }
      .pr-faq-item:hover{border-color:var(--border2);}
      .pr-faq-item.open{
        background:var(--red-dim);border-color:rgba(232,25,60,0.3);
      }
      .pr-faq-q{
        font-family:'Syne',sans-serif;font-size:15px;font-weight:700;
        color:var(--text);display:flex;align-items:center;justify-content:space-between;gap:12px;
      }
      .pr-faq-item.open .pr-faq-q{color:var(--red);}
      .pr-faq-icon{
        width:28px;height:28px;border-radius:50%;
        border:1.5px solid var(--border);
        display:flex;align-items:center;justify-content:center;
        font-size:16px;color:var(--text2);flex-shrink:0;
        transition:transform 0.2s,background 0.2s,border-color 0.2s,color 0.2s;
      }
      .pr-faq-item.open .pr-faq-icon{
        background:var(--red);border-color:var(--red);color:#fff;
        transform:rotate(45deg);
      }
      .pr-faq-a{
        font-size:13px;color:var(--text2);line-height:1.7;
        margin-top:12px;padding-top:12px;
        border-top:1px solid rgba(232,25,60,0.15);
      }

        /* SECTION LABEL */
        .pr-section-label{
          font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
          color:var(--red);margin-bottom:12px;
          display:flex;align-items:center;justify-content:center;gap:10px;
        }
        .pr-section-label::before,.pr-section-label::after{
          content:'';width:24px;height:1px;background:var(--red);
        }

        @media(max-width:1024px){
          .pr-hero{padding:120px 32px 70px;}
          .pr-plans{grid-template-columns:1fr 1fr;padding:0 32px 60px;gap:16px;}
          .pr-compare{padding:0 32px 60px;}
          .pr-faq{padding:0 32px 80px;}
        }
        @media(max-width:768px){
          .pr-hero{padding:100px 20px 60px;}
          .pr-plans{grid-template-columns:1fr;padding:0 20px 50px;gap:14px;}
          .pr-compare{padding:0 20px 50px;}
          .pr-faq{padding:0 20px 70px;}
          .pr-h1{font-size:clamp(28px,7vw,48px);letter-spacing:-1px;}
          .pr-hero-sub{font-size:15px;}
          .pr-compare-title,.pr-faq-title{font-size:24px;}
          .pr-compare-table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;}
          .pr-compare-table th,.pr-compare-table td{padding:10px 12px;font-size:11px;white-space:nowrap;}
        }
        @media(max-width:480px){
          .pr-hero{padding:90px 16px 50px;}
          .pr-plans{padding:0 16px 40px;}
          .pr-compare{padding:0 16px 40px;}
          .pr-faq{padding:0 16px 60px;}
          .pr-faq > div{grid-template-columns:1fr !important;}
          .pr-plan-top{padding:20px 20px 16px;}
          .pr-plan-features{padding:16px 20px;}
          .pr-plan-footer{padding:14px 20px 20px;}
          .pr-plan-divider{margin:0 20px;}
          .pr-price-num{font-size:36px;}
          .pr-section-label{font-size:10px;}
        }
      `}</style>

      {/* HERO */}
      <section className="pr-hero">
        <div className="pr-hero-bg" />
        <div className="pr-grid" />
        <div className="pr-hero-inner">
          <div className="pr-eyebrow" style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.1s forwards" }}>Simple Pricing</div>
          <h1 className="pr-h1">
            Plans that grow<br /><em>with your business</em>
          </h1>
          <p className="pr-hero-sub">
            No hidden fees. No surprises. Pick a plan and deploy your AI chatbot in minutes.
          </p>

          {/* Billing Toggle */}
          <div className="pr-billing-wrap">
            <button
              className={`pr-bill-btn${billing === "monthly" ? " active" : ""}`}
              onClick={() => setBilling("monthly")}
            >Monthly</button>
            <button
              ref={switchRef}
              className={`pr-bill-btn${billing === "yearly" ? " active" : ""}`}
              onClick={() => {
                setBilling("yearly");
                if (switchRef.current) {
                  const rect = switchRef.current.getBoundingClientRect();
                  confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: {
                      x: rect.left / window.innerWidth,
                      y: rect.top / window.innerHeight,
                    },
                    colors: ["#e8193c", "#ff6b6b", "#ffffff", "#a01028"],
                    ticks: 200,
                    gravity: 1.2,
                    decay: 0.94,
                    startVelocity: 30,
                    shapes: ["circle"],
                  });
                }
              }}
            >
              Yearly
              <span className="pr-save-badge">SAVE 20%</span>
            </button>
          </div>
          </div>
      </section>

      {/* PLANS */}
      <div className="pr-plans">
        {plans.map((plan, i) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const originalPrice = billing === "yearly" ? plan.monthlyPrice : null;
          const isPopular = plan.id === "pro";

          return (
            <div
              key={plan.id}
              className={`pr-plan-card${isPopular ? " popular" : ""}`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {isPopular && <div className="pr-popular-badge">MOST POPULAR</div>}

              <div className="pr-plan-top" style={{ paddingTop: isPopular ? 36 : 28 }}>
                <div className="pr-plan-icon">{plan.icon}</div>
                <div className="pr-plan-name">{plan.name}</div>
                <div className="pr-plan-desc">{plan.description}</div>
                <div className="pr-plan-price">
                  {price !== null ? (
                    <>
                      <span className={`pr-price-num${isPopular ? " red" : ""}`}>
                      <NumberFlow
                        value={price ?? 0}
                        format={{ style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        transformTiming={{ duration: 500, easing: "ease-out" }}
                        willChange
                      />
                    </span>
                      <span className="pr-price-suffix">/mo</span>
                      {originalPrice && billing === "yearly" && (
                        <span className="pr-price-original">${originalPrice}</span>
                      )}
                    </>
                  ) : (
                    <span className="pr-price-num" style={{ fontSize: 32 }}>Custom</span>
                  )}
                </div>
                {billing === "yearly" && price && (
                  <div style={{ fontSize: 12, color: "var(--check)", fontWeight: 600, marginTop: 4 }}>
                    ✓ Billed ${price * 12}/year
                  </div>
                )}
              </div>

              <div className="pr-plan-divider" />

              <div className="pr-plan-features">
                {plan.features.map((f, fi) => (
                  <div key={fi} className="pr-feature-item">
                    <div className={`pr-feature-check${f.included ? " yes" : " no"}`}>
                      {f.included ? "✓" : "×"}
                    </div>
                    <span className={`pr-feature-text${f.included ? " included" : " excluded"}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pr-plan-footer">
                {plan.id === "enterprise" ? (
                  <button
                className="pr-cta-btn pr-cta-ghost"
                onClick={() => {
                  document.getElementById('custom-calculator')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Custom Plan →
              </button>
  ) : (
    <button
      className={`pr-cta-btn${isPopular ? " pr-cta-primary" : " pr-cta-ghost"}`}
      onClick={() => handleCheckout(
        plan.id === "starter"
          ? "pri_01kspqde8v2maxywwembqdmsga"
          : "pri_01kspqg84gf70w8z5nbjyc7az9"
      )}
    >
      {plan.cta} {isPopular ? "→" : ""}
    </button>
  )}
</div>
            </div>
          );
        })}
      </div>
      {/* COMPARE TABLE */}
      <div className="pr-compare">
        <div className="pr-section-label">Compare Plans</div>
        <div className="pr-compare-title">Everything side by side</div>
        <div className="pr-compare-sub">See exactly what's included in each plan.</div>

        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
        <table className="pr-compare-table" style={{ minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Feature</th>
              <th>Trial</th>
              <th>Starter</th>
              <th className="pr-col-highlight">Pro</th>
              <th>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Chatbots", trial: "1", starter: "1", pro: "5", enterprise: "Unlimited" },
              { label: "Messages / month", trial: "100", starter: "500", pro: "5,000", enterprise: "Unlimited" },
              { label: "Duration", trial: "7 days", starter: "Monthly", pro: "Monthly", enterprise: "Monthly" },
              { label: "Lead capture", trial: "✓", starter: "✓", pro: "✓", enterprise: "✓" },
              { label: "Conversation history", trial: "✓", starter: "✓", pro: "✓", enterprise: "✓" },
              { label: "Analytics dashboard", trial: "—", starter: "—", pro: "✓", enterprise: "✓" },
              { label: "Custom branding", trial: "—", starter: "—", pro: "✓", enterprise: "✓" },
              { label: "Custom OpenAI key", trial: "—", starter: "—", pro: "✓", enterprise: "✓" },
              { label: "API access", trial: "—", starter: "—", pro: "—", enterprise: "✓" },
              { label: "Dedicated support", trial: "—", starter: "—", pro: "—", enterprise: "✓" },
              { label: "SLA guarantee", trial: "—", starter: "—", pro: "—", enterprise: "✓" },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{row.label}</td>
                <td style={{ color: "var(--text2)", fontSize: 12 }}>{row.trial === "✓" ? <span className="pr-check-icon">✓</span> : row.trial === "—" ? <span className="pr-cross-icon">—</span> : row.trial}</td>
                <td>{row.starter === "✓" ? <span className="pr-check-icon">✓</span> : row.starter === "—" ? <span className="pr-cross-icon">—</span> : row.starter}</td>
                <td className="pr-col-highlight">{row.pro === "✓" ? <span className="pr-check-icon">✓</span> : row.pro === "—" ? <span className="pr-cross-icon">—</span> : <strong style={{ color: "var(--red)" }}>{row.pro}</strong>}</td>
                <td>{row.enterprise === "✓" ? <span className="pr-check-icon">✓</span> : row.enterprise === "—" ? <span className="pr-cross-icon">—</span> : row.enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="pr-faq" id="faq" style={{ scrollMarginTop: '90px' }}>
        <div className="pr-section-label">FAQ</div>
        <div className="pr-faq-title">Common questions</div>
        <div className="pr-faq-sub">Everything you need to know before getting started.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {faqs.map((faq, i) => (
          <div key={i} className={`pr-faq-item${openFaq === i ? " open" : ""}`} style={{ animationDelay: `${i * 0.08}s`, marginBottom: 0, opacity: 0, animation: `fadeUp 0.5s ease ${i * 0.08}s forwards` }}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}>
            <div className="pr-faq-q">
              {faq.q}
              <span className="pr-faq-icon">+</span>
            </div>
            {openFaq === i && (
              <div className="pr-faq-a">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
      </div>
      {/* CUSTOM CALCULATOR */}
<div id="custom-calculator" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 60px 100px' }}>
  <div className="pr-section-label">Custom Plan</div>
  <div style={{
    fontFamily: 'var(--font-syne, Syne)',
    fontSize: 'clamp(24px, 3vw, 36px)',
    fontWeight: 800,
    letterSpacing: '-1px',
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: 8,
  }}>Build your own plan</div>
  <div style={{ fontSize: 15, color: 'var(--text2)', textAlign: 'center', marginBottom: 48 }}>
    Only pay for what you need — scale up or down anytime.
  </div>

<div className="calc-grid" style={{
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: 24,
    alignItems: 'start',
  }}>
    {/* LEFT — Controls */}
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '36px',
    }}>
      {/* Chatbots Slider */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Chatbots</div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--red)',
            letterSpacing: '-1px',
          }}>{calcBots}</div>
        </div>
        <input
          type="range" min={1} max={10} step={1} value={calcBots}
          onChange={e => setCalcBots(Number(e.target.value))}
          style={{
            width: '100%', height: 4, appearance: 'none',
            background: `linear-gradient(to right, var(--red) ${(calcBots - 1) / 9 * 100}%, var(--bg3) ${(calcBots - 1) / 9 * 100}%)`,
            borderRadius: 2, outline: 'none', cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text3)' }}>
          <span>1</span><span>10</span>
        </div>
      </div>

      {/* Messages Slider */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Messages / month</div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--red)',
            letterSpacing: '-1px',
          }}>{calcMsgs >= 1000 ? `${calcMsgs / 1000}k` : calcMsgs}</div>
        </div>
        <input
          type="range" min={500} max={50000} step={500} value={calcMsgs}
          onChange={e => setCalcMsgs(Number(e.target.value))}
          style={{
            width: '100%', height: 4, appearance: 'none',
            background: `linear-gradient(to right, var(--red) ${(calcMsgs - 500) / 49500 * 100}%, var(--bg3) ${(calcMsgs - 500) / 49500 * 100}%)`,
            borderRadius: 2, outline: 'none', cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text3)' }}>
          <span>500</span><span>50k</span>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 16 }}>Add-ons</div>
        {[
          { id: 'analytics', label: 'Advanced Analytics', desc: 'Conversion tracking, heatmaps, reports', price: 12 },
          { id: 'whitelabel', label: 'White Label Branding', desc: 'Remove JZAI branding completely', price: 15 },
          { id: 'priority', label: 'Priority Support', desc: '24hr response, dedicated agent', price: 10 },
          { id: 'webhooks', label: 'Webhook Integrations', desc: 'Zapier, Slack, CRM connect', price: 8 },
        ].map((addon) => {
          const selected = calcAddons.includes(addon.id);
          return (
            <div
              key={addon.id}
              onClick={() => setCalcAddons(prev =>
                prev.includes(addon.id) ? prev.filter(a => a !== addon.id) : [...prev, addon.id]
              )}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10, marginBottom: 8,
                border: `1px solid ${selected ? 'rgba(232,25,60,0.3)' : 'var(--border)'}`,
                background: selected ? 'var(--red-dim)' : 'var(--bg2)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `1.5px solid ${selected ? 'var(--red)' : 'var(--border)'}`,
                  background: selected ? 'var(--red)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s',
                }}>
                  {selected && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected ? 'var(--red)' : 'var(--text)' }}>{addon.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{addon.desc}</div>
                </div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: selected ? 'var(--red)' : 'var(--text2)',
                whiteSpace: 'nowrap', marginLeft: 12,
              }}>+${addon.price}/mo</div>
            </div>
          );
        })}
      </div>
    </div>

    {/* RIGHT — Price Summary */}
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'sticky',
      top: 100,
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--red)',
        padding: '28px 28px 24px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Your custom plan</div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: '-2px',
          color: '#fff',
          lineHeight: 1,
        }}>
          ${(() => {
            const base = 15;
            const botCost = (calcBots - 1) * 10;
            const msgCost = calcMsgs <= 500 ? 0 : Math.round((calcMsgs - 500) / 1000) * 5;
            const addonTotal = 
            (calcAddons.includes('analytics') ? 12 : 0)
            + (calcAddons.includes('whitelabel') ? 15 : 0)
            + (calcAddons.includes('priority') ? 10 : 0)
            + (calcAddons.includes('webhooks') ? 8 : 0);
          return base + botCost + msgCost + addonTotal;
          })()}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>/month</div>
      </div>

      {/* Breakdown */}
      <div style={{ padding: '24px 28px' }}>
        {[
          { label: 'Base', val: '$15', always: true },
          { label: `${calcBots} chatbot${calcBots > 1 ? 's' : ''}`, val: calcBots === 1 ? 'Included' : `+$${(calcBots - 1) * 10}`, always: true },
          { label: `${calcMsgs >= 1000 ? calcMsgs / 1000 + 'k' : calcMsgs} messages`, val: calcMsgs <= 500 ? 'Included' : `+$${Math.round((calcMsgs - 500) / 1000) * 5}`, always: true },
          ...(calcAddons.includes('analytics') ? [{ label: 'Advanced Analytics', val: '+$12', always: false }] : []),
          ...(calcAddons.includes('whitelabel') ? [{ label: 'White Label', val: '+$15', always: false }] : []),
          ...(calcAddons.includes('priority') ? [{ label: 'Priority Support', val: '+$10', always: false }] : []),
          ...(calcAddons.includes('webhooks') ? [{ label: 'Webhooks', val: '+$8', always: false }] : []),
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: 13,
          }}>
            <span style={{ color: 'var(--text2)' }}>{row.label}</span>
            <span style={{ fontWeight: 600, color: row.val === 'Included' ? '#22c55e' : 'var(--text)' }}>{row.val}</span>
          </div>
        ))}

        
         <a href={`mailto:hello@jzai.store?subject=Custom Plan Quote&body=Chatbots: ${calcBots}%0AMessages: ${calcMsgs}%0AAdd-ons: ${calcAddons.join(', ') || 'None'}%0AEstimated: $${
            15 + (calcBots - 1) * 10
            + (calcMsgs <= 500 ? 0 : Math.round((calcMsgs - 500) / 1000) * 5)
            + (calcAddons.includes('analytics') ? 12 : 0)
            + (calcAddons.includes('whitelabel') ? 15 : 0)
            + (calcAddons.includes('priority') ? 10 : 0)
            + (calcAddons.includes('webhooks') ? 8 : 0)
          }/mo`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', marginTop: 24,
            background: 'var(--red)', color: '#fff',
            padding: '13px', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          Get Quote →
        </a>

        <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 12 }}>
          We'll reply within 24 hours
        </div>
      </div>
    </div>
  </div>

  {/* Mobile responsive */}
  <style>{`
    @media(max-width: 768px) {
      .calc-grid { grid-template-columns: 1fr !important; }
    }
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--red);
      cursor: pointer;
      border: 2px solid var(--card-bg);
      box-shadow: 0 0 0 1px var(--red);
    }
    input[type=range]::-moz-range-thumb {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--red);
      cursor: pointer;
      border: 2px solid var(--card-bg);
    }
  `}</style>
</div>
      <Footer />
    </>
  );
}
