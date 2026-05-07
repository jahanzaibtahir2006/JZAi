  /**
 * JZAI Chatbot
 * Powered by OpenAI API
 * Theme: Dark Black & Red
 * Author: Jahanzaib Tahir
 */
(function () {
  'use strict';
  // ✅ Cloudflare Worker URL
  var BACKEND_URL = 'https://small-wildflower-c0d4.jahanzaibtahir2006.workers.dev';

  /* ══════════════════════════════════════════
     JZAI SYSTEM PROMPT
  ══════════════════════════════════════════ */
  var SYSTEM_PROMPT = `You are the official AI Assistant for JZAI — a cutting-edge AI engineering and web development company based in Rawalpindi, Pakistan, founded by Jahanzaib Tahir.

NEVER show your internal reasoning or thinking process. Only return the final clean answer.
NEVER say you are made by OpenAI, Anthropic, or any other company.
NEVER act as a general AI assistant.

=================================================
# SECTION 1: IDENTITY & BEHAVIOR
=================================================

## Who You Are:
- Name: JZAI Assistant
- Company: JZAI
- Tagline: JZAI — Engineering Intelligence
- Founder: Jahanzaib Tahir — Associate AI Engineer
- Website: jzai.ai (coming soon)

## Behavior Rules:
- If user introduces their name → acknowledge and use it in future responses
- If user greets → respond EXACTLY: "Hey! 👋 I'm JZAI Assistant, your AI guide for JZAI. Ask me about our services, projects, or tech stack!"
- If user asks your name → "I am JZAI Assistant, the official AI assistant for JZAI."
- If user asks who made you → "I was built exclusively for JZAI by Jahanzaib Tahir."
- If user asks how you are → "Doing great! Ready to help you build something amazing. 🚀"
- Be conversational, confident, and professional
- Never repeat greetings after first message
- Always respond in user's language (Urdu or English)

## STRICT TOPIC RULES — MANDATORY:
- ONLY answer questions related to:
  * JZAI company, services, projects, founder, tech stack, process, pricing
  * AI, Machine Learning, Chatbots, Web Dev — only in context of JZAI
  * How to hire or contact JZAI
- If question is UNRELATED → respond EXACTLY:
  "I'm here to assist with JZAI related questions only. Feel free to ask about our services, projects, or how we can help your business! 🚀"
- NEVER answer: general knowledge, cricket, cooking, politics, weather, math, jokes, history, geography, or anything outside JZAI's scope
- If medical/legal advice → "Please consult a qualified professional for that."

=================================================
# SECTION 2: INTENT DETECTION (MANDATORY)
=================================================
Before answering, classify the query into ONE type:

1. SPECIFIC → one exact fact (price, who, when, service detail)
2. GENERAL → explanation (what is, explain, tell me about)
3. LIST → multiple items (services, technologies, features)
4. COMPARISON → difference between things
5. ACTION → how-to / steps

### Response Length by Intent:
- SPECIFIC → 1–2 line answer only
- GENERAL → structured explanation
- LIST → bullet points (3+ items)
- COMPARISON → clean side-by-side
- ACTION → step-by-step

=================================================
# SECTION 3: FORMATTING RULES
=================================================

### SHORT (1–2 lines):
- Plain sentence only — NO headings, NO bullets

### MEDIUM (3–5 lines):
- Use **bold heading** + short explanation

### LONG / COMPLEX:
**Heading**
Brief explanation

**Key Points:**
* Point 1
* Point 2
* Point 3

### Strict Rules:
- Use headings ONLY for medium/long answers
- Use bullets ONLY if 3+ items
- NEVER add blank lines between bullet points
- Keep responses compact and clear
- Maximum 2 highlights (**bold**) per response
- NEVER bold full sentences
- NEVER use colons or semicolons mid-sentence

=================================================
# SECTION 4: JZAI KNOWLEDGE BASE
=================================================

## About JZAI:
JZAI is a next-generation AI engineering and web development agency. We specialize in building intelligent systems, automation pipelines, and high-performance digital products for businesses worldwide.

**Founder:** Jahanzaib Tahir
- Associate AI Engineer
- Skills: Python, AI/ML, TensorFlow, React, Node.js, JavaScript, HTML/CSS, n8n Automation, REST APIs
- Certifications: IBM AI Fundamentals (2026), C++ Essentials 1 — Cisco Networking Academy (2026)
- Location: Rawalpindi, Pakistan
- Email: jahanzaibtahir2006@gmail.com
- LinkedIn: linkedin.com/in/jahanzaibtahir
- GitHub: github.com/jahanzaibtahir2006

## Our Services:

**01 — AI & Machine Learning**
Custom AI models, LLM integrations, computer vision, and intelligent automation pipelines.
Technologies: Python, TensorFlow, PyTorch, scikit-learn, LLMs, Claude API, OpenAI API

**02 — Web Development**
High-performance web applications from landing pages to full SaaS platforms.
Technologies: React, Next.js, Node.js, HTML/CSS, Tailwind CSS, JavaScript

**03 — AI Chatbots & NLP**
Intelligent conversational agents, RAG systems, and NLP solutions with human-like interactions.
Technologies: Claude API, OpenAI API, n8n, Webhooks, RAG, LangChain

**04 — Cloud & DevOps**
Cloud infrastructure, CI/CD pipelines, containerization and microservices architecture.
Technologies: AWS, Docker, Kubernetes, GitHub Actions

**05 — Data Engineering**
End-to-end data pipelines, analytics dashboards, and data warehousing solutions.
Technologies: Python, Pandas, NumPy, SQL, Tableau, Power BI

**06 — UI/UX Design**
User-centric design systems, prototypes, and brand identities.
Technologies: Figma, Adobe XD, Design Systems

## Our Projects:

**JZAI Website** (In Progress)
- Company portfolio website with dark/light theme toggle, animations, and chatbot integration
- Tech Stack: HTML, CSS, JavaScript, OpenAI API

## Our Process:
1. **Discovery** — Deep dive into your goals and requirements
2. **Architecture** — System design and tech stack selection
3. **Build & Iterate** — Agile development with continuous delivery
4. **Launch & Scale** — Deployment, monitoring, and ongoing support

## Why JZAI:
- **Fast Delivery** — Agile sprints with quick turnaround
- **Precision Engineering** — Every detail is optimized
- **AI-First Approach** — We integrate intelligence into everything we build
- **Affordable** — Startup-friendly pricing for quality work

## Contact JZAI:
- Email: jahanzaibtahir2006@gmail.com
- LinkedIn: linkedin.com/in/jahanzaibtahir
- GitHub: github.com/jahanzaibtahir2006
- Location: Rawalpindi, Pakistan

## Tech Stack We Use:
Python, TensorFlow, PyTorch, scikit-learn, React, Next.js, Node.js, JavaScript, TypeScript, HTML/CSS, Tailwind CSS, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, Redis, Firebase, Figma, n8n, LangChain, Claude API, OpenAI API, Git/GitHub

=================================================
# SECTION 5: LINK RULES
=================================================
- NEVER show raw URLs unless necessary
- Use HTML anchor tags for links
- Format: 🔗 <a href="[URL]" target="_blank">[Link Text]</a>

=================================================
# END OF SYSTEM PROMPT
=================================================`;

  /* ══════════════════════════════════════════
     HISTORY & SESSION
  ══════════════════════════════════════════ */
  var HISTORY_KEY  = 'jzai_chat_history';
  var SESSION_KEY  = 'jzai_session_id';
  var chatHistory  = [];
  var unreadCount  = 0;

  function saveHistory(h) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-30))); } catch(e) {}
  }
  function loadHistory() {
    try { var h = localStorage.getItem(HISTORY_KEY); return h ? JSON.parse(h) : []; } catch(e) { return []; }
  }
  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch(e) {}
  }

  var sessionId = sessionStorage.getItem(SESSION_KEY) || (function(){
    var id = 'jzai_' + Math.random().toString(36).substr(2,10) + '_' + Date.now();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  })();

  /* ══════════════════════════════════════════
     QUICK QUESTIONS
  ══════════════════════════════════════════ */
  var ALL_QUESTIONS = [
    'What services does JZAI offer?',
    'Who founded JZAI?',
    'What AI technologies do you use?',
    'How can I contact JZAI?',
    'What is your web development process?',
    'Do you build custom AI models?',
    'What tech stack does JZAI use?',
    'Can you build a chatbot for my business?',
    'What makes JZAI different?'
  ];
  function getRandomQuestions(n) {
    return ALL_QUESTIONS.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, n);
  }
/* ══════════════════════════════════════════
   LEAD COLLECTION
══════════════════════════════════════════ */
var LEAD_URL = 'https://script.google.com/macros/s/AKfycbww4pz7wzAl_5uGaacDCFllNJpHU7upu9BaRd4rElA7-b59O1G1iyaHWZ12xISO1pBN/exec';
var leadData = {};
var leadStep = null; // null = not collecting

var LEAD_STEPS = ['name', 'email', 'service', 'budget', 'message'];
var LEAD_PROMPTS = {
  name:    "Great! Let's get you connected with Jahanzaib. 😊\n\nFirst, **what's your name?**",
  email:   "Nice to meet you, {name}! 📧\n\n**What's your email address?**",
  service: "Perfect! **Which service are you interested in?**\n\n- AI / Machine Learning\n- Web Development\n- AI Chatbot\n- Cloud / DevOps\n- Data Engineering\n- UI/UX Design",
  budget:  "Got it! **What's your approximate budget?**\n\n- Under $500\n- $500 – $2,000\n- $2,000 – $5,000\n- $5,000+",
  message: "Almost done! 🚀\n\n**Briefly describe your project or requirements:**"
};
var LEAD_TRIGGER_KEYWORDS = [
  'hire', 'contact', 'get started', 'work with', 'project',
  'quote', 'price', 'cost', 'discuss', 'consult', 'interested',
  'build', 'create', 'develop', 'help me', 'need'
];

function isLeadTrigger(text) {
  var lower = text.toLowerCase();
  return LEAD_TRIGGER_KEYWORDS.some(function(k){ return lower.includes(k); });
}

function startLeadCollection() {
  leadData = {}; leadStep = 0;
  addMsg('bot', LEAD_PROMPTS['name']);
}

function handleLeadStep(userInput) {
  var field = LEAD_STEPS[leadStep];
  
  // Email validation
  if (field === 'email' && !/\S+@\S+\.\S+/.test(userInput)) {
    addMsg('bot', "⚠️ That doesn't look like a valid email. Please enter a valid email address:");
    return;
  }
  
  leadData[field] = userInput;
  var nextStep = leadStep + 1;
  
  if (nextStep >= LEAD_STEPS.length) {
    leadStep = null;
    addMsg('bot', "✅ **Thank you, " + leadData.name + "!**\n\nYour details have been sent to Jahanzaib. He'll reach out to you at **" + leadData.email + "** very soon! 🚀");
    submitLead(leadData);
  } else {
    leadStep = nextStep;
    var prompt = LEAD_PROMPTS[LEAD_STEPS[leadStep]];
    prompt = prompt.replace('{name}', leadData.name || 'there');
    addMsg('bot', prompt);
  }
}

function submitLead(data) {
  fetch(LEAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(function(e){ console.error('Lead submit error:', e); });
}
  var TYPING_STATUSES = [
    'Thinking...', 'Processing your request...', 'Analyzing...', 'Generating response...', 'Almost ready...'
  ];

  /* ══════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════ */
  var style = document.createElement('style');
  style.textContent = `
    #nxc-toggle {
      position:fixed; bottom:28px; right:28px; z-index:9998;
      width:58px; height:58px; border-radius:50%; border:none; cursor:pointer;
      background:linear-gradient(135deg,#9f1239,#e11d48);
      box-shadow:0 4px 24px rgba(225,29,72,0.5);
      display:flex; align-items:center; justify-content:center;
      transition:transform 0.3s, box-shadow 0.3s;
      animation:nxc-pop 0.5s cubic-bezier(0.34,1.56,0.64,1);
    }
    #nxc-toggle:hover { transform:scale(1.1); box-shadow:0 8px 32px rgba(225,29,72,0.6); }
    #nxc-toggle.open { transform:rotate(90deg) scale(1.05); }
    @keyframes nxc-pop { from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;} }
    #nxc-badge {
      position:absolute; top:-4px; right:-4px;
      background:#e11d48; color:#fff; border-radius:50%;
      width:20px; height:20px; font-size:11px; font-weight:700;
      display:none; align-items:center; justify-content:center;
      border:2px solid #080808;
    }
    #nxc-badge.show { display:flex; }
    #nxc-bubble {
      position:fixed; bottom:34px; right:96px; z-index:9997;
      background:linear-gradient(135deg,#0f0f0f,#1a0508);
      border:1px solid rgba(225,29,72,0.3);
      border-radius:14px; padding:12px 16px;
      font-family:'DM Sans',sans-serif; font-size:13px; color:#f0f0f0;
      max-width:210px; box-shadow:0 8px 32px rgba(0,0,0,0.5);
      display:flex; align-items:center; gap:10px;
      animation:nxc-bubble-in 0.4s ease; cursor:pointer;
    }
    @keyframes nxc-bubble-in { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
    #nxc-bubble.hide { animation:nxc-bubble-out 0.3s ease forwards; }
    @keyframes nxc-bubble-out { to{opacity:0;transform:translateY(10px);} }
    .nxc-bubble-dot { width:8px; height:8px; border-radius:50%; background:#e11d48; flex-shrink:0; animation:nxc-blink 2s infinite; }
    @keyframes nxc-blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
    #nxc-bubble-close {
      position:absolute; top:-8px; right:-8px;
      width:20px; height:20px; border-radius:50%;
      background:#1a1a1a; border:1px solid #333;
      color:#888; font-size:10px; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    #nxc-bubble-close:hover { background:#e11d48; color:#fff; }
    #nxc-chat {
      position:fixed; bottom:96px; right:28px; z-index:9999;
      width:380px; max-height:calc(100vh - 110px); height:580px; border-radius:16px;
      background:#080808; border:1px solid rgba(225,29,72,0.2);
      box-shadow:0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(225,29,72,0.08);
      display:none; flex-direction:column; overflow:hidden;
      font-family:'DM Sans',sans-serif;
      animation:nxc-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    #nxc-chat.open { display:flex; }
    @keyframes nxc-slide-in { from{opacity:0;transform:translateY(20px) scale(0.95);} to{opacity:1;transform:translateY(0) scale(1);} }
    .nxc-header {
      background:linear-gradient(135deg,#080808 0%,#150308 60%,#1f0510 100%);
      padding:16px 18px 0; flex-shrink:0; position:relative; overflow:hidden;
      border-bottom:1px solid rgba(225,29,72,0.1);
    }
    .nxc-header::before {
      content:''; position:absolute; top:-40px; right:-40px;
      width:120px; height:120px; border-radius:50%;
      background:rgba(225,29,72,0.06);
    }
    .nxc-header-top { display:flex; align-items:center; gap:12px; position:relative; z-index:1; }
    .nxc-logo-wrap {
      width:42px; height:42px; border-radius:10px;
      background:rgba(225,29,72,0.1); border:1.5px solid rgba(225,29,72,0.4);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      font-family:'Syne',sans-serif; font-size:13px; font-weight:800;
      color:#e11d48; letter-spacing:-0.5px;
    }
    .nxc-header-info h3 { font-size:15px; font-weight:700; color:#f0f0f0; letter-spacing:0.2px; }
    .nxc-header-info .nxc-tagline { font-size:11px; color:rgba(240,240,240,0.5); margin-top:2px; }
    .nxc-header-bottom { display:flex; align-items:center; gap:8px; margin-top:10px; position:relative; z-index:1; }
    .nxc-status-pill {
      display:inline-flex; align-items:center; gap:5px;
      background:rgba(225,29,72,0.1); border:1px solid rgba(225,29,72,0.3);
      border-radius:20px; padding:4px 10px; font-size:11px; font-weight:500; color:#f0f0f0;
    }
    .nxc-status-dot { width:6px; height:6px; border-radius:50%; background:#e11d48; animation:nxc-blink 2.2s infinite; }
    .nxc-red-bar { height:3px; background:linear-gradient(90deg,transparent,#e11d48,#9f1239,transparent); margin-top:12px; }
    #nxc-hist-banner {
      background:linear-gradient(135deg,#100306,#150308);
      border-bottom:1px solid rgba(225,29,72,0.1);
      padding:10px 14px; display:none; align-items:center; gap:8px; flex-shrink:0;
    }
    #nxc-hist-banner.show { display:flex; }
    .nxc-hist-text { flex:1; font-size:12px; color:#f0f0f0; font-weight:500; line-height:1.4; }
    .nxc-hist-text span { display:block; font-size:10.5px; color:rgba(240,240,240,0.5); font-weight:400; margin-top:1px; }
    .nxc-hist-btn {
      padding:5px 11px; border-radius:20px; font-size:11px; font-weight:600;
      cursor:pointer; transition:all 0.2s; border:none; flex-shrink:0;
      font-family:'DM Sans',sans-serif;
    }
    #nxc-hist-yes { background:linear-gradient(135deg,#9f1239,#e11d48); color:#fff; }
    #nxc-hist-yes:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(225,29,72,0.3); }
    #nxc-hist-no { background:rgba(225,29,72,0.08); color:rgba(240,240,240,0.5); }
    #nxc-hist-no:hover { background:rgba(225,29,72,0.15); }
    .nxc-messages {
      flex:1; min-height:0; overflow-y:auto; padding:16px 14px;
      display:flex; flex-direction:column; gap:11px; scroll-behavior:smooth;
      scrollbar-width:thin; scrollbar-color:#e11d48 transparent;
    }
/* LIGHT THEME SYNC */
    [data-theme="light"] #nxc-chat {
      background:#fafafa !important;
      border-color:rgba(208,16,46,0.15) !important;
    }
    [data-theme="light"] .nxc-header {
      background:linear-gradient(135deg,#f0f0f5 0%,#e8e8f0 60%,#dddde8 100%) !important;
      border-bottom-color:rgba(208,16,46,0.1) !important;
    }
    [data-theme="light"] .nxc-header-info h3 { color:#0f0f14 !important; }
    [data-theme="light"] .nxc-header-info .nxc-tagline { color:rgba(15,15,20,0.5) !important; }
    [data-theme="light"] .nxc-status-pill { color:#0f0f14 !important; }
    [data-theme="light"] .nxc-messages { background:#fafafa !important; }
    [data-theme="light"] .nxc-msg.nxc-bot .nxc-bubble-msg {
      background:#ffffff !important;
      color:#0f0f14 !important;
      border-color:rgba(208,16,46,0.12) !important;
    }
    [data-theme="light"] #nxc-chat .nxc-bubble-msg img[src*="github"] {
      filter:invert(1) !important;
    }
    [data-theme="light"] .nxc-hist-text span { color:#5a5a6a !important; }
    [data-theme="light"] #nxc-hist-no { background:rgba(208,16,46,0.1) !important; color:#0f0f14 !important; }
    [data-theme="light"] #nxc-hint-btn { color:#0f0f14 !important; font-weight:500 !important; }
    [data-theme="light"] #nxc-bubble div { color:#0f0f14 !important; }
    [data-theme="light"] #nxc-bubble span { color:#5a5a6a !important; }
    [data-theme="light"] .nxc-input-area { background:#f0f0f5 !important; }
    [data-theme="light"] .nxc-input-row {
      background:#ffffff !important;
      border-color:rgba(208,16,46,0.15) !important;
    }
    [data-theme="light"] #nxc-input { color:#0f0f14 !important; }
    [data-theme="light"] #nxc-input::placeholder { color:#9a9aaa !important; }
    [data-theme="light"] .nxc-msg-time { color:#9a9aaa !important; }
    [data-theme="light"] .nxc-powered { color:#9a9aaa !important; }
    [data-theme="light"] .nxc-quick-btn {
      background:#ffffff !important;
      color:#d0102e !important;
    }
    [data-theme="light"] #nxc-hist-banner {
      background:linear-gradient(135deg,#f0f0f5,#e8e8f0) !important;
    }
    [data-theme="light"] .nxc-hist-text { color:#0f0f14 !important; }
    [data-theme="light"] #nxc-bubble {
      background:linear-gradient(135deg,#f0f0f5,#e8e8f0) !important;
      color:#0f0f14 !important;
      border-color:rgba(208,16,46,0.2) !important;
    }
    [data-theme="light"] #nxc-hint-btn {
      color:#0f0f14 !important;
      background:rgba(208,16,46,0.08) !important;
      border-color:rgba(208,16,46,0.3) !important;
    }
    [data-theme="light"] .nxc-hint-dot {
      background:#d0102e !important;
    }
    .nxc-messages::-webkit-scrollbar { width:3px; background:transparent; }
    .nxc-messages::-webkit-scrollbar-track { background:transparent; }
    .nxc-messages::-webkit-scrollbar-thumb { background:#e11d48; border-radius:10px; }
    .nxc-msg { display:flex; gap:8px; animation:nxc-msg-in 0.28s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes nxc-msg-in { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
    .nxc-msg.nxc-user { flex-direction:row-reverse; }
    .nxc-avatar {
      width:30px; height:30px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; margin-top:2px; font-size:11px; font-weight:700;
    }
    .nxc-msg.nxc-bot .nxc-avatar {
      background:rgba(225,29,72,0.1); border:1.5px solid rgba(225,29,72,0.25);
      font-family:'Syne',sans-serif; font-size:10px; font-weight:800; color:#e11d48;
    }
    .nxc-msg.nxc-user .nxc-avatar { background:linear-gradient(135deg,#9f1239,#e11d48); color:#fff; }
    .nxc-msg-col { display:flex; flex-direction:column; max-width:90%; }
    .nxc-msg.nxc-user .nxc-msg-col { align-items:flex-end; }
    .nxc-bubble-msg {
      padding:10px 13px; border-radius:14px;
      font-size:13.5px; line-height:1.58; position:relative;
    }
    .nxc-msg.nxc-user .nxc-bubble-msg {
      background:linear-gradient(135deg,#9f1239,#e11d48); color:#fff;
      border-radius:14px 4px 14px 14px;
    }
    .nxc-msg.nxc-bot .nxc-bubble-msg {
      background:#111; color:#e8e8e8;
      border-radius:4px 14px 14px 14px;
      border:1px solid rgba(225,29,72,0.12);
      box-shadow:0 2px 10px rgba(0,0,0,0.3);
    }
    .nxc-bubble-msg ul { padding-left:18px; margin:0; list-style:disc; }
    .nxc-bubble-msg ol { padding-left:18px; margin:0; list-style:decimal; }
    .nxc-bubble-msg li { margin:0; line-height:1.5; }
    .nxc-bubble-msg strong { font-weight:700; color:#e11d48; }
    .nxc-msg.nxc-user .nxc-bubble-msg strong { color:#fff; }
    .nxc-bubble-msg a { color:#e11d48; text-decoration:underline; }
    .nxc-msg.nxc-user .nxc-bubble-msg a { color:#fca5a5; }
    .nxc-msg-footer { display:flex; align-items:center; gap:6px; margin-top:3px; padding:0 4px; }
    .nxc-msg-time { font-size:10px; color:#444; }
    .nxc-copy-btn {
      display:flex; align-items:center; justify-content:center;
      width:22px; height:22px; border-radius:5px; border:none;
      background:transparent; color:#444; cursor:pointer; transition:all 0.18s; font-size:12px; padding:0;
    }
    .nxc-copy-btn:hover { background:rgba(225,29,72,0.1); color:#e11d48; }
    .nxc-copy-btn.copied { color:#22c55e; }
    .nxc-typing-wrap { display:flex; align-items:center; gap:8px; }
    .nxc-typing-dots { display:flex; align-items:center; gap:4px; padding:4px 2px; }
    .nxc-typing-dots span {
      width:7px; height:7px; border-radius:50%; background:#e11d48;
      animation:nxc-bounce 1.3s ease-in-out infinite;
    }
    .nxc-typing-dots span:nth-child(2) { animation-delay:.16s; }
    .nxc-typing-dots span:nth-child(3) { animation-delay:.32s; }
    @keyframes nxc-bounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-7px);} }
    .nxc-typing-status { font-size:11px; color:#555; font-style:italic; animation:nxc-sfade 1.8s ease-in-out infinite; }
    @keyframes nxc-sfade { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
    .nxc-quick-wrap {
      padding:8px 14px 10px; border-bottom:1px solid rgba(225,29,72,0.07);
      display:none; position:relative;
    }
    .nxc-quick-wrap.show { display:block; }
    .nxc-quick-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; }
    .nxc-quick-btn {
      background:#111; border:1.5px solid rgba(225,29,72,0.2);
      color:rgba(225,29,72,0.85); border-radius:20px; padding:5px 12px;
      font-size:12px; text-align:left; font-family:'DM Sans',sans-serif;
      cursor:pointer; font-weight:500; transition:all .2s;
    }
    .nxc-quick-btn:hover {
      background:linear-gradient(135deg,#9f1239,#e11d48);
      color:#fff; border-color:transparent;
      transform:translateY(-2px); box-shadow:0 4px 12px rgba(225,29,72,0.25);
    }
    .nxc-quick-refresh {
      position:absolute; bottom:10px; right:14px;
      width:26px; height:26px; border-radius:50%;
      background:rgba(225,29,72,0.08); border:1.5px solid rgba(225,29,72,0.2);
      color:#e11d48; cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:all 0.25s;
    }
    .nxc-quick-refresh:hover {
      background:linear-gradient(135deg,#9f1239,#e11d48); color:#fff;
      border-color:transparent; transform:rotate(180deg) scale(1.1);
    }
    #nxc-hint-btn {
      display:flex; align-items:center; gap:5px;
      background:rgba(225,29,72,0.1); border:1.5px solid rgba(225,29,72,0.35);
      border-radius:20px; padding:5px 11px; font-family:'DM Sans',sans-serif;
      font-size:11px; font-weight:600; color:#f0f0f0; cursor:pointer;
      letter-spacing:0.2px; transition:all 0.2s; flex-shrink:0;
    }
    #nxc-hint-btn:hover { background:rgba(225,29,72,0.2); transform:translateY(-1px); }
    #nxc-hint-btn.open { background:rgba(225,29,72,0.2); border-color:rgba(225,29,72,0.7); }
    .nxc-hint-dot { width:6px; height:6px; border-radius:50%; background:#e11d48; flex-shrink:0; animation:nxc-blink 2.2s infinite; }
    .nxc-input-area {
      padding:10px 14px 14px; flex-shrink:0;
      background:#0a0a0a; border-top:1px solid rgba(225,29,72,0.1);
    }
    .nxc-input-row {
      display:flex; align-items:flex-end; gap:8px;
      background:#111; border:1.5px solid rgba(225,29,72,0.15);
      border-radius:12px; padding:8px 8px 8px 14px;
      transition:border-color .2s, box-shadow .2s;
    }
    .nxc-input-row:focus-within {
      border-color:#e11d48; box-shadow:0 0 0 3px rgba(225,29,72,0.1);
    }
    #nxc-input {
      flex:1; border:none; background:transparent;
      font-family:'DM Sans',sans-serif; font-size:13.5px; color:#f0f0f0;
      resize:none; outline:none; max-height:88px; min-height:22px; line-height:1.5;
      overflow-y:hidden; scrollbar-width:none;
    }
    #nxc-input::-webkit-scrollbar { display:none; }
    #nxc-input::placeholder { color:#444; }
    #nxc-send {
      width:36px; height:36px; border-radius:9px;
      background:linear-gradient(135deg,#9f1239,#e11d48);
      border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition:transform .2s, box-shadow .2s, opacity .2s;
    }
    #nxc-send:hover { transform:scale(1.08); box-shadow:0 4px 14px rgba(225,29,72,0.4); }
    #nxc-send:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
    .nxc-footer-bar {
      display:flex; align-items:center; justify-content:center; gap:5px; margin-top:7px;
    }
    .nxc-powered { font-size:10px; color:#333; letter-spacing:.3px; }
    .nxc-footer-dot { width:3px; height:3px; border-radius:50%; background:#222; }
    @media(max-width:480px){
      #nxc-chat { right:10px; bottom:76px; width:calc(100vw - 20px); max-height:calc(100vh - 90px); height:520px; border-radius:12px; }
      #nxc-toggle { right:16px; bottom:16px; width:52px; height:52px; }
      #nxc-bubble { bottom:78px; right:76px; max-width:190px; font-size:12px; padding:10px 13px; }
    }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════
     BUILD UI
  ══════════════════════════════════════════ */
  var bubble = document.createElement('div');
  bubble.id = 'nxc-bubble';
  bubble.innerHTML = `
    <button id="nxc-bubble-close">✕</button>
    <div class="nxc-bubble-dot"></div>
    <div style="line-height:1.3;">
      💬 Ask JZAI Assistant<br>
      <span style="font-size:10px;color:rgba(240,240,240,0.5);">AI Engineering & Web Dev</span>
    </div>`;
  bubble.onclick = function(e){ if(e.target.id==='nxc-bubble-close') return; openChat(); hideBubble(); };
  document.body.appendChild(bubble);
  setTimeout(function(){
    var bc = document.getElementById('nxc-bubble-close');
    if(bc) bc.addEventListener('click',function(e){e.stopPropagation();hideBubble();});
  }, 0);

  function hideBubble(){
    bubble.classList.add('hide');
    setTimeout(function(){ bubble.style.display='none'; }, 300);
  }

  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'nxc-toggle';
  toggleBtn.setAttribute('aria-label','Open JZAI chat');
  toggleBtn.innerHTML = `
    <div id="nxc-badge"></div>
    <svg class="nxc-chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg class="nxc-close-icon" style="display:none;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`;
  document.body.appendChild(toggleBtn);
  var badge = document.getElementById('nxc-badge');

  var win = document.createElement('div');
  win.id = 'nxc-chat';
  win.innerHTML = `
    <div class="nxc-header">
      <div class="nxc-header-top">
        <div class="nxc-logo-wrap">JZ</div>
        <div class="nxc-header-info">
          <h3>JZAI Assistant</h3>
          <div class="nxc-tagline">JZAI — Engineering Intelligence</div>
        </div>
      </div>
      <div class="nxc-header-bottom">
        <div class="nxc-status-pill"><div class="nxc-status-dot"></div><span>Online · Ready to help</span></div>
        <button id="nxc-hint-btn"><div class="nxc-hint-dot"></div>💡 Quick Questions</button>
      </div>
      <div class="nxc-red-bar"></div>
    </div>
    <div id="nxc-hist-banner">
      <div class="nxc-hist-text">👋 Welcome back!<span>Continue where you left off?</span></div>
      <button class="nxc-hist-btn" id="nxc-hist-yes">Continue</button>
      <button class="nxc-hist-btn" id="nxc-hist-no">Fresh Start</button>
    </div>
    <div class="nxc-messages" id="nxc-msgs"></div>
    <div class="nxc-quick-wrap" id="nxc-quick"></div>
    <div class="nxc-input-area">
      <div class="nxc-input-row">
        <textarea id="nxc-input" placeholder="Ask about JZAI services..." rows="1"></textarea>
        <button id="nxc-send" aria-label="Send">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div class="nxc-footer-bar">
        <span class="nxc-powered">Powered by OpenAI</span>
        <div class="nxc-footer-dot"></div>
        <span class="nxc-powered">JZAI</span>
      </div>
    </div>`;
  document.body.appendChild(win);

  var msgs      = document.getElementById('nxc-msgs');
  var input     = document.getElementById('nxc-input');
  var sendBtn   = document.getElementById('nxc-send');
  var quickDiv  = document.getElementById('nxc-quick');
  var hintBtn   = document.getElementById('nxc-hint-btn');
  var histBanner= document.getElementById('nxc-hist-banner');
  var isOpen=false, hintOpen=false;

  var saved = loadHistory();
  if (saved.length > 1) {
    histBanner.classList.add('show');
    document.getElementById('nxc-hist-yes').addEventListener('click', function(){
      histBanner.classList.remove('show');
      chatHistory = saved; msgs.innerHTML = '';
      saved.forEach(function(m){ renderMsg(m.role, m.text, false); });
      msgs.scrollTop = msgs.scrollHeight;
    });
    document.getElementById('nxc-hist-no').addEventListener('click', function(){
      histBanner.classList.remove('show');
      clearHistory(); chatHistory = [];
      addMsg('bot', "Hey! 👋 I'm **JZAI Assistant**, your AI guide for JZAI.\n\nAsk me about our services, tech stack, projects, or anything else!");
    });
  } else {
    addMsg('bot', "Hey! 👋 I'm **JZAI Assistant**, your AI guide for JZAI.\n\nAsk me about our services, tech stack, projects, or anything else!");
  }

  function loadQuickQuestions(){
    quickDiv.innerHTML = '';
    var qs = getRandomQuestions(4);
    var r1 = document.createElement('div'); r1.className = 'nxc-quick-row';
    var r2 = document.createElement('div'); r2.className = 'nxc-quick-row';
    var refreshBtn = document.createElement('button');
    refreshBtn.className = 'nxc-quick-refresh';
    refreshBtn.title = 'Refresh questions';
    refreshBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
    refreshBtn.addEventListener('click', function(){
      this.style.transform='rotate(180deg)';
      var self=this; setTimeout(function(){ self.style.transform=''; },300);
      loadQuickQuestions();
    });
    qs.forEach(function(q, i){
      var b = document.createElement('button');
      b.className = 'nxc-quick-btn'; b.textContent = q;
      b.onclick = function(){ closeQuickPanel(); input.value=q; sendMessage(); };
      if(i<2) r1.appendChild(b); else r2.appendChild(b);
    });
    quickDiv.appendChild(r1); quickDiv.appendChild(r2); quickDiv.appendChild(refreshBtn);
  }
  function openQuickPanel(){ loadQuickQuestions(); quickDiv.classList.add('show'); }
  function closeQuickPanel(){ quickDiv.classList.remove('show'); hintOpen=false; hintBtn.classList.remove('open'); }

  hintBtn.addEventListener('click', function(){
    hintOpen = !hintOpen; hintBtn.classList.toggle('open', hintOpen);
    if(hintOpen) openQuickPanel(); else closeQuickPanel();
  });
  input.addEventListener('input', function(){
    if(input.value.trim().length > 0 && hintOpen) closeQuickPanel();
  });

  function openChat(){
    isOpen = true; win.classList.add('open'); toggleBtn.classList.add('open');
    toggleBtn.querySelector('.nxc-chat-icon').style.display='none';
    toggleBtn.querySelector('.nxc-close-icon').style.display='block';
    unreadCount=0; badge.classList.remove('show');
    setTimeout(function(){ input.focus(); }, 300);
  }
  function closeChat(){
    isOpen = false; win.classList.remove('open'); toggleBtn.classList.remove('open');
    toggleBtn.querySelector('.nxc-chat-icon').style.display='block';
    toggleBtn.querySelector('.nxc-close-icon').style.display='none';
    closeQuickPanel();
  }
  toggleBtn.addEventListener('click', function(){
    if(isOpen) closeChat(); else { openChat(); hideBubble(); }
  });
  input.addEventListener('input', function(){
    input.style.height='auto';
    input.style.height = Math.min(input.scrollHeight, 88)+'px';
  });
  input.addEventListener('keydown', function(e){
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  async function sendMessage(){
    var text = input.value.trim();
    if(!text || sendBtn.disabled) return;
    closeQuickPanel();
    addMsg('user', text);
    input.value=''; input.style.height='auto'; sendBtn.disabled=true;
    var status = TYPING_STATUSES[Math.floor(Math.random()*TYPING_STATUSES.length)];
    var tid = addTyping(status);

    var apiMessages = chatHistory
      .filter(function(m){ return m.role !== 'bot' || m.text !== chatHistory[0].text; })
      .map(function(m){
        return { role: m.role==='bot'?'assistant':'user', content: m.text };
      });
    var contextMessages = apiMessages.slice(-20);

    try {
      var response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: contextMessages })
      });
      removeTyping(tid);
      if(!response.ok) throw new Error('API Error: ' + response.status);
      var data = await response.json();
      var reply = data.reply ? data.reply : "I'm having trouble connecting. Please try again!";
      addMsg('bot', reply);
      if(!isOpen){
        unreadCount++;
        badge.textContent = unreadCount>9?'9+':String(unreadCount);
        badge.classList.add('show');
      }
    } catch(err){
      removeTyping(tid);
      addMsg('bot', '⚠️ Connection issue. Please try again in a moment.');
      console.error('JZAI Chatbot Error:', err);
    }
    sendBtn.disabled=false; input.focus();
  }

function formatMessage(text){
    if(/<[a-z][\s\S]*>/i.test(text)){
      return text.replace(/\n/g,'<br>');
    }
    text = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    var lines=text.split('\n'), html=[], inUL=false, inOL=false;
    lines.forEach(function(line){
      var ul=line.match(/^[\-\•]\s+(.+)/), ol=line.match(/^\d+[\.\)]\s+(.+)/);
      if(ul){ if(inOL){html.push('</ol>');inOL=false;} if(!inUL){html.push('<ul>');inUL=true;} html.push('<li>'+ul[1]+'</li>'); }
      else if(ol){ if(inUL){html.push('</ul>');inUL=false;} if(!inOL){html.push('<ol>');inOL=true;} html.push('<li>'+ol[1]+'</li>'); }
      else{ if(inUL){html.push('</ul>');inUL=false;} if(inOL){html.push('</ol>');inOL=false;} html.push(line.trim()===''?'<br>':line+'<br>'); }
    });
    if(inUL)html.push('</ul>'); if(inOL)html.push('</ol>');
    return html.join('');
  }

  function makeCopyBtn(bubbleEl){
    var btn=document.createElement('button'); btn.className='nxc-copy-btn'; btn.title='Copy';
    btn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    btn.onclick=function(){
      navigator.clipboard.writeText(bubbleEl.innerText||bubbleEl.textContent).then(function(){
        btn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add('copied');
        setTimeout(function(){ btn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'; btn.classList.remove('copied'); },2000);
      }).catch(function(){});
    };
    return btn;
  }

  function renderMsg(role, text, withCopy){
    var isBot = role==='bot';
    var wrap=document.createElement('div'); wrap.className='nxc-msg '+(isBot?'nxc-bot':'nxc-user');
    var av=document.createElement('div'); av.className='nxc-avatar';
    av.textContent = isBot ? 'JZ' : 'You';
    var col=document.createElement('div'); col.className='nxc-msg-col';
    var bub=document.createElement('div'); bub.className='nxc-bubble-msg'; bub.innerHTML=formatMessage(text);
    var footer=document.createElement('div'); footer.className='nxc-msg-footer';
    var time=document.createElement('div'); time.className='nxc-msg-time';
    time.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    footer.appendChild(time);
    if(isBot && withCopy!==false){ footer.appendChild(makeCopyBtn(bub)); }
    col.appendChild(bub); col.appendChild(footer);
    wrap.appendChild(av); wrap.appendChild(col);
    msgs.appendChild(wrap); msgs.scrollTop=msgs.scrollHeight;
  }

  function addMsg(role, text){
    renderMsg(role, text, true);
    chatHistory.push({role:role, text:text}); saveHistory(chatHistory);
  }

  function addTyping(statusText){
    var id='nxc-typing-'+Date.now();
    var wrap=document.createElement('div'); wrap.className='nxc-msg nxc-bot'; wrap.id=id;
    wrap.innerHTML=`
      <div class="nxc-avatar" style="font-family:'Syne',sans-serif;font-size:10px;font-weight:800;color:#e11d48;background:rgba(225,29,72,0.1);border:1.5px solid rgba(225,29,72,0.25);border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">JZ</div>
      <div class="nxc-bubble-msg" style="background:#111;border:1px solid rgba(225,29,72,0.12);border-radius:4px 14px 14px 14px;padding:10px 13px;">
        <div class="nxc-typing-wrap">
          <div class="nxc-typing-dots"><span></span><span></span><span></span></div>
          <span class="nxc-typing-status">${statusText||'Thinking...'}</span>
        </div>
      </div>`;
    msgs.appendChild(wrap); msgs.scrollTop=msgs.scrollHeight; return id;
  }
  function removeTyping(id){ var el=document.getElementById(id); if(el) el.remove(); }

  // Theme sync with website
var themeObserver = new MutationObserver(function() {
  var theme = document.documentElement.getAttribute('data-theme');
});
themeObserver.observe(document.documentElement, {
  attributes: true, attributeFilter: ['data-theme']
});

})();
