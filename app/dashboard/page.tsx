"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface Bot {
  id: string;
  name: string;
  industry: string;
  language: string;
  plan: string;
  status: "active" | "paused";
  conversations: number;
  leads: number;
  messages: number;
  createdAt: string;
  color: string;
}

type ActiveSection = "overview" | "bots" | "settings";

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_BOTS: Bot[] = [
  {
    id: "jzai_a3f8d21c",
    name: "Aria",
    industry: "SaaS / Tech",
    language: "English",
    plan: "Pro",
    status: "active",
    conversations: 342,
    leads: 87,
    messages: 2840,
    createdAt: "May 2, 2026",
    color: "#e8193c",
  },
  {
    id: "jzai_b7c91e44",
    name: "SupportBot",
    industry: "E-Commerce",
    language: "English",
    plan: "Starter",
    status: "active",
    conversations: 128,
    leads: 31,
    messages: 960,
    createdAt: "May 10, 2026",
    color: "#6366f1",
  },
  {
    id: "jzai_c2d45f80",
    name: "LeadHunter",
    industry: "Real Estate",
    language: "Urdu",
    plan: "Starter",
    status: "paused",
    conversations: 54,
    leads: 12,
    messages: 310,
    createdAt: "May 15, 2026",
    color: "#10b981",
  },
];

const MOCK_USER = {
  name: "Loading...",
  email: "",
  company: "",
  joined: "",
  avatar: "JZ",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function copyToClipboard(text: string, setCopied: (id: string) => void, id: string) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  });
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [bots, setBots] = useState<Bot[]>([]);
  const [copiedId, setCopiedId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Settings form state
  const [settingsName, setSettingsName] = useState(MOCK_USER.name);
  const [settingsEmail, setSettingsEmail] = useState(MOCK_USER.email);
  const [settingsCompany, setSettingsCompany] = useState(MOCK_USER.company);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(saved);
    const userStr = localStorage.getItem("jzai_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      MOCK_USER.name = user.name || "User";
      MOCK_USER.email = user.email || "";
      MOCK_USER.avatar = user.name ? user.name.slice(0,2).toUpperCase() : "JZ";
      fetch(`https://jzai-saas.jahanzaibtahir2006.workers.dev/bots?user_id=${user.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.bots) setBots(data.bots);
        });
    } else {
      window.location.href = "/auth";
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const toggleBotStatus = (id: string) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === "active" ? "paused" : "active" } : b
      )
    );
  };

  const deleteBot = (id: string) => {
    setBots((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirm("");
  };

  const totalStats = {
    bots: bots.length,
    conversations: bots.reduce((a, b) => a + b.conversations, 0),
    leads: bots.reduce((a, b) => a + b.leads, 0),
    messages: bots.reduce((a, b) => a + b.messages, 0),
  };

  const embedCode = (botId: string) =>
    `<script src="https://cdn.jzai.store/widget.js" data-bot="${botId}" async></script>`;

  return (
    <>
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
          --card-bg:#13131a;--card-hover:#0d0d12;
          --toggle-bg:#1c1c26;--toggle-border:#2a2a35;
          --shadow:rgba(0,0,0,0.4);
        }
        [data-theme="light"]{
          --bg:#fafafa;--bg2:#f0f0f5;--bg3:#e8e8f0;--bg4:#dddde8;
          --red:#d0102e;--red-dark:#a01028;
          --red-glow:rgba(208,16,46,0.12);--red-dim:rgba(208,16,46,0.07);
          --text:#0f0f14;--text2:#5a5a6a;--text3:#9a9aaa;
          --border:#d8d8e4;--border2:rgba(208,16,46,0.15);
          --card-bg:#ffffff;--card-hover:#f5f5fc;
          --toggle-bg:#e8e8f0;--toggle-border:#d0d0dc;
          --shadow:rgba(0,0,0,0.08);
        }

        body{
          font-family:'DM Sans',sans-serif;
          background:var(--bg);color:var(--text);
          overflow-x:hidden;
          transition:background var(--transition-theme),color var(--transition-theme);
        }

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.5;}}
        @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}

        /* ── LAYOUT ── */
        .db-wrap{display:flex;min-height:100vh;}

        /* ── SIDEBAR ── */
        .db-sidebar{
          width:260px;flex-shrink:0;
          background:var(--card-bg);
          border-right:1px solid var(--border);
          display:flex;flex-direction:column;
          position:fixed;top:0;left:0;bottom:0;z-index:50;
          overflow-y:auto;
          transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),background var(--transition-theme),border-color var(--transition-theme);
        }
        .db-sidebar-top{
          padding:28px 24px 24px;
          border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
        }
        .db-logo{
          font-family:'Syne',sans-serif;font-size:22px;font-weight:800;
          letter-spacing:-0.5px;color:var(--text);text-decoration:none;
        }
        .db-logo span{color:var(--red);}
        .db-user-block{
          padding:20px 24px;
          border-bottom:1px solid var(--border);
          display:flex;align-items:center;gap:12px;
        }
        .db-avatar{
          width:38px;height:38px;border-radius:50%;
          background:var(--red);color:#fff;
          font-family:'Syne',sans-serif;font-size:14px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
        }
        .db-user-name{font-size:14px;font-weight:600;color:var(--text);}
        .db-user-email{font-size:11px;color:var(--text2);margin-top:2px;}
        .db-nav{flex:0;padding:16px 12px;display:flex;flex-direction:column;gap:4px;}
        .db-nav-item{
          display:flex;align-items:center;gap:12px;
          padding:11px 14px;border-radius:8px;
          font-size:14px;font-weight:500;color:var(--text2);
          cursor:pointer;transition:background 0.2s,color 0.2s;
          border:none;background:transparent;font-family:'DM Sans',sans-serif;
          width:100%;text-align:left;
        }
        .db-nav-item:hover{background:var(--bg2);color:var(--text);}
        .db-nav-item.active{
          background:var(--red-dim);color:var(--red);
          border:1px solid rgba(232,25,60,0.2);
        }
        .db-nav-icon{font-size:16px;width:20px;text-align:center;}
        .db-nav-divider{height:1px;background:var(--border);margin:8px 0;}
        .db-sidebar-bottom{
          padding:16px 12px;
          border-top:1px solid var(--border);
          display:flex;flex-direction:column;gap:8px;
          margin-top:auto;
        }
        .db-toggle-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:8px 14px;
        }
        .db-toggle-label{font-size:13px;color:var(--text2);}
        .db-toggle{
          position:relative;width:44px;height:24px;
          background:var(--toggle-bg);border:1.5px solid var(--toggle-border);
          border-radius:12px;cursor:pointer;
          display:flex;align-items:center;padding:0 3px;
          outline:none;transition:background var(--transition-theme);
        }
        .db-toggle-thumb{
          width:16px;height:16px;border-radius:50%;background:var(--red);
          font-size:9px;display:flex;align-items:center;justify-content:center;
          transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 2px 6px var(--shadow);
        }
        [data-theme="light"] .db-toggle-thumb{transform:translateX(20px);}
        .db-logout-btn{
          display:flex;align-items:center;gap:12px;
          padding:11px 14px;border-radius:8px;
          font-size:14px;font-weight:500;color:var(--text2);
          cursor:pointer;transition:background 0.2s,color 0.2s;
          border:none;background:transparent;font-family:'DM Sans',sans-serif;
          width:100%;text-align:left;
        }
        .db-logout-btn:hover{background:rgba(232,25,60,0.08);color:var(--red);}

        /* ── MAIN ── */
        .db-main{
          margin-left:260px;flex:1;
          display:flex;flex-direction:column;min-height:100vh;
        }

        /* ── TOPBAR ── */
        .db-topbar{
          padding:20px 40px;
          border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
          background:var(--card-bg);
          position:sticky;top:0;z-index:30;
          backdrop-filter:blur(12px);
          transition:background var(--transition-theme),border-color var(--transition-theme);
        }
        .db-topbar-title{
          font-family:'Syne',sans-serif;font-size:20px;font-weight:800;
          letter-spacing:-0.5px;color:var(--text);
        }
        .db-topbar-right{display:flex;align-items:center;gap:16px;}
        .db-new-bot-btn{
          background:var(--red);color:#fff;border:none;
          border-radius:8px;padding:10px 20px;
          font-size:13px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;
          display:inline-flex;align-items:center;gap:8px;
          transition:background 0.2s,transform 0.2s,box-shadow 0.2s;
          text-decoration:none;
        }
        .db-new-bot-btn:hover{background:var(--red-dark);transform:translateY(-1px);box-shadow:0 6px 20px var(--red-glow);}

        /* ── CONTENT ── */
        .db-content{padding:36px 40px;flex:1;animation:fadeUp 0.5s ease both;}

        /* ── SECTION LABEL ── */
        .db-section-label{
          font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
          color:var(--red);margin-bottom:20px;
          display:flex;align-items:center;gap:10px;
        }
        .db-section-label::before{content:'';width:24px;height:1px;background:var(--red);}

        /* ── STATS GRID ── */
        .db-stats-grid{
          display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
          margin-bottom:40px;
        }
        .db-stat-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;padding:24px;
          transition:border-color 0.2s,transform 0.2s;
          animation:fadeUp 0.5s ease both;
        }
        .db-stat-card:hover{border-color:var(--border2);transform:translateY(-2px);}
        .db-stat-card:nth-child(1){animation-delay:0.05s;}
        .db-stat-card:nth-child(2){animation-delay:0.1s;}
        .db-stat-card:nth-child(3){animation-delay:0.15s;}
        .db-stat-card:nth-child(4){animation-delay:0.2s;}
        .db-stat-icon{font-size:22px;margin-bottom:14px;}
        .db-stat-val{
          font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
          letter-spacing:-1px;color:var(--text);margin-bottom:4px;
        }
        .db-stat-label{font-size:12px;color:var(--text2);font-weight:500;}
        .db-stat-change{
          font-size:11px;color:#22c55e;font-weight:600;
          margin-top:8px;display:flex;align-items:center;gap:4px;
        }

        /* ── RECENT ACTIVITY ── */
        .db-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px;}
        .db-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;overflow:hidden;
          animation:fadeUp 0.5s ease 0.25s both;
        }
        .db-card-header{
          padding:18px 24px;border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
        }
        .db-card-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);}
        .db-card-body{padding:16px 24px;}
        .db-activity-item{
          display:flex;align-items:center;gap:12px;
          padding:10px 0;border-bottom:1px solid var(--border);
        }
        .db-activity-item:last-child{border-bottom:none;}
        .db-activity-dot{
          width:8px;height:8px;border-radius:50%;flex-shrink:0;
        }
        .db-activity-text{font-size:13px;color:var(--text);flex:1;}
        .db-activity-time{font-size:11px;color:var(--text3);}

        /* ── BOTS GRID ── */
        .db-bots-header{
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:24px;
        }
        .db-bots-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;}
        .db-bot-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;overflow:hidden;
          transition:border-color 0.2s,transform 0.2s;
          animation:fadeUp 0.5s ease both;
        }
        .db-bot-card:hover{border-color:var(--border2);transform:translateY(-2px);}
        .db-bot-card-top{
          padding:20px 24px;
          display:flex;align-items:flex-start;gap:14px;
        }
        .db-bot-avatar{
          width:44px;height:44px;border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-size:16px;font-weight:800;
          color:#fff;flex-shrink:0;
        }
        .db-bot-info{flex:1;}
        .db-bot-name{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:var(--text);margin-bottom:4px;}
        .db-bot-meta{font-size:12px;color:var(--text2);}
        .db-bot-status{
          display:inline-flex;align-items:center;gap:5px;
          font-size:11px;font-weight:600;padding:4px 10px;
          border-radius:20px;
        }
        .db-bot-status.active{
          background:rgba(34,197,94,0.1);color:#22c55e;
          border:1px solid rgba(34,197,94,0.2);
        }
        .db-bot-status.paused{
          background:var(--red-dim);color:var(--red);
          border:1px solid rgba(232,25,60,0.2);
        }
        .db-bot-status::before{
          content:'';width:5px;height:5px;border-radius:50%;background:currentColor;
        }
        .db-bot-stats{
          display:grid;grid-template-columns:1fr 1fr 1fr;
          border-top:1px solid var(--border);border-bottom:1px solid var(--border);
        }
        .db-bot-stat{
          padding:14px;text-align:center;
          border-right:1px solid var(--border);
        }
        .db-bot-stat:last-child{border-right:none;}
        .db-bot-stat-val{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text);}
        .db-bot-stat-label{font-size:10px;color:var(--text2);margin-top:2px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;}

        /* embed code */
        .db-embed-wrap{padding:16px 20px;}
        .db-embed-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);margin-bottom:8px;}
        .db-embed-code{
          background:var(--bg2);border:1px solid var(--border);
          border-radius:8px;padding:10px 14px;
          font-family:monospace;font-size:11px;color:var(--text2);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
          cursor:pointer;transition:border-color 0.2s;
        }
        .db-embed-code:hover{border-color:var(--red);}
        .db-copy-btn{
          margin-top:8px;width:100%;
          background:var(--bg2);border:1px solid var(--border);
          color:var(--text2);border-radius:6px;padding:8px;
          font-size:12px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s,color 0.2s,background 0.2s;
          display:flex;align-items:center;justify-content:center;gap:6px;
        }
        .db-copy-btn:hover{border-color:var(--red);color:var(--red);}
        .db-copy-btn.copied{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.3);color:#22c55e;}

        /* bot actions */
        .db-bot-actions{
          padding:12px 20px;
          display:flex;gap:8px;
        }
        .db-action-btn{
          flex:1;padding:9px;border-radius:7px;
          font-size:12px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;
          display:flex;align-items:center;justify-content:center;gap:6px;
          transition:background 0.2s,border-color 0.2s,color 0.2s;
        }
        .db-action-edit{
          background:var(--bg2);border:1px solid var(--border);color:var(--text2);
        }
        .db-action-edit:hover{border-color:rgba(232,25,60,0.3);color:var(--text);}
        .db-action-toggle.active-btn{
          background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#22c55e;
        }
        .db-action-toggle.paused-btn{
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.2);color:var(--red);
        }
        .db-action-delete{
          background:transparent;border:1px solid var(--border);color:var(--text3);
          flex:0;padding:9px 12px;
        }
        .db-action-delete:hover{background:rgba(232,25,60,0.08);border-color:rgba(232,25,60,0.3);color:var(--red);}

        /* delete confirm */
        .db-delete-overlay{
          position:fixed;inset:0;background:rgba(0,0,0,0.6);
          backdrop-filter:blur(4px);z-index:200;
          display:flex;align-items:center;justify-content:center;
          animation:fadeUp 0.2s ease;
        }
        .db-delete-modal{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:16px;padding:32px;max-width:400px;width:90%;
          text-align:center;
        }
        .db-delete-modal-icon{font-size:36px;margin-bottom:16px;}
        .db-delete-modal-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);margin-bottom:8px;}
        .db-delete-modal-sub{font-size:14px;color:var(--text2);margin-bottom:28px;line-height:1.6;}
        .db-delete-modal-btns{display:flex;gap:12px;}
        .db-modal-cancel{
          flex:1;padding:11px;border-radius:8px;
          background:transparent;border:1px solid var(--border);
          color:var(--text2);font-size:14px;font-weight:500;
          cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s,color 0.2s;
        }
        .db-modal-cancel:hover{border-color:rgba(232,25,60,0.3);color:var(--text);}
        .db-modal-delete{
          flex:1;padding:11px;border-radius:8px;
          background:var(--red);border:none;
          color:#fff;font-size:14px;font-weight:600;
          cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:background 0.2s;
        }
        .db-modal-delete:hover{background:var(--red-dark);}

        /* empty state */
        .db-empty{
          text-align:center;padding:80px 40px;
          background:var(--card-bg);border:1px dashed var(--border);
          border-radius:16px;
        }
        .db-empty-icon{font-size:48px;margin-bottom:16px;}
        .db-empty-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);margin-bottom:8px;}
        .db-empty-sub{font-size:14px;color:var(--text2);margin-bottom:28px;}

        /* ── SETTINGS ── */
        .db-settings-grid{display:flex;flex-direction:column;gap:24px;}
        .db-settings-card{
          background:var(--card-bg);border:1px solid var(--border);
          border-radius:14px;overflow:hidden;
          animation:fadeUp 0.5s ease both;
        }
        .db-settings-card:nth-child(2){animation-delay:0.1s;}
        .db-settings-card:nth-child(3){animation-delay:0.2s;}
        .db-settings-header{
          padding:20px 28px;border-bottom:1px solid var(--border);
        }
        .db-settings-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--text);}
        .db-settings-sub{font-size:13px;color:var(--text2);margin-top:4px;}
        .db-settings-body{padding:24px 28px;}
        .db-settings-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
        .db-settings-field{display:flex;flex-direction:column;gap:8px;}
        .db-settings-label{
          font-size:11px;font-weight:700;letter-spacing:1px;
          text-transform:uppercase;color:var(--text2);
        }
        .db-settings-input{
          background:var(--bg2);border:1px solid var(--border);
          border-radius:8px;padding:11px 14px;
          font-size:14px;font-family:'DM Sans',sans-serif;
          color:var(--text);outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .db-settings-input:focus{
          border-color:var(--red);box-shadow:0 0 0 3px var(--red-dim);
        }
        .db-settings-input::placeholder{color:var(--text3);}
        .db-settings-save{
          background:var(--red);color:#fff;border:none;
          border-radius:8px;padding:11px 24px;
          font-size:13px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:background 0.2s,transform 0.2s;
          display:inline-flex;align-items:center;gap:8px;
        }
        .db-settings-save:hover{background:var(--red-dark);transform:translateY(-1px);}
        .db-settings-footer{
          padding:16px 28px;border-top:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
        }
        .db-save-success{font-size:13px;color:#22c55e;font-weight:500;}

        /* danger zone */
        .db-danger-zone{
          border-color:rgba(232,25,60,0.2);
        }
        .db-danger-header{background:rgba(232,25,60,0.04);}
        .db-danger-title{color:var(--red) !important;}
        .db-danger-btn{
          background:transparent;border:1px solid var(--red);
          color:var(--red);border-radius:8px;padding:10px 20px;
          font-size:13px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:background 0.2s;
        }
        .db-danger-btn:hover{background:rgba(232,25,60,0.08);}

        /* plan badge */
        .db-plan-chip{
          display:inline-flex;align-items:center;gap:6px;
          background:var(--red-dim);border:1px solid rgba(232,25,60,0.2);
          color:var(--red);font-size:11px;font-weight:700;
          padding:3px 10px;border-radius:20px;letter-spacing:0.5px;
          text-transform:uppercase;
        }

        /* mobile hamburger */
        .db-hamburger{
          display:none;background:none;border:none;
          color:var(--text);font-size:20px;cursor:pointer;
          padding:4px;
        }

        @media(max-width:1000px){
          .db-stats-grid{grid-template-columns:1fr 1fr;}
          .db-two-col{grid-template-columns:1fr;}
        }
        @media(max-width:768px){
          .db-sidebar{transform:translateX(-100%);}
          .db-sidebar.open{transform:translateX(0);}
          .db-main{margin-left:0;}
          .db-topbar{padding:16px 20px;}
          .db-content{padding:24px 20px;}
          .db-hamburger{display:flex;}
          .db-stats-grid{grid-template-columns:1fr 1fr;}
          .db-settings-row{grid-template-columns:1fr;}
        }
        @media(max-width:480px){
          .db-stats-grid{grid-template-columns:1fr;}
          .db-bots-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="db-delete-overlay" onClick={() => setDeleteConfirm("")}>
          <div className="db-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-delete-modal-icon">🗑️</div>
            <div className="db-delete-modal-title">Delete this bot?</div>
            <div className="db-delete-modal-sub">
              This action cannot be undone. The bot, its conversations, and all lead data will be permanently deleted.
            </div>
            <div className="db-delete-modal-btns">
              <button className="db-modal-cancel" onClick={() => setDeleteConfirm("")}>Cancel</button>
              <button className="db-modal-delete" onClick={() => deleteBot(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="db-wrap">
        {/* ── SIDEBAR ── */}
        <aside className={`db-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="db-sidebar-top">
            <Link href="/" className="db-logo">JZ<span>AI</span></Link>
          </div>

          <div className="db-user-block">
            <div className="db-avatar">{MOCK_USER.avatar}</div>
            <div>
              <div className="db-user-name">{MOCK_USER.name}</div>
              <div className="db-user-email">{MOCK_USER.email}</div>
            </div>
          </div>

          <nav className="db-nav">
            {[
              { id: "overview", icon: "📊", label: "Overview" },
              { id: "bots", icon: "🤖", label: "My Bots" },
              { id: "settings", icon: "⚙️", label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                className={`db-nav-item${activeSection === item.id ? " active" : ""}`}
                onClick={() => { setActiveSection(item.id as ActiveSection); setSidebarOpen(false); }}
              >
                <span className="db-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="db-nav-divider" />

            <Link href="/create-chatbot" className="db-nav-item" style={{ textDecoration: "none" }}>
              <span className="db-nav-icon">✨</span>
              New Chatbot
            </Link>
          </nav>

          <div className="db-sidebar-bottom">
            <div className="db-toggle-row">
              <span className="db-toggle-label">{theme === "dark" ? "🌙 Dark" : "☀️ Light"} Mode</span>
              <button className="db-toggle" onClick={toggleTheme}>
                <div className="db-toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</div>
              </button>
            </div>
            <button className="db-logout-btn">
              <span className="db-nav-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="db-main">
          {/* Topbar */}
          <div className="db-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="db-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
              <div className="db-topbar-title">
                {activeSection === "overview" && "Dashboard"}
                {activeSection === "bots" && "My Bots"}
                {activeSection === "settings" && "Settings"}
              </div>
            </div>
            <div className="db-topbar-right">
              <div className="db-plan-chip">🚀 Pro Plan</div>
              <Link href="/create-chatbot" className="db-new-bot-btn">
                + New Bot
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="db-content" key={activeSection}>

            {/* ── OVERVIEW ── */}
            {activeSection === "overview" && (
              <>
                <div className="db-section-label">Overview</div>

                {/* Stats */}
                <div className="db-stats-grid">
                  {[
                    { icon: "🤖", val: totalStats.bots, label: "Active Bots", change: "+1 this month" },
                    { icon: "💬", val: totalStats.conversations, label: "Total Conversations", change: "+24% vs last month" },
                    { icon: "🎯", val: totalStats.leads, label: "Leads Captured", change: "+18% vs last month" },
                    { icon: "📨", val: totalStats.messages.toLocaleString(), label: "Messages Sent", change: "+31% vs last month" },
                  ].map((s, i) => (
                    <div key={i} className="db-stat-card">
                      <div className="db-stat-icon">{s.icon}</div>
                      <div className="db-stat-val">{s.val}</div>
                      <div className="db-stat-label">{s.label}</div>
                      <div className="db-stat-change">↑ {s.change}</div>
                    </div>
                  ))}
                </div>

                {/* Two col */}
                <div className="db-two-col">
                  {/* Recent Bots */}
                  <div className="db-card">
                    <div className="db-card-header">
                      <div className="db-card-title">Your Bots</div>
                      <button
                        style={{ fontSize: 12, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setActiveSection("bots")}
                      >View all →</button>
                    </div>
                    <div className="db-card-body">
                      {bots.map((bot) => (
                        <div key={bot.id} className="db-activity-item">
                          <div
                            className="db-activity-dot"
                            style={{ background: bot.color, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif", flexShrink: 0 }}
                          >{getInitials(bot.name)}</div>
                          <div className="db-activity-text">
                            <div style={{ fontWeight: 600 }}>{bot.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text2)" }}>{bot.industry} · {bot.conversations} conversations</div>
                          </div>
                          <div className={`db-bot-status ${bot.status}`}>{bot.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="db-card">
                    <div className="db-card-header">
                      <div className="db-card-title">Recent Activity</div>
                    </div>
                    <div className="db-card-body">
                      {[
                        { dot: "#22c55e", text: "New lead captured via Aria", time: "2 min ago" },
                        { dot: "#e8193c", text: "SupportBot answered 12 queries", time: "18 min ago" },
                        { dot: "#6366f1", text: "LeadHunter paused by user", time: "1 hr ago" },
                        { dot: "#f59e0b", text: "New conversation started", time: "2 hr ago" },
                        { dot: "#22c55e", text: "Lead email sent: ali@example.com", time: "3 hr ago" },
                        { dot: "#0ea5e9", text: "Aria bot updated successfully", time: "Yesterday" },
                      ].map((a, i) => (
                        <div key={i} className="db-activity-item">
                          <div className="db-activity-dot" style={{ background: a.dot }} />
                          <div className="db-activity-text">{a.text}</div>
                          <div className="db-activity-time">{a.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── MY BOTS ── */}
            {activeSection === "bots" && (
              <>
                <div className="db-bots-header">
                  <div className="db-section-label" style={{ margin: 0 }}>My Bots ({bots.length})</div>
                  <Link href="/create-chatbot" className="db-new-bot-btn">+ Create New Bot</Link>
                </div>

                {bots.length === 0 ? (
                  <div className="db-empty">
                    <div className="db-empty-icon">🤖</div>
                    <div className="db-empty-title">No bots yet</div>
                    <div className="db-empty-sub">Create your first AI chatbot and start capturing leads automatically.</div>
                    <Link href="/create-chatbot" className="db-new-bot-btn" style={{ display: "inline-flex" }}>+ Create Your First Bot</Link>
                  </div>
                ) : (
                  <div className="db-bots-grid">
                    {bots.map((bot, i) => (
                      <div key={bot.id} className="db-bot-card" style={{ animationDelay: `${i * 0.08}s` }}>
                        {/* Top */}
                        <div className="db-bot-card-top">
                          <div className="db-bot-avatar" style={{ background: bot.color }}>
                            {getInitials(bot.name)}
                          </div>
                          <div className="db-bot-info">
                            <div className="db-bot-name">{bot.name}</div>
                            <div className="db-bot-meta">{bot.industry} · {bot.language} · {bot.createdAt}</div>
                          </div>
                          <div className={`db-bot-status ${bot.status}`}>{bot.status}</div>
                        </div>

                        {/* Stats row */}
                        <div className="db-bot-stats">
                          <div className="db-bot-stat">
                            <div className="db-bot-stat-val">{bot.conversations}</div>
                            <div className="db-bot-stat-label">Convos</div>
                          </div>
                          <div className="db-bot-stat">
                            <div className="db-bot-stat-val">{bot.leads}</div>
                            <div className="db-bot-stat-label">Leads</div>
                          </div>
                          <div className="db-bot-stat">
                            <div className="db-bot-stat-val">{bot.messages}</div>
                            <div className="db-bot-stat-label">Messages</div>
                          </div>
                        </div>

                        {/* Embed code */}
                        <div className="db-embed-wrap">
                          <div className="db-embed-label">Embed Code</div>
                          <div className="db-embed-code" title={embedCode(bot.id)}>
                            {embedCode(bot.id)}
                          </div>
                          <button
                            className={`db-copy-btn${copiedId === bot.id ? " copied" : ""}`}
                            onClick={() => copyToClipboard(embedCode(bot.id), setCopiedId, bot.id)}
                          >
                            {copiedId === bot.id ? "✓ Copied!" : "📋 Copy Embed Code"}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="db-bot-actions">
                          <Link
                            href={`/create-chatbot?edit=${bot.id}`}
                            className="db-action-btn db-action-edit"
                            style={{ textDecoration: "none" }}
                          >✏️ Edit</Link>
                          <button
                            className={`db-action-btn db-action-toggle ${bot.status === "active" ? "active-btn" : "paused-btn"}`}
                            onClick={() => toggleBotStatus(bot.id)}
                          >
                            {bot.status === "active" ? "⏸ Pause" : "▶ Resume"}
                          </button>
                          <button
                            className="db-action-btn db-action-delete"
                            onClick={() => setDeleteConfirm(bot.id)}
                          >🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── SETTINGS ── */}
            {activeSection === "settings" && (
              <>
                <div className="db-section-label">Account Settings</div>
                <div className="db-settings-grid">

                  {/* Profile */}
                  <div className="db-settings-card">
                    <div className="db-settings-header">
                      <div className="db-settings-title">Profile Information</div>
                      <div className="db-settings-sub">Update your name, email, and company details.</div>
                    </div>
                    <div className="db-settings-body">
                      <div className="db-settings-row">
                        <div className="db-settings-field">
                          <label className="db-settings-label">Full Name</label>
                          <input
                            className="db-settings-input"
                            type="text"
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                          />
                        </div>
                        <div className="db-settings-field">
                          <label className="db-settings-label">Email Address</label>
                          <input
                            className="db-settings-input"
                            type="email"
                            value={settingsEmail}
                            onChange={(e) => setSettingsEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="db-settings-row">
                        <div className="db-settings-field">
                          <label className="db-settings-label">Company / Brand</label>
                          <input
                            className="db-settings-input"
                            type="text"
                            value={settingsCompany}
                            onChange={(e) => setSettingsCompany(e.target.value)}
                          />
                        </div>
                        <div className="db-settings-field">
                          <label className="db-settings-label">Member Since</label>
                          <input
                            className="db-settings-input"
                            type="text"
                            value={MOCK_USER.joined}
                            readOnly
                            style={{ opacity: 0.6, cursor: "default" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="db-settings-footer">
                      <span className="db-save-success">{settingsSaved ? "✓ Changes saved!" : ""}</span>
                      <button
                        className="db-settings-save"
                        onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000); }}
                      >Save Changes</button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="db-settings-card">
                    <div className="db-settings-header">
                      <div className="db-settings-title">Change Password</div>
                      <div className="db-settings-sub">Keep your account secure with a strong password.</div>
                    </div>
                    <div className="db-settings-body">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                          { label: "Current Password", val: currentPw, set: setCurrentPw },
                          { label: "New Password", val: newPw, set: setNewPw },
                          { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
                        ].map((f) => (
                          <div key={f.label} className="db-settings-field">
                            <label className="db-settings-label">{f.label}</label>
                            <input
                              className="db-settings-input"
                              type="password"
                              value={f.val}
                              placeholder="••••••••"
                              onChange={(e) => f.set(e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="db-settings-footer">
                      <span className="db-save-success">{pwSaved ? "✓ Password updated!" : ""}</span>
                      <button
                        className="db-settings-save"
                        onClick={() => { setPwSaved(true); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setTimeout(() => setPwSaved(false), 3000); }}
                      >Update Password</button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="db-settings-card db-danger-zone">
                    <div className="db-settings-header db-danger-header">
                      <div className="db-settings-title db-danger-title">Danger Zone</div>
                      <div className="db-settings-sub">Irreversible actions — proceed with caution.</div>
                    </div>
                    <div className="db-settings-body">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Delete Account</div>
                          <div style={{ fontSize: 13, color: "var(--text2)" }}>Permanently delete your account and all associated data.</div>
                        </div>
                        <button className="db-danger-btn">Delete Account</button>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
