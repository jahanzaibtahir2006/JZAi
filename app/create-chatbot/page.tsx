"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface Plan {
  name: string;
  price: string;
}

interface UploadedFile {
  name: string;
  id: string;
}

interface FormState {
  botName: string;
  industry: string;
  botLang: string;
  websiteUrl: string;
  brandColor: string;
  businessDesc: string;
  faqs: string;
  knowledgeUrl: string;
  greetMsg: string;
  tone: string;
  role: string;
  leadFields: string[];
  fallbackMsg: string;
  notifyEmail: string;
  fullName: string;
  company: string;
}

interface SuccessData {
  botName: string;
  botId: string;
  plan: string;
  email: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: "Bot Identity" },
  { num: 2, label: "Knowledge Base" },
  { num: 3, label: "Behavior & Tone" },
  { num: 4, label: "Plan & Deploy" },
];

const COLOR_SWATCHES = [
  { hex: "#e8193c", title: "JZAI Red" },
  { hex: "#6366f1", title: "Indigo" },
  { hex: "#0ea5e9", title: "Sky" },
  { hex: "#10b981", title: "Emerald" },
  { hex: "#f59e0b", title: "Amber" },
  { hex: "#ec4899", title: "Pink" },
  { hex: "#8b5cf6", title: "Violet" },
];

const TONE_CHIPS = ["Professional", "Friendly", "Casual", "Formal", "Enthusiastic", "Concise"];
const ROLE_CHIPS = ["Lead Capture", "Customer Support", "Sales Assistant", "FAQ Bot", "Booking Assistant"];
const LEAD_CHIPS = ["Name", "Email", "Service Interest", "Budget", "Phone", "Company", "Message"];

const INDUSTRIES = [
  "E-Commerce", "SaaS / Tech", "Healthcare", "Education",
  "Real Estate", "Legal", "Finance", "Agency", "Other",
];
const LANGUAGES = ["English", "Urdu", "Arabic", "Hindi", "Spanish", "French", "German"];

const PLANS = [
  {
    id: "starter",
    icon: "🚀",
    name: "Starter",
    price: "$29",
    priceSuffix: "/mo",
    features: ["500 msgs/mo", "1 chatbot", "Lead capture", "Email support"],
    badge: null,
  },
  {
    id: "pro",
    icon: "⚡",
    name: "Pro",
    price: "$79",
    priceSuffix: "/mo",
    features: ["5,000 msgs/mo", "5 chatbots", "Analytics dashboard", "Priority support"],
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    icon: "🏢",
    name: "Enterprise",
    price: "Custom",
    priceSuffix: "",
    features: ["Unlimited msgs", "Unlimited bots", "Custom Worker", "Dedicated support"],
    badge: null,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
// FIX 1: getInitials — safe against empty/undefined name, no crash on empty words
function getInitials(name: string): string {
  if (!name || !name.trim()) return "JZ";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "JZ";
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function CreateChatbot() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentStep, setCurrentStep] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>({ name: "Starter", price: "$29/mo" });
  const [dragOver, setDragOver] = useState(false);

  // FIX 2: per-step validation errors
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    botName: "",
    industry: "",
    botLang: "English",
    websiteUrl: "",
    brandColor: "#e8193c",
    businessDesc: "",
    faqs: "",
    knowledgeUrl: "",
    greetMsg: "",
    tone: "Professional",
    role: "Lead Capture",
    leadFields: ["Name", "Email", "Service Interest", "Budget"],
    fallbackMsg: "",
    notifyEmail: "",
    fullName: "",
    company: "",
  });

  // Theme
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (stepErrors[key]) {
      setStepErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const toggleLeadField = (field: string) => {
    setForm((prev) => ({
      ...prev,
      leadFields: prev.leadFields.includes(field)
        ? prev.leadFields.filter((f) => f !== field)
        : [...prev.leadFields, field],
    }));
  };

  const goStep = (n: number) => {
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FIX 3: step-level validation before advancing
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!form.botName.trim()) errors.botName = "Bot name is required.";
      if (!form.industry) errors.industry = "Please select an industry.";
    }
    if (step === 3) {
      if (!form.greetMsg.trim()) errors.greetMsg = "Greeting message is required.";
    }
    if (step === 4) {
      if (!form.notifyEmail.trim()) errors.notifyEmail = "Notify email is required.";
      if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (nextStep: number) => {
    if (validateStep(currentStep)) goStep(nextStep);
  };

  // FIX 4: handleFiles — skip duplicates by name
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setUploadedFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const newFiles: UploadedFile[] = Array.from(files)
        .filter((f) => !existingNames.has(f.name))
        .map((f) => ({
          name: f.name,
          id: Math.random().toString(36).substr(2, 6),
        }));
      return [...prev, ...newFiles];
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // FIX 5: submitForm — try/catch + finally, real botId from API, error shown to user
  const submitForm = async () => {
    if (!validateStep(4)) return;
    setDeploying(true);
    setDeployError(null);
    try {
      const userStr = localStorage.getItem("jzai_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) {
  setDeployError("Please login first.");
  setDeploying(false);
  return;
}
      const res = await fetch("https://jzai-saas.jahanzaibtahir2006.workers.dev/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: form.botName || "My Chatbot",
          industry: form.industry,
          color: form.brandColor,
          language: form.botLang,
          plan: selectedPlan.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || `Server error (${res.status})`);
      }
      // FIX 6: use real bot ID from API response, fallback to generated only if absent
      const botId = data?.id ? String(data.id) : ("jzai_" + Math.random().toString(36).substr(2, 8));
      setSuccess({
        botName: form.botName || "My Chatbot",
        botId,
        plan: `${selectedPlan.name} — ${selectedPlan.price}`,
        email: form.notifyEmail || "—",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setDeployError(message);
    } finally {
      setDeploying(false);
    }
  };

  const previewName = form.botName || "My Chatbot";
  const previewInitials = getInitials(previewName);
  const previewGreet = form.greetMsg || "Hey! 👋 How can I help you today?";

  const planPriceDisplay = (() => {
    const p = PLANS.find((p) => p.name === selectedPlan.name);
    if (!p) return "$29";
    return p.price === "Custom" ? "Custom" : p.price;
  })();

  return (
    <>
      {/* ── Global Styles ── */}
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
          --border:#2a2a35;--border2:rgba(232,25,60,0.12);
          --nav-bg:rgba(5,5,7,0.80);--nav-bg-s:rgba(5,5,7,0.97);
          --card-bg:#13131a;--card-hover:#0d0d12;
          --toggle-bg:#1c1c26;--toggle-border:#2a2a35;
          --grid-line:rgba(232,25,60,0.04);
          --stroke-text-color:rgba(245,245,247,0.25);
          --footer-bg:#13131a;--shadow:rgba(0,0,0,0.4);
          --error:#ff4d4f;--error-dim:rgba(255,77,79,0.1);
        }
        [data-theme="light"]{
          --bg:#fafafa;--bg2:#f0f0f5;--bg3:#e8e8f0;--bg4:#dddde8;
          --red:#d0102e;--red-dark:#a01028;
          --red-glow:rgba(208,16,46,0.12);--red-dim:rgba(208,16,46,0.07);
          --text:#0f0f14;--text2:#5a5a6a;--text3:#9a9aaa;
          --border:#d8d8e4;--border2:rgba(208,16,46,0.15);
          --nav-bg:rgba(250,250,250,0.85);--nav-bg-s:rgba(250,250,250,0.98);
          --card-bg:#ffffff;--card-hover:#f5f5fc;
          --toggle-bg:#e8e8f0;--toggle-border:#d0d0dc;
          --grid-line:rgba(208,16,46,0.05);
          --stroke-text-color:rgba(15,15,20,0.2);
          --footer-bg:#f0f0f5;--shadow:rgba(0,0,0,0.08);
          --error:#cc0000;--error-dim:rgba(204,0,0,0.07);
        }

        body{
          font-family:'DM Sans',sans-serif;
          background:var(--bg);color:var(--text);
          overflow-x:hidden;
          transition:background var(--transition-theme),color var(--transition-theme);
        }

        @keyframes gridShift{0%{background-position:0 0;}100%{background-position:60px 60px;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.5;}}
        @keyframes typingBounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}

        .cc-nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:22px 60px;
          background:var(--nav-bg);
          backdrop-filter:blur(20px);
          border-bottom:1px solid var(--border2);
          transition:padding 0.3s,background var(--transition-theme),border-color var(--transition-theme);
          gap:16px;
        }
        .cc-nav.scrolled{padding:14px 60px;background:var(--nav-bg-s);}
        .cc-nav-logo{
          font-family:'Syne',sans-serif;font-size:22px;font-weight:800;
          letter-spacing:-0.5px;color:var(--text);text-decoration:none;white-space:nowrap;
        }
        .cc-nav-logo span{color:var(--red);}
        .cc-nav-links{display:flex;gap:32px;align-items:center;}
        .cc-nav-links a{
          color:var(--text2);text-decoration:none;font-size:14px;
          font-weight:500;letter-spacing:0.3px;
          transition:color 0.2s;position:relative;
        }
        .cc-nav-links a::after{
          content:'';position:absolute;bottom:-4px;left:0;
          width:0;height:1px;background:var(--red);transition:width 0.3s;
        }
        .cc-nav-links a:hover{color:var(--text);}
        .cc-nav-links a:hover::after{width:100%;}
        .cc-nav-links a.active{color:var(--red);}
        .cc-nav-links a.active::after{width:100%;}
        .cc-nav-right{display:flex;align-items:center;gap:16px;}
        .cc-nav-cta{
          background:var(--red);color:#fff !important;
          padding:9px 22px;border-radius:6px;font-weight:600 !important;
          font-size:14px;letter-spacing:0.4px;white-space:nowrap;
          transition:background 0.2s,transform 0.2s !important;
          text-decoration:none;
        }
        .cc-nav-cta:hover{background:var(--red-dark) !important;transform:translateY(-1px);}

        .cc-toggle{
          position:relative;width:52px;height:28px;
          background:var(--toggle-bg);border:1.5px solid var(--toggle-border);
          border-radius:14px;cursor:pointer;
          transition:background var(--transition-theme),border-color var(--transition-theme);
          flex-shrink:0;outline:none;display:flex;align-items:center;padding:0 3px;
        }
        .cc-toggle-thumb{
          width:20px;height:20px;border-radius:50%;
          background:var(--red);display:flex;align-items:center;justify-content:center;
          font-size:11px;
          transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 2px 6px var(--shadow);user-select:none;
        }
        [data-theme="light"] .cc-toggle-thumb{transform:translateX(24px);}

        .cc-hero{
          min-height:60vh;display:flex;align-items:center;
          position:relative;overflow:hidden;padding:140px 60px 80px;
        }
        .cc-hero-bg{
          position:absolute;inset:0;
          background:radial-gradient(ellipse 70% 70% at 60% 50%,var(--red-glow) 0%,transparent 65%),
                     radial-gradient(ellipse 40% 40% at 20% 80%,rgba(232,25,60,0.04) 0%,transparent 60%);
        }
        .cc-grid-overlay{
          position:absolute;inset:0;
          background-image:linear-gradient(var(--grid-line) 1px,transparent 1px),
                           linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);
          background-size:60px 60px;
          animation:gridShift 20s linear infinite;
        }
        .cc-hero-content{position:relative;z-index:2;max-width:1100px;margin:0 auto;width:100%;}
        .cc-eyebrow{
          display:inline-flex;align-items:center;gap:10px;
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.25);
          border-radius:40px;padding:7px 18px;
          font-size:12px;font-weight:600;letter-spacing:1.5px;
          text-transform:uppercase;color:var(--red);margin-bottom:32px;
          animation:fadeUp 0.8s ease 0.2s both;
        }
        .cc-eyebrow::before{
          content:'';width:6px;height:6px;background:var(--red);
          border-radius:50%;animation:pulseDot 2s ease infinite;
        }
        .cc-h1{
          font-family:'Syne',sans-serif;
          font-size:clamp(42px,6vw,82px);
          font-weight:800;line-height:1.02;letter-spacing:-2px;margin-bottom:24px;
          animation:fadeUp 0.9s ease 0.4s both;color:var(--text);
        }
        .cc-h1 .line-red{color:var(--red);display:block;}
        .cc-h1 .stroke-text{
          -webkit-text-stroke:1px var(--stroke-text-color);
          color:transparent;display:block;
        }
        .cc-hero-desc{
          font-size:18px;font-weight:300;color:var(--text2);
          max-width:560px;line-height:1.7;margin-bottom:44px;
          animation:fadeUp 0.9s ease 0.6s both;
        }

        .cc-steps-bar{max-width:1100px;margin:0 auto;padding:0 60px 60px;}
        .cc-steps-row{
          display:flex;align-items:center;
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;overflow:hidden;
        }
        .cc-step-pill{
          flex:1;padding:18px 24px;
          display:flex;align-items:center;gap:12px;
          border-right:1px solid var(--border);
          transition:background 0.2s;
        }
        .cc-step-pill:last-child{border-right:none;}
        .cc-step-pill.active{background:var(--red-dim);border-right-color:rgba(232,25,60,0.2);}
        .cc-step-num{
          width:28px;height:28px;border-radius:50%;
          background:var(--bg2);border:1px solid var(--border);
          font-family:'Syne',sans-serif;font-size:12px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          color:var(--text2);flex-shrink:0;
          transition:background 0.2s,border-color 0.2s,color 0.2s;
        }
        .cc-step-pill.active .cc-step-num{background:var(--red);border-color:var(--red);color:#fff;}
        .cc-step-pill.done .cc-step-num{background:var(--red-dim);border-color:rgba(232,25,60,0.3);color:var(--red);}
        .cc-step-label{font-size:13px;font-weight:500;color:var(--text2);}
        .cc-step-pill.active .cc-step-label{color:var(--text);}

        .cc-main{
          max-width:1100px;margin:0 auto;
          padding:0 60px 100px;
          display:grid;grid-template-columns:1fr 380px;gap:32px;
          align-items:start;
        }
        .cc-section-label{
          font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
          color:var(--red);margin-bottom:16px;
          display:flex;align-items:center;gap:10px;
        }
        .cc-section-label::before{content:'';width:24px;height:1px;background:var(--red);}

        .cc-form-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:16px;overflow:hidden;
        }
        .cc-form-section{padding:36px 36px 0;}
        .cc-form-title{
          font-family:'Syne',sans-serif;font-size:22px;font-weight:800;
          letter-spacing:-0.5px;margin-bottom:8px;color:var(--text);
        }
        .cc-form-sub{font-size:14px;color:var(--text2);margin-bottom:32px;font-weight:300;line-height:1.6;}

        .cc-field{margin-bottom:22px;}
        .cc-label{
          font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;
          color:var(--text2);margin-bottom:10px;display:block;
        }
        .cc-label .req{color:var(--red);}
        .cc-input,.cc-textarea,.cc-select{
          width:100%;background:var(--bg2);border:1px solid var(--border);
          border-radius:8px;padding:13px 16px;
          font-size:14px;font-family:'DM Sans',sans-serif;
          color:var(--text);outline:none;
          transition:border-color 0.2s,box-shadow 0.2s,background var(--transition-theme);
        }
        .cc-input:focus,.cc-textarea:focus,.cc-select:focus{
          border-color:var(--red);box-shadow:0 0 0 3px var(--red-dim);
        }
        .cc-input.error,.cc-select.error{
          border-color:var(--error);box-shadow:0 0 0 3px var(--error-dim);
        }
        .cc-input::placeholder,.cc-textarea::placeholder{color:var(--text3);}
        .cc-textarea{resize:none;min-height:110px;}
        .cc-select{
          cursor:pointer;appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 14px center;
          padding-right:40px;
        }
        .cc-hint{font-size:12px;color:var(--text3);margin-top:7px;}
        .cc-error-msg{font-size:12px;color:var(--error);margin-top:6px;font-weight:500;}
        .cc-input-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

        .cc-color-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:2px;}
        .cc-swatch{
          width:36px;height:36px;border-radius:50%;cursor:pointer;
          border:2px solid transparent;transition:transform 0.15s,border-color 0.15s;
          flex-shrink:0;
        }
        .cc-swatch:hover{transform:scale(1.12);}
        .cc-swatch.selected{border-color:var(--text);}
        .cc-swatch-custom{
          width:36px;height:36px;border-radius:50%;
          border:1.5px dashed var(--border);
          background:var(--bg2);cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;color:var(--text2);
          transition:border-color 0.2s;
        }
        .cc-swatch-custom:hover{border-color:var(--red);}

        .cc-chip-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px;}
        .cc-chip{
          padding:7px 16px;border-radius:20px;
          border:1px solid var(--border);background:var(--bg2);
          font-size:12px;font-weight:600;letter-spacing:0.3px;
          color:var(--text2);cursor:pointer;
          transition:border-color 0.2s,color 0.2s,background 0.2s;
        }
        .cc-chip:hover{border-color:rgba(232,25,60,0.3);color:var(--text);}
        .cc-chip.selected{background:var(--red-dim);border-color:rgba(232,25,60,0.4);color:var(--red);}

        .cc-upload-zone{
          border:1.5px dashed var(--border);border-radius:10px;
          padding:28px;text-align:center;cursor:pointer;
          transition:border-color 0.2s,background 0.2s;
          background:var(--bg2);
        }
        .cc-upload-zone:hover,.cc-upload-zone.dragover{border-color:var(--red);background:var(--red-dim);}
        .cc-upload-ico{font-size:28px;margin-bottom:10px;}
        .cc-upload-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;}
        .cc-upload-sub{font-size:12px;color:var(--text2);}
        .cc-file-list{margin-top:12px;display:flex;flex-direction:column;gap:6px;}
        .cc-file-item{
          background:var(--bg3);border:1px solid var(--border);
          border-radius:6px;padding:8px 12px;
          display:flex;align-items:center;justify-content:space-between;
          font-size:12px;color:var(--text2);
        }
        .cc-file-remove{
          background:none;border:none;color:var(--text3);
          cursor:pointer;font-size:16px;line-height:1;
          transition:color 0.2s;
        }
        .cc-file-remove:hover{color:var(--red);}

        .cc-form-footer{
          padding:24px 36px;border-top:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
          gap:16px;margin-top:32px;
        }
        .cc-btn-back{
          background:transparent;border:1px solid var(--border);
          color:var(--text2);border-radius:8px;padding:11px 24px;
          font-size:14px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s,color 0.2s;
        }
        .cc-btn-back:hover{border-color:rgba(232,25,60,0.4);color:var(--text);}
        .cc-btn-next{
          background:var(--red);color:#fff;border:none;
          border-radius:8px;padding:12px 28px;
          font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;
          display:inline-flex;align-items:center;gap:10px;
          transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
          position:relative;overflow:hidden;
        }
        .cc-btn-next::before{
          content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          transition:left 0.5s;
        }
        .cc-btn-next:hover::before{left:100%;}
        .cc-btn-next:hover{background:var(--red-dark);transform:translateY(-1px);box-shadow:0 8px 28px var(--red-glow);}
        .cc-btn-next:disabled{opacity:0.7;cursor:not-allowed;transform:none;}
        .cc-btn-arrow{font-size:16px;transition:transform 0.2s;}
        .cc-btn-next:hover .cc-btn-arrow{transform:translateX(4px);}

        .cc-deploy-error{
          margin:0 36px 20px;padding:12px 16px;
          background:var(--error-dim);border:1px solid var(--error);
          border-radius:8px;font-size:13px;color:var(--error);
          display:flex;align-items:center;gap:8px;
        }

        .cc-plan-option{
          background:var(--bg2);border:1.5px solid var(--border);
          border-radius:12px;padding:20px;cursor:pointer;
          transition:border-color 0.2s,background 0.2s;
          position:relative;
        }
        .cc-plan-option.selected{border-color:var(--red);background:var(--card-hover);}
        .cc-plan-badge-tag{
          position:absolute;top:-10px;left:50%;transform:translateX(-50%);
          background:var(--red);color:#fff;font-size:10px;font-weight:700;
          padding:3px 12px;border-radius:10px;letter-spacing:0.5px;white-space:nowrap;
        }
        .cc-plan-icon{font-size:20px;margin-bottom:8px;}
        .cc-plan-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px;}
        .cc-plan-price{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--red);margin-bottom:12px;}
        .cc-plan-price span{font-size:12px;font-weight:400;color:var(--text2);}
        .cc-plan-features{font-size:12px;color:var(--text2);line-height:1.6;}

        /* Preview card */
        .cc-preview-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:16px;overflow:hidden;
          position:sticky;top:100px;
        }
        .cc-preview-header{
          padding:20px 24px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
        }
        .cc-preview-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);}
        .cc-preview-live{
          display:inline-flex;align-items:center;gap:6px;
          font-size:11px;font-weight:600;color:var(--red);
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.2);
          border-radius:20px;padding:4px 10px;
        }
        .cc-preview-live::before{
          content:'';width:5px;height:5px;background:var(--red);
          border-radius:50%;animation:pulseDot 2s infinite;
        }
        .cc-chat-preview{padding:20px;}
        .cc-chat-window{
          background:var(--bg2);border:1px solid var(--border);
          border-radius:12px;overflow:hidden;min-height:340px;
          display:flex;flex-direction:column;
        }
        .cc-chat-topbar{
          padding:12px 16px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;gap:10px;
        }
        .cc-chat-avatar{
          width:30px;height:30px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;flex-shrink:0;
          color:#fff;font-family:'Syne',sans-serif;
          transition:background 0.3s;
        }
        .cc-chat-bot-name{font-size:13px;font-weight:600;color:var(--text);}
        .cc-chat-bot-status{font-size:11px;color:var(--text2);}
        .cc-chat-dot{width:6px;height:6px;background:#22c55e;border-radius:50%;margin-left:auto;}
        .cc-chat-messages{flex:1;padding:16px;display:flex;flex-direction:column;gap:10px;}
        .cc-msg{max-width:85%;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.5;}
        .cc-msg-bot{
          background:var(--bg3);border:1px solid var(--border);
          color:var(--text);align-self:flex-start;border-radius:4px 10px 10px 10px;
        }
        .cc-msg-user{
          align-self:flex-end;border-radius:10px 4px 10px 10px;
          color:#fff;
        }
        .cc-typing{display:flex;gap:4px;align-items:center;padding:12px 14px;}
        .cc-typing span{
          width:6px;height:6px;background:var(--text3);border-radius:50%;
          animation:typingBounce 1.2s infinite;
        }
        .cc-typing span:nth-child(2){animation-delay:0.2s;}
        .cc-typing span:nth-child(3){animation-delay:0.4s;}
        .cc-chat-inputbar{
          padding:10px 14px;border-top:1px solid var(--border);
          display:flex;gap:8px;align-items:center;
        }
        .cc-chat-input-mock{
          flex:1;background:var(--bg3);border:1px solid var(--border);
          border-radius:6px;padding:8px 12px;font-size:12px;color:var(--text3);
        }
        .cc-chat-send-mock{
          width:30px;height:30px;border-radius:6px;
          display:flex;align-items:center;justify-content:center;
          font-size:14px;flex-shrink:0;color:#fff;transition:background 0.3s;
        }
        .cc-info-rows{padding:0 24px 24px;display:flex;flex-direction:column;gap:10px;margin-top:4px;}
        .cc-info-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 14px;background:var(--bg2);
          border:1px solid var(--border);border-radius:8px;
        }
        .cc-info-key{font-size:12px;color:var(--text2);}
        .cc-info-val{font-size:12px;font-weight:600;color:var(--text);}
        .cc-info-val.red{color:var(--red);}
        .cc-plan-badge-row{
          margin:0 24px 24px;padding:14px 18px;
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.2);
          border-radius:10px;display:flex;align-items:center;gap:12px;
        }
        .cc-plan-ico{font-size:22px;}
        .cc-plan-badge-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text);}
        .cc-plan-badge-sub{font-size:12px;color:var(--text2);margin-top:2px;}
        .cc-plan-badge-price{margin-left:auto;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--red);}

        /* Success */
        .cc-success{max-width:700px;margin:0 auto;padding:0 60px 100px;text-align:center;}
        .cc-success-icon{
          width:80px;height:80px;border-radius:50%;
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.2);
          display:flex;align-items:center;justify-content:center;
          font-size:32px;margin:0 auto 28px;
        }
        .cc-success-title{
          font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,44px);
          font-weight:800;letter-spacing:-1px;margin-bottom:16px;color:var(--text);
        }
        .cc-success-title em{color:var(--red);font-style:normal;}
        .cc-success-desc{font-size:16px;color:var(--text2);line-height:1.7;margin-bottom:40px;font-weight:300;}
        .cc-success-details{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;padding:28px;margin-bottom:32px;text-align:left;
        }
        .cc-detail-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 0;border-bottom:1px solid var(--border);
        }
        .cc-detail-row:last-child{border-bottom:none;}
        .cc-detail-key{font-size:13px;color:var(--text2);}
        .cc-detail-val{font-size:13px;font-weight:600;color:var(--text);font-family:'Syne',sans-serif;}
        .cc-detail-val.code{
          font-family:monospace;background:var(--bg3);
          border:1px solid var(--border);border-radius:4px;
          padding:3px 8px;color:var(--red);font-size:12px;
        }
        .cc-success-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
        .cc-btn-primary-l{
          background:var(--red);color:#fff;border:none;border-radius:8px;
          padding:13px 28px;font-size:14px;font-weight:600;
          cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;
          display:inline-flex;align-items:center;gap:8px;
          transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
        }
        .cc-btn-primary-l:hover{background:var(--red-dark);transform:translateY(-1px);box-shadow:0 8px 28px var(--red-glow);}
        .cc-btn-ghost-l{
          background:transparent;color:var(--text2);
          border:1px solid var(--border);border-radius:8px;
          padding:13px 28px;font-size:14px;font-weight:500;
          cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;
          transition:border-color 0.2s,color 0.2s;
        }
        .cc-btn-ghost-l:hover{border-color:rgba(232,25,60,0.4);color:var(--text);}

        footer.cc-footer{
          background:var(--footer-bg);border-top:1px solid var(--border);
          padding:30px 60px;display:flex;align-items:center;justify-content:space-between;
          transition:background var(--transition-theme),border-color var(--transition-theme);
        }
        .cc-footer-logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text);text-decoration:none;}
        .cc-footer-logo span{color:var(--red);}
        .cc-footer-text{font-size:12px;color:var(--text2);}

        @media(max-width:1000px){
          .cc-main{grid-template-columns:1fr;padding:0 24px 80px;}
          .cc-preview-card{position:static;}
          .cc-nav{padding:18px 24px;}
          .cc-nav.scrolled{padding:14px 24px;}
          .cc-hero{padding:120px 24px 60px;}
          .cc-steps-bar{padding:0 24px 40px;}
          footer.cc-footer{padding:24px;}
          .cc-success{padding:0 24px 80px;}
        }
        @media(max-width:600px){
          .cc-input-row{grid-template-columns:1fr;}
          .cc-steps-row{flex-direction:column;}
          .cc-step-pill{border-right:none;border-bottom:1px solid var(--border);}
          .cc-step-pill:last-child{border-bottom:none;}
          .cc-nav-links{display:none;}
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="cc-hero">
        <div className="cc-hero-bg" />
        <div className="cc-grid-overlay" />
        <div className="cc-hero-content">
          <div className="cc-eyebrow">AI Chatbot Builder</div>
          <h1 className="cc-h1">
            Build Your Own
            <span className="line-red">AI-Powered Chatbot</span>
            <span className="stroke-text">In Minutes.</span>
          </h1>
          <p className="cc-hero-desc">
            Train a custom AI chatbot on your business data — deploy it anywhere, capture leads
            automatically, and let it work 24/7 while you focus on what matters.
          </p>
        </div>
      </section>

      {!success && (
        <>
          {/* ── STEPS BAR ── */}
          <div className="cc-steps-bar">
            <div className="cc-steps-row">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className={`cc-step-pill${currentStep === s.num ? " active" : ""}${currentStep > s.num ? " done" : ""}`}
                >
                  <div className="cc-step-num">{currentStep > s.num ? "✓" : s.num}</div>
                  <span className="cc-step-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── MAIN WRAP ── */}
          <div className="cc-main">
            {/* FORM CARD */}
            <div className="cc-form-card">

              {/* ── STEP 1: Bot Identity ── */}
              {currentStep === 1 && (
                <div>
                  <div className="cc-form-section">
                    <div className="cc-section-label">Step 01</div>
                    <div className="cc-form-title">Give Your Bot an Identity</div>
                    <div className="cc-form-sub">Set up the basics — name, branding, and where your chatbot will live.</div>

                    <div className="cc-field">
                      <label className="cc-label">Bot Name <span className="req">*</span></label>
                      <input
                        className={`cc-input${stepErrors.botName ? " error" : ""}`}
                        type="text"
                        placeholder="e.g. Aria, SupportBot, JZ Assistant…"
                        value={form.botName}
                        onChange={(e) => updateForm("botName", e.target.value)}
                      />
                      {stepErrors.botName
                        ? <div className="cc-error-msg">⚠ {stepErrors.botName}</div>
                        : <div className="cc-hint">This is what users will see in the chat window.</div>
                      }
                    </div>

                    <div className="cc-input-row">
                      <div className="cc-field">
                        <label className="cc-label">Industry <span className="req">*</span></label>
                        <select
                          className={`cc-select${stepErrors.industry ? " error" : ""}`}
                          value={form.industry}
                          onChange={(e) => updateForm("industry", e.target.value)}
                        >
                          <option value="" disabled>Select industry</option>
                          {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                        </select>
                        {stepErrors.industry && <div className="cc-error-msg">⚠ {stepErrors.industry}</div>}
                      </div>
                      <div className="cc-field">
                        <label className="cc-label">Language</label>
                        <select
                          className="cc-select"
                          value={form.botLang}
                          onChange={(e) => updateForm("botLang", e.target.value)}
                        >
                          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Website URL</label>
                      <input
                        className="cc-input"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={form.websiteUrl}
                        onChange={(e) => updateForm("websiteUrl", e.target.value)}
                      />
                      <div className="cc-hint">We'll embed the chatbot widget here automatically.</div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Brand Color</label>
                      <div className="cc-color-row">
                        {COLOR_SWATCHES.map((s) => (
                          <div
                            key={s.hex}
                            className={`cc-swatch${form.brandColor === s.hex ? " selected" : ""}`}
                            style={{ background: s.hex }}
                            title={s.title}
                            onClick={() => updateForm("brandColor", s.hex)}
                          />
                        ))}
                        <div
                          className="cc-swatch-custom"
                          title="Custom color"
                          onClick={() => colorInputRef.current?.click()}
                        >＋</div>
                        <input
                          ref={colorInputRef}
                          type="color"
                          style={{ display: "none" }}
                          onChange={(e) => updateForm("brandColor", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="cc-form-footer">
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>Step 1 of 4</span>
                    {/* FIX: validate before advancing */}
                    <button className="cc-btn-next" onClick={() => handleNextStep(2)}>
                      Continue <span className="cc-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Knowledge Base ── */}
              {currentStep === 2 && (
                <div>
                  <div className="cc-form-section">
                    <div className="cc-section-label">Step 02</div>
                    <div className="cc-form-title">Train Your Bot</div>
                    <div className="cc-form-sub">Upload documents, paste your content, or add URLs — your bot will learn from all of it.</div>

                    <div className="cc-field">
                      <label className="cc-label">Business Description</label>
                      <textarea
                        className="cc-textarea"
                        placeholder="Describe what your business does, your products/services, target audience, USPs… The more detail, the smarter your bot."
                        value={form.businessDesc}
                        onChange={(e) => updateForm("businessDesc", e.target.value)}
                      />
                      <div className="cc-hint">Minimum 100 characters recommended for best results.</div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">FAQs / Common Questions</label>
                      <textarea
                        className="cc-textarea"
                        placeholder={"Q: What are your pricing plans?\nA: We offer Starter at $29/mo, Pro at $79/mo...\n\nQ: Do you offer refunds?\nA: Yes, within 7 days..."}
                        value={form.faqs}
                        onChange={(e) => updateForm("faqs", e.target.value)}
                      />
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Upload Documents</label>
                      <div
                        className={`cc-upload-zone${dragOver ? " dragover" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                      >
                        <div className="cc-upload-ico">📄</div>
                        <div className="cc-upload-title">Drop files here or click to upload</div>
                        <div className="cc-upload-sub">PDF, DOCX, TXT, CSV — max 10MB each</div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.docx,.txt,.csv"
                        style={{ display: "none" }}
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="cc-file-list">
                          {uploadedFiles.map((f) => (
                            <div key={f.id} className="cc-file-item">
                              <span>📄 {f.name}</span>
                              <button
                                className="cc-file-remove"
                                onClick={() => setUploadedFiles((prev) => prev.filter((x) => x.id !== f.id))}
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Knowledge URLs</label>
                      <input
                        className="cc-input"
                        type="url"
                        placeholder="https://yoursite.com/docs (we'll crawl this page)"
                        value={form.knowledgeUrl}
                        onChange={(e) => updateForm("knowledgeUrl", e.target.value)}
                      />
                      <div className="cc-hint">We'll auto-extract content from the provided URL.</div>
                    </div>
                  </div>

                  <div className="cc-form-footer">
                    <button className="cc-btn-back" onClick={() => goStep(1)}>← Back</button>
                    <button className="cc-btn-next" onClick={() => handleNextStep(3)}>
                      Continue <span className="cc-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Behavior ── */}
              {currentStep === 3 && (
                <div>
                  <div className="cc-form-section">
                    <div className="cc-section-label">Step 03</div>
                    <div className="cc-form-title">Behavior & Tone</div>
                    <div className="cc-form-sub">Define how your bot communicates — its personality, limits, and lead capture settings.</div>

                    <div className="cc-field">
                      <label className="cc-label">Greeting Message <span className="req">*</span></label>
                      <input
                        className={`cc-input${stepErrors.greetMsg ? " error" : ""}`}
                        type="text"
                        placeholder="Hey! 👋 I'm Aria — how can I help you today?"
                        value={form.greetMsg}
                        onChange={(e) => updateForm("greetMsg", e.target.value)}
                      />
                      {stepErrors.greetMsg && <div className="cc-error-msg">⚠ {stepErrors.greetMsg}</div>}
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Conversation Tone</label>
                      <div className="cc-chip-row">
                        {TONE_CHIPS.map((t) => (
                          <div
                            key={t}
                            className={`cc-chip${form.tone === t ? " selected" : ""}`}
                            onClick={() => updateForm("tone", t)}
                          >{t}</div>
                        ))}
                      </div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Bot Role / Focus</label>
                      <div className="cc-chip-row">
                        {ROLE_CHIPS.map((r) => (
                          <div
                            key={r}
                            className={`cc-chip${form.role === r ? " selected" : ""}`}
                            onClick={() => updateForm("role", r)}
                          >{r}</div>
                        ))}
                      </div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Lead Collection Fields</label>
                      <div className="cc-chip-row">
                        {LEAD_CHIPS.map((f) => (
                          <div
                            key={f}
                            className={`cc-chip${form.leadFields.includes(f) ? " selected" : ""}`}
                            onClick={() => toggleLeadField(f)}
                          >{f}</div>
                        ))}
                      </div>
                      <div className="cc-hint">Selected fields will be collected from leads automatically.</div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Fallback Message</label>
                      <input
                        className="cc-input"
                        type="text"
                        placeholder="I'm not sure about that — let me connect you with our team!"
                        value={form.fallbackMsg}
                        onChange={(e) => updateForm("fallbackMsg", e.target.value)}
                      />
                      <div className="cc-hint">Shown when the bot doesn't know the answer.</div>
                    </div>
                  </div>

                  <div className="cc-form-footer">
                    <button className="cc-btn-back" onClick={() => goStep(2)}>← Back</button>
                    <button className="cc-btn-next" onClick={() => handleNextStep(4)}>
                      Continue <span className="cc-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Plan & Deploy ── */}
              {currentStep === 4 && (
                <div>
                  <div className="cc-form-section">
                    <div className="cc-section-label">Step 04</div>
                    <div className="cc-form-title">Choose Your Plan</div>
                    <div className="cc-form-sub">Pick a plan and deploy your bot — you'll get your embed code instantly.</div>

                    <div className="cc-field">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {PLANS.map((p) => (
                          <div
                            key={p.id}
                            className={`cc-plan-option${selectedPlan.name === p.name ? " selected" : ""}`}
                            onClick={() => setSelectedPlan({ name: p.name, price: p.price === "Custom" ? "Custom" : `${p.price}/mo` })}
                          >
                            {p.badge && <div className="cc-plan-badge-tag">{p.badge}</div>}
                            <div className="cc-plan-icon">{p.icon}</div>
                            <div className="cc-plan-name">{p.name}</div>
                            <div className="cc-plan-price">
                              {p.price}<span>{p.priceSuffix}</span>
                            </div>
                            <div className="cc-plan-features">
                              {p.features.map((f, i) => (
                                <span key={i}>{f}{i < p.features.length - 1 ? <br /> : null}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">Notify Email <span className="req">*</span></label>
                      <input
                        className={`cc-input${stepErrors.notifyEmail ? " error" : ""}`}
                        type="email"
                        placeholder="you@yourcompany.com"
                        value={form.notifyEmail}
                        onChange={(e) => updateForm("notifyEmail", e.target.value)}
                      />
                      {stepErrors.notifyEmail
                        ? <div className="cc-error-msg">⚠ {stepErrors.notifyEmail}</div>
                        : <div className="cc-hint">We'll send lead notifications and your embed code here.</div>
                      }
                    </div>

                    <div className="cc-input-row">
                      <div className="cc-field">
                        <label className="cc-label">Full Name <span className="req">*</span></label>
                        <input
                          className={`cc-input${stepErrors.fullName ? " error" : ""}`}
                          type="text"
                          placeholder="Your name"
                          value={form.fullName}
                          onChange={(e) => updateForm("fullName", e.target.value)}
                        />
                        {stepErrors.fullName && <div className="cc-error-msg">⚠ {stepErrors.fullName}</div>}
                      </div>
                      <div className="cc-field">
                        <label className="cc-label">Company / Brand</label>
                        <input
                          className="cc-input"
                          type="text"
                          placeholder="Optional"
                          value={form.company}
                          onChange={(e) => updateForm("company", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FIX: API error shown to user */}
                  {deployError && (
                    <div className="cc-deploy-error">
                      ⚠ {deployError}
                    </div>
                  )}

                  <div className="cc-form-footer">
                    <button className="cc-btn-back" onClick={() => goStep(3)}>← Back</button>
                    <button
                      className="cc-btn-next"
                      onClick={submitForm}
                      disabled={deploying}
                    >
                      {deploying ? "Deploying…" : <>Deploy Chatbot <span className="cc-btn-arrow">🚀</span></>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── PREVIEW CARD ── */}
            <div className="cc-preview-card">
              <div className="cc-preview-header">
                <div className="cc-preview-title">Live Preview</div>
                <div className="cc-preview-live">Live</div>
              </div>
              <div className="cc-chat-preview">
                <div className="cc-chat-window">
                  <div className="cc-chat-topbar">
                    <div
                      className="cc-chat-avatar"
                      style={{ background: form.brandColor }}
                    >{previewInitials}</div>
                    <div>
                      <div className="cc-chat-bot-name">{previewName}</div>
                      <div className="cc-chat-bot-status">AI Assistant · Online</div>
                    </div>
                    <div className="cc-chat-dot" />
                  </div>
                  <div className="cc-chat-messages">
                    <div className="cc-msg cc-msg-bot">{previewGreet}</div>
                    <div
                      className="cc-msg cc-msg-user"
                      style={{ background: form.brandColor }}
                    >What services do you offer?</div>
                    <div className="cc-msg cc-msg-bot">
                      Great question! I can tell you all about our services, pricing, and help you get started. What are you most interested in?
                    </div>
                    <div className="cc-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                  <div className="cc-chat-inputbar">
                    <div className="cc-chat-input-mock">Type a message…</div>
                    <div
                      className="cc-chat-send-mock"
                      style={{ background: form.brandColor }}
                    >→</div>
                  </div>
                </div>
              </div>
              <div className="cc-info-rows">
                <div className="cc-info-row">
                  <span className="cc-info-key">Bot Name</span>
                  <span className="cc-info-val red">{previewName}</span>
                </div>
                <div className="cc-info-row">
                  <span className="cc-info-key">Industry</span>
                  <span className="cc-info-val">{form.industry || "—"}</span>
                </div>
                <div className="cc-info-row">
                  <span className="cc-info-key">Language</span>
                  <span className="cc-info-val">{form.botLang}</span>
                </div>
                <div className="cc-info-row">
                  <span className="cc-info-key">Status</span>
                  <span className="cc-info-val red">Ready to Deploy</span>
                </div>
              </div>
              <div className="cc-plan-badge-row">
                <div className="cc-plan-ico">🚀</div>
                <div>
                  <div className="cc-plan-badge-name">{selectedPlan.name} Plan</div>
                  <div className="cc-plan-badge-sub">
                    {PLANS.find(p => p.name === selectedPlan.name)?.features.slice(0, 3).join(" · ")}
                  </div>
                </div>
                <div className="cc-plan-badge-price">{planPriceDisplay}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SUCCESS STATE ── */}
      {success && (
        <div className="cc-success">
          <div className="cc-success-icon">🎉</div>
          <div className="cc-success-title">Your Bot is <em>Live!</em></div>
          <div className="cc-success-desc">
            Your AI chatbot has been configured and is ready to deploy.
            Check your email for the embed code and dashboard access.
          </div>
          <div className="cc-success-details">
            {[
              { key: "Bot Name", val: success.botName, cls: "" },
              { key: "Chatbot ID", val: success.botId, cls: "code" },
              { key: "Plan", val: success.plan, cls: "" },
              { key: "Embed Code sent to", val: success.email, cls: "" },
              { key: "Status", val: "✓ Active", cls: "", style: { color: "#22c55e" } },
            ].map((r) => (
              <div key={r.key} className="cc-detail-row">
                <span className="cc-detail-key">{r.key}</span>
                <span
                  className={`cc-detail-val${r.cls ? ` ${r.cls}` : ""}`}
                  style={(r as any).style}
                >{r.val}</span>
              </div>
            ))}
          </div>
          <div className="cc-success-btns">
            <a href="/dashboard" className="cc-btn-primary-l">Go to Dashboard →</a>
            <Link href="/" className="cc-btn-ghost-l">Back to Home</Link>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="cc-footer">
        <Link href="/" className="cc-footer-logo">JZ<span>AI</span></Link>
        <div className="cc-footer-text">© 2026 JZAI. Engineering Intelligence.</div>
      </footer>
    </>
  );
}
