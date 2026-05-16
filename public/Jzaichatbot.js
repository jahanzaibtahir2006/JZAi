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
  //fetching real time currency rate for sevices pricing/budget
  var exchangeRates = { PKR: 280, INR: 83, GBP: 0.79, EUR: 0.92, JPY: 150 };

fetch(BACKEND_URL + '/exchange')
  .then(function(r){ return r.json(); })
  .then(function(rates){ 
    exchangeRates = rates;
  })
  .catch(function(){ console.log('Using fallback rates'); });
  //type status 
  const TYPING_STATUSES = ['Typing...', 'Thinking...', 'Processing...'];


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
var LEAD_URL = 'https://small-wildflower-c0d4.jahanzaibtahir2006.workers.dev/lead';
var leadData = {};
var leadStep = null;

var LEAD_STEPS = ['name', 'email', 'service', 'budget', 'message'];
var LEAD_PROMPTS = {
  name:    "Great! Let's get you connected with Jahanzaib. 😊\n\nFirst, **what's your name?**",
  email:   "Nice to meet you, {name}! 📧\n\n**What's your email address?**",
  service: "Perfect! **Which service are you interested in?**\n\n- AI / Machine Learning\n- Web Development\n- AI Chatbot\n- Cloud / DevOps\n- Data Engineering\n- UI/UX Design",
  budget:  "Great choice! 💰\n\n**What's your approximate budget? (in USD)**",
  message: "Almost done! 🚀\n\n**Briefly describe your project or requirements:**"
};

var BUDGET_BUTTONS = [
  '💬 Simple FAQ Chatbot — $100–$300',
  '🤖 Custom AI Chatbot — $300–$800',
  '📚 RAG Based Chatbot — $500–$1,500',
  '🌐 Full NLP + Multi-language — $1,000–$3,000',
  '🏢 Enterprise Level — $3,000+'
];

var NAME_BLACKLIST = [
  // Hacker/tech
  'hacker','admin','root','user','bot','ai','system','anonymous','anon',
  // Common English words
  'kidding','joking','serious','testing','fine','okay','good','back',
  'here','ready','done','free','busy','tired','happy','sad','bored',
  'angry','excited','confused','lost','stuck','available','unavailable',
  'interested','sure','right','wrong','a','an','the','just','only','also',
  'there','this','that','it','yes','no','maybe','not','new','old',
  // Professions
  'photographer','developer','engineer','designer','student','teacher',
  'doctor','manager','founder','ceo','director','programmer','freelancer',
  'consultant','analyst','architect','scientist','researcher','writer',
  // Random objects/words
  'nobody','someone','anyone','everyone','nothing','something','anything',
  'paint','door','tree','table','car','phone','computer','laptop','chair',
  'book','pen','water','food','house','room','city','country','world'
];

function isBlacklistedName(name) {
  var lower = name.toLowerCase().trim();
  return NAME_BLACKLIST.some(function(word) {
    return lower === word || lower.startsWith(word + ' ') || lower.endsWith(' ' + word);
  });
}


function capitalizeName(name) {
  return name.trim().split(' ')
    .filter(Boolean)
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function isUserCancelling(text) {
  var lower = text.toLowerCase().trim();
  var negativePatterns = [
    /^(no|nahi|nope|nai)$/,          // exact match only — "no" alone
    /don'?t\s+want/,
    /not\s+(interested|comfortable|sure)/,
    /why\s+(should|do|am|i)/,
    /\b(skip|cancel|stop|exit|quit)\b/,
    /not\s+share/,
    /privacy/,
    /\b(leave|bye|goodbye)\b/
  ];
  return negativePatterns.some(function(p){ return p.test(lower); });
}

function showBudgetButtons() {
  addBotButtons("Got it! **What's your approximate budget?**", BUDGET_BUTTONS, function(selected) {
    addMsg('user', selected);
    leadData.budget = selected;
    leadStep++;
    // Next step check karo
    if (leadStep >= LEAD_STEPS.length) {
      submitLead(leadData);
      return;
    }
    var nextField = LEAD_STEPS[leadStep];
    var prompt = LEAD_PROMPTS[nextField];
    prompt = prompt.replace('{name}', leadData.name || 'there');
    addMsg('bot', prompt);
  });
}

  function extractName(text) {
  var match = text.match(/my name is ([a-zA-Z\s]{2,20})/i)
           || text.match(/i(?:'?m| am) ([a-zA-Z]{2,20})/i)
           || text.match(/call me ([a-zA-Z]{2,20})/i);
  return match ? capitalizeName(match[1].trim()) : null;
}
  
function startLeadCollection(service, budget) {
  leadData = {
    name: leadData.name || null,
    email: leadData.email || null
  };
  if (service && service !== 'General') leadData.service = service;
  if (budget && budget !== '') leadData.budget = budget;

  // Chat history se detect karo
  for (var i = 0; i < chatHistory.length; i++) {
    var m = chatHistory[i];
    if (m.role === 'user') {
      // Name detect
      if (!leadData.name) {
        var detected = extractName(m.text);
        if (detected) leadData.name = detected;
      }
      // Email detect
      if (!leadData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.text.trim())) {
        leadData.email = m.text.trim();
      }
      // Message detect
      if (!leadData.message) {
        var txt = m.text.trim();
        var wordCount = txt.split(/\s+/).length;
        var hasDescriptiveWords = /need|want|require|build|create|make|for my|that can|which will/i.test(txt);
        if (wordCount >= 15 && hasDescriptiveWords) {
          leadData.message = txt;
        }
      }
    }
    
    // Bot response se name detect karo
    if (m.role === 'bot' && !leadData.name) {
      var botNameMatch = m.text.match(/(?:hi|hey|hello|nice to meet you)[,\s]+([A-Z][a-z]{1,15})/i)
                || m.text.match(/([A-Z][a-z]{1,15})[,\s]+(?:how can|what can|glad)/i)
                || m.text.match(/great to meet you[,\s]+([A-Z][a-z]{1,15})/i)
                || m.text.match(/your name is ([A-Z][a-z]{1,15})/i)
                || m.text.match(/meet you,?\s+([A-Z][a-z]{1,15})/i);
      
      if (botNameMatch) {
        leadData.name = capitalizeName(botNameMatch[1]);
      }
    }
    if (m.role === 'bot' && !leadData.budget) {
      var budgetMatch = m.text.match(/(Simple FAQ Chatbot|Custom AI Chatbot|RAG Based Chatbot|Full NLP \+ Multi-language|Enterprise Level)[^\$]*(\$[\d,]+\s*[–-]\s*\$[\d,]+|\$[\d,]+\+?)/i);
      if (budgetMatch) {
        leadData.budget = budgetMatch[1] + ' — ' + budgetMatch[2];
      }
    }
  }

  
  // Pehle bhare fields skip karo
  leadStep = 0;
  while (leadStep < LEAD_STEPS.length && leadData[LEAD_STEPS[leadStep]]) {
    leadStep++;
  }

  // Sab already hai — seedha submit karo
  if (leadStep >= LEAD_STEPS.length) {
    addMsg('bot', "✅ Got everything I need, " + (leadData.name || 'there') + "! Jahanzaib will reach out to you very soon! 🚀");
    submitLead(leadData);
    return;
  }

  // Sirf ek jagah prompt show karo
  var currentField = LEAD_STEPS[leadStep];
  if (currentField === 'budget') {
    showBudgetButtons();
  } else {
    var prompt = LEAD_PROMPTS[currentField];
    prompt = prompt.replace('{name}', leadData.name || 'there');
    addMsg('bot', prompt);
  }
}

var SERVICE_PRICES = [
  { label: 'Simple FAQ Chatbot — $100–$300', emoji: '💬', min: 100, max: 300 },
  { label: 'Custom AI Chatbot — $300–$800', emoji: '🤖', min: 300, max: 800 },
  { label: 'RAG Based Chatbot — $500–$1,500', emoji: '📚', min: 500, max: 1500 },
  { label: 'Full NLP + Multi-language — $1,000–$3,000', emoji: '🌐', min: 1000, max: 3000 },
  { label: 'Enterprise Level — $3,000+', emoji: '🏢', min: 3000, max: Infinity }
];

function detectServiceFromText(text) {
  var lower = text.toLowerCase();
  if (lower.includes('faq') || lower.includes('simple')) return SERVICE_PRICES[0];
  if (lower.includes('custom') || lower.includes('ai chatbot')) return SERVICE_PRICES[1];
  if (lower.includes('rag')) return SERVICE_PRICES[2];
  if (lower.includes('nlp') || lower.includes('multi')) return SERVICE_PRICES[3];
  if (lower.includes('enterprise')) return SERVICE_PRICES[4];
  return null;
}

function handleLeadStep(userInput) {
  var field = LEAD_STEPS[leadStep];


  // Cancel detection
  if (isUserCancelling(userInput)) {
    leadStep = null;
    leadData = {};
    addMsg('bot', "No problem at all! 😊 Feel free to ask me anything about JZAI.");
    return;
  }

  // Name step
  if (field === 'name') {
    var words = userInput.trim().split(/\s+/);
    if (words.length > 3) {
      addMsg('bot', "😊 Please enter just your name:");
      return;
    }
    var nameMatch = userInput.match(/my name is ([a-zA-Z\s]{2,20})/i)
                 || userInput.match(/i(?:'?m| am) ([a-zA-Z]{2,20})/i);
    if (nameMatch) {
      leadData.name = capitalizeName(nameMatch[1].trim());
    } else {
      leadData.name = capitalizeName(userInput.trim());
    }
    leadStep++;
    var prompt = LEAD_PROMPTS[LEAD_STEPS[leadStep]];
    prompt = prompt.replace('{name}', leadData.name);
    addMsg('bot', prompt);
    return;
  }

  // Email step
  if (field === 'email') {
    var words = userInput.trim().split(/\s+/);
    if (words.length > 2 && !/\S+@\S+\.\S+/.test(userInput)) {
      leadStep = null;
      leadData = {};
      addMsg('bot', "No problem! Feel free to ask me anything about JZAI. 😊");
      return;
    }
    var cleanEmail = userInput.trim();
    if (/\s/.test(cleanEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      addMsg('bot', "⚠️ That doesn't look like a valid email. Please enter a valid email address (no spaces):");
      return;
    }
  }

// Budget handling
if (field === 'budget') {
  var budgetLower = userInput.toLowerCase();
  var amountMatch = userInput.match(/[$£€₹¥₨Rs]?\s*(\d+[\d,]*)\s*[$£€₹¥₨]?/i);
  if (amountMatch) {
    var rawAmount = amountMatch[1].replace(',', '');
    var amount = parseInt(rawAmount);
    var currency = '';
    if (userInput.includes('$')) currency = '$';
    else if (userInput.includes('£')) currency = '£';
    else if (userInput.includes('€')) currency = '€';
    else if (userInput.includes('₹')) currency = '₹';
    else if (/rs|pkr|₨|rupee|روپے/i.test(userInput)) currency = 'PKR';
    var usdAmount = amount;
    if (currency === 'PKR') usdAmount = Math.round(amount / exchangeRates.PKR);
    else if (currency === '₹') usdAmount = Math.round(amount / exchangeRates.INR);
    else if (currency === '£') usdAmount = Math.round(amount / exchangeRates.GBP);
    else if (currency === '€') usdAmount = Math.round(amount / exchangeRates.EUR);
    else if (currency === '¥') usdAmount = Math.round(amount / exchangeRates.JPY);
    var budgetLabel = '', botReply = '';
    var detectedService = detectServiceFromText(userInput);
    if (usdAmount < 100) {
      budgetLabel = (currency || '') + rawAmount + ' (discussed with Jahanzaib)';
      botReply = "I understand! 😊 Our minimum starts at **$100**. Jahanzaib can discuss a **custom arrangement** for your budget. Let's move forward!";
    } else if (detectedService && usdAmount < detectedService.min) {
      budgetLabel = detectedService.label + ' (budget to be discussed)';
      botReply = detectedService.emoji + " **" + detectedService.label.split('—')[0].trim() + "** starts at **$" + detectedService.min + "** — your budget is a little short. But Jahanzaib can discuss a **custom arrangement**! 😊 Let's move forward!";
    } else {
      var matched = null;
      for (var i = 0; i < SERVICE_PRICES.length; i++) {
        if (usdAmount >= SERVICE_PRICES[i].min && usdAmount <= SERVICE_PRICES[i].max) {
          matched = SERVICE_PRICES[i];
          break;
        }
      }
      if (matched) {
        budgetLabel = matched.label;
        botReply = "Perfect! " + matched.emoji + " **" + matched.label.split('—')[0].trim() + "** fits your budget!";
      } else {
        budgetLabel = userInput;
        botReply = "Got it! I've noted your budget. 📝 Let's move forward!";
      }
    }
    leadData['budget'] = budgetLabel;
    // Agar service pehle se detect nahi hui toh matched service save karo
    if (!leadData.service && matched) leadData.service = matched.label.split('—')[0].trim();
    addMsg('bot', botReply);
    leadStep++;
    var p1 = LEAD_PROMPTS[LEAD_STEPS[leadStep]];
    p1 = p1.replace('{name}', leadData.name || 'there');
    setTimeout(function(){ addMsg('bot', p1); }, 1200);
    return;
  }
  if (budgetLower.includes('low') || budgetLower.includes('cheap') ||
      budgetLower.includes('afford') || budgetLower.includes('less') ||
      budgetLower.includes('kam') || budgetLower.includes('thora') ||
      budgetLower.includes('sasta') || budgetLower.includes('limited')) {
    addMsg('bot', "No worries! 😊 Our most affordable option starts at just **$100**. Jahanzaib can also discuss **flexible arrangements**. Let's proceed!");
    leadData['budget'] = 'Low budget (to be discussed)';
    leadStep++;
    var p2 = LEAD_PROMPTS[LEAD_STEPS[leadStep]];
    p2 = p2.replace('{name}', leadData.name || 'there');
    setTimeout(function(){ addMsg('bot', p2); }, 1200);
    return;
  }
  if (!BUDGET_BUTTONS.some(function(b){ return userInput === b; })) {
    addMsg('bot', "Got it! I've noted your budget. 📝 Let's move forward!");
    leadData['budget'] = userInput;
    leadStep++;
    var p3 = LEAD_PROMPTS[LEAD_STEPS[leadStep]];
    p3 = p3.replace('{name}', leadData.name || 'there');
    setTimeout(function(){ addMsg('bot', p3); }, 800);
    return;
  }
}
  
  // Field save karo
  if (field === 'name') {
    leadData[field] = capitalizeName(userInput);
  } else {
    leadData[field] = userInput;
  }

  var nextStep = leadStep + 1;
  while (nextStep < LEAD_STEPS.length && leadData[LEAD_STEPS[nextStep]]) {
    nextStep++;
  }

  if (nextStep >= LEAD_STEPS.length) {
    leadStep = null;
    addMsg('bot', "✅ **Thank you, " + leadData.name + "!**\n\nYour details have been sent to Jahanzaib. He'll reach out to you at **" + leadData.email + "** very soon! 🚀");
    submitLead(leadData);
  } else {
    leadStep = nextStep;
    var currentField = LEAD_STEPS[leadStep];
    if (currentField === 'budget') {
      showBudgetButtons();
    } else {
      var prompt = LEAD_PROMPTS[currentField];
      prompt = prompt.replace('{name}', leadData.name || 'there');
      addMsg('bot', prompt);
    }
  }
}

function submitLead(data) {
  fetch(LEAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(r){ return r.json(); })
  .then(function(result){ console.log('Lead saved:', result); })
  .catch(function(e){ console.error('Lead submit error:', e); });
}
  
  /* ══════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════ */
  var style = document.createElement('style');
  style.textContent = `
   #nxc-toggle {
  position:fixed !important; bottom:28px !important; right:28px !important; z-index:2147483647 !important;
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
  position:fixed !important; bottom:34px !important; right:96px !important; z-index:2147483645 !important;
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
  position:fixed !important; bottom:96px !important; right:28px !important; z-index:2147483646 !important;
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
      padding:16px 18px 0; flex-shrink:0; position:relative;
      border-bottom:1px solid rgba(225,29,72,0.1);
    }
    .nxc-header::before {
      content:''; position:absolute; top:-40px; right:-40px;
      width:120px; height:120px; border-radius:50%;
      background:rgba(225,29,72,0.06);
    }
    .nxc-header-top { display:flex; align-items:center; gap:12px; position:relative; z-index:1; padding-right:36px; }
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
      display:flex; flex-direction:column; gap:11px; scroll-behavior:auto;
      scrollbar-width:thin; scrollbar-color:#e11d48 transparent;
      justify-content:flex-start;
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
    .nxc-input-right {
      display:flex; flex-direction:column; align-items:center;
      justify-content:flex-end; gap:4px; flex-shrink:0;
    }
    #nxc-input {
      flex:1; border:none; background:transparent;
      font-family:'DM Sans',sans-serif; font-size:13.5px; color:#f0f0f0;
      resize:none; outline:none; max-height:88px; min-height:22px; line-height:1.5;
      overflow-y:auto; scrollbar-width:none;
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
    /* ── Header Close Button ── */
    #nxc-header-close {
      width:26px; height:26px; border-radius:50%;
      background:rgba(225,29,72,0.08); border:1.5px solid rgba(225,29,72,0.2);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:all 0.2s;
      position:absolute; top:8px; right:8px; z-index:100;
    }
    #nxc-header-close:hover { background:#e11d48; border-color:#e11d48; }
    #nxc-header-close:hover svg { stroke:#fff; }
    #nxc-header-close svg { stroke:rgba(240,240,240,0.55); transition:stroke 0.2s; }
    [data-theme="light"] #nxc-header-close { background:rgba(208,16,46,0.08) !important; border-color:rgba(208,16,46,0.2) !important; }
    [data-theme="light"] #nxc-header-close svg { stroke:rgba(15,15,20,0.5) !important; }
    /* ── Sound Toggle Button ── */
    #nxc-sound-btn {
      width:30px; height:30px; border-radius:20px;
      background:rgba(225,29,72,0.08); border:1.5px solid rgba(225,29,72,0.25);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:all 0.2s; flex-shrink:0;
    }
    #nxc-sound-btn:hover { background:rgba(225,29,72,0.18); border-color:#e11d48; }
    #nxc-sound-btn.muted { opacity:0.4; }
    #nxc-sound-btn svg { transition:opacity 0.2s; }
    [data-theme="light"] #nxc-sound-btn { background:rgba(208,16,46,0.08) !important; border-color:rgba(208,16,46,0.25) !important; }
    /* ── Char Counter ── */
    #nxc-char-count {
      font-size:10px; color:#555; font-family:'DM Sans',sans-serif;
      flex-shrink:0; min-width:36px; text-align:center;
      transition:color 0.2s; user-select:none; display:none;
    }
    #nxc-char-count.warn { color:#e11d48; font-weight:600; }
    [data-theme="light"] #nxc-char-count { color:#9a9aaa !important; }
    
    /* ── Scroll to Bottom Button ── */
    #nxc-scroll-btn {
  position:sticky; bottom:1px; left:50%; transform:translateX(-50%);
  margin-left:auto; margin-right:auto;
  background:rgba(60,60,60,0.75); color:#ccc; border:none; border-radius:20px;
  width:36px; height:36px;
  font-size:16px; cursor:pointer; z-index:999;
  display:none; align-items:center; justify-content:center;
  box-shadow:0 2px 8px rgba(0,0,0,0.3);
  font-family:'DM Sans',sans-serif; font-weight:500;
  transition:background 0.2s;
  backdrop-filter:blur(4px);
}
#nxc-scroll-btn:hover { background:rgba(80,80,80,0.9); }
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
        <div id="nxc-sound-btn" title="Sound on"></div>
      </div>
      <div class="nxc-red-bar"></div>
      <button id="nxc-header-close">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
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
        <div class="nxc-input-right" id="nxc-input-right">
          <span id="nxc-char-count">0/500</span>
          <button id="nxc-send" aria-label="Send">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="nxc-footer-bar">
        <span class="nxc-powered">Powered by OpenAI</span>
        <div class="nxc-footer-dot"></div>
        <span class="nxc-powered">JZAI</span>
      </div>
    </div>`;
  document.body.appendChild(win);

  // ── Core elements ──
  var msgs      = document.getElementById('nxc-msgs');
  var input     = document.getElementById('nxc-input');
  var sendBtn   = document.getElementById('nxc-send');
  var quickDiv  = document.getElementById('nxc-quick');
  var hintBtn   = document.getElementById('nxc-hint-btn');
  var histBanner= document.getElementById('nxc-hist-banner');
  var isOpen=false, hintOpen=false;

  // ── Scroll to bottom button ──
  win.style.position = 'relative';
  var scrollBtn = document.createElement('button');
  scrollBtn.id = 'nxc-scroll-btn';
  scrollBtn.innerHTML = '↓';
  scrollBtn.onclick = function(){ msgs.scrollTop = msgs.scrollHeight; updateScrollBtn(); };
  msgs.appendChild(scrollBtn);
  msgs.addEventListener('scroll', updateScrollBtn);

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
      addMsg('bot', "Hey! 👋 Great to have you here!\n\nI'm **JZAI Assistant** — I'm here to help you discover — AI solutions, web development, chatbots & more! 😊\n\nWhat can I help you with today? 💬");
    });
  } else {
    addMsg('bot', "Hey! 👋 Great to have you here!\n\nI'm **JZAI Assistant** — I'm here to help you discover — AI solutions, web development, chatbots & more! 😊\n\nWhat can I help you with today? 💬");
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
    setTimeout(function(){ 
      input.focus(); 
    }, 350);
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
    var newHeight = Math.min(input.scrollHeight, 88);
    input.style.height = newHeight+'px';
    var isMultiline = newHeight > 55;
    charCountEl.style.display = isMultiline ? 'block' : 'none';
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
    charCountEl.style.display = 'none';
    if (leadStep !== null) {
      handleLeadStep(text);
      sendBtn.disabled=false;
      return;
    }
    var status = TYPING_STATUSES[Math.floor(Math.random()*TYPING_STATUSES.length)];
    var tid = addTyping(status);
    var apiMessages = chatHistory
      .filter(function(m){ return m.role !== 'bot' || m.text !== chatHistory[0].text; })
      .map(function(m){
        return { role: m.role==='bot'?'assistant':'user', content: m.text };
      });
    var contextMessages = apiMessages.slice(-10);
    try {
      var response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: contextMessages })
      });
      removeTyping(tid);
      if(!response.ok) throw new Error('API Error: ' + response.status);
      var data = await response.json();
      var reply = data.reply ? data.reply.trim() : "I'm having trouble connecting. Please try again! You can also reach us at jahanzaibtahir2006@gmail.com";
      var leadAction = null;
      try {
        var jsonMatch = reply.match(/\{[\s\S]*"action"\s*:\s*"open_lead_form"[\s\S]*\}/);
        if (jsonMatch) { leadAction = JSON.parse(jsonMatch[0]); }
      } catch(e) { leadAction = null; }
      if (leadAction) {
        startLeadCollection(leadAction.service || '', leadAction.budget || '');
        sendBtn.disabled=false;
        input.focus();
        return;
      }
      addMsg('bot', reply);
      playNotifSound();
      if(!isOpen){
        unreadCount++;
        badge.textContent = unreadCount>9?'9+':String(unreadCount);
        badge.classList.add('show');
      }
    } catch(err){
      removeTyping(tid);
      addMsg('bot', '⚠️ Connection issue. Please try again or contact us at jahanzaibtahir2006@gmail.com');
      console.error('JZAI Chatbot Error:', err);
    }
    sendBtn.disabled=false; input.focus();
  }
  
  // ── CHAR COUNTER ──
  var charCountEl = document.getElementById('nxc-char-count');
  input.setAttribute('maxlength', '500');
  input.addEventListener('input', function(){
    var len = input.value.length;
    charCountEl.textContent = len + '/500';
    charCountEl.classList.toggle('warn', len >= 400);
  });

  // ── SOUND TOGGLE ──
  var soundEnabled = true;
  var soundBtn = document.getElementById('nxc-sound-btn');
  var soundOnSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
  var soundOffSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  soundBtn.innerHTML = soundOnSVG;
  soundBtn.addEventListener('click', function(){
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('muted', !soundEnabled);
    soundBtn.innerHTML = soundEnabled ? soundOnSVG : soundOffSVG;
    soundBtn.title = soundEnabled ? 'Sound on' : 'Sound muted';
  });
  function playNotifSound(){
    if(!soundEnabled) return;
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3);
    } catch(e){}
  }

  // ── HEADER CLOSE BUTTON ──
  document.getElementById('nxc-header-close').addEventListener('click', closeChat);

  function formatMessage(text){
    if(/<[a-z][\s\S]*>/i.test(text)){
      return text.replace(/\n/g,'<br>');
    }
    text = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    var lines=text.split('\n'), html=[], inUL=false, inOL=false;
    lines.forEach(function(line){
      var ul=line.match(/^[\-\•]\s+(.+)/), ol=line.match(/^\d+[\.\)]\s+(.+)/);
      if(ul){ if(inOL){html.push('</ol>');inOL=false;} if(!inUL){html.push('<ul>');inUL=true;} html.push('<li>'+ul[1]+'</li>'); }
      else if(ol){ if(inUL){html.push('</ul>');inUL=false;} if(!inOL){html.push('<ol style="list-style-type:decimal;padding-left:20px;">');inOL=true;} html.push('<li>'+ol[1]+'</li>'); }
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
    msgs.appendChild(wrap);
    // Scroll button ko hamesha end par rakho
    var sBtn = document.getElementById('nxc-scroll-btn');
    if(sBtn) msgs.appendChild(sBtn);
    // User message top par aaye
    if(!isBot){
  setTimeout(function(){
    msgs.style.scrollBehavior = 'smooth';
    msgs.scrollTop = wrap.offsetTop - msgs.offsetTop - 10;
    updateScrollBtn();
  }, 150);
}
if(isBot){
  setTimeout(function(){
    msgs.style.scrollBehavior = 'smooth';
    // Sirf tab scroll karo jab user bottom ke qareeb ho
    var atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 150;
    if(atBottom){
      msgs.scrollTop = msgs.scrollHeight;
    }
    updateScrollBtn();
  }, 150);
}
  }
  function addBotButtons(promptText, buttons, onSelect) {
    var wrap = document.createElement('div'); wrap.className = 'nxc-msg nxc-bot';
    var av = document.createElement('div'); av.className = 'nxc-avatar'; av.textContent = 'JZ';
    var col = document.createElement('div'); col.className = 'nxc-msg-col';
    var bub = document.createElement('div'); bub.className = 'nxc-bubble-msg'; 
    bub.innerHTML = formatMessage(promptText);
    
    var btnWrap = document.createElement('div'); 
    btnWrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;';
    buttons.forEach(function(btn) {
      var b = document.createElement('button');
      b.textContent = btn;
      b.style.cssText = `
    background: rgba(225,29,72,0.08);
    border: 1.5px solid rgba(225,29,72,0.25);
    color: #e11d48;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    text-align: center;
    font-size: 12.5px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
    letter-spacing: 0.2px;
  `;
      b.onmouseover = function() {
        if (!b.dataset.selected) {
          b.style.background = 'rgba(225,29,72,0.15)';
          b.style.borderColor = '#e11d48';
          b.style.transform = 'translateY(-1px)';
        }
      };
      b.onmouseout = function() {
        if (!b.dataset.selected) {
          b.style.background = 'rgba(225,29,72,0.08)';
          b.style.borderColor = 'rgba(225,29,72,0.25)';
          b.style.transform = 'translateY(0)';
        }
      };
      b.onclick = function() {
        b.dataset.selected = 'true';
        b.style.background = '#e11d48';
        b.style.borderColor = '#e11d48';
        b.style.color = '#fff';
        b.style.transform = 'scale(0.97)';
        btnWrap.querySelectorAll('button').forEach(function(x) {
          if (x !== b) {
            x.style.opacity = '0.4';
            x.style.cursor = 'default';
            x.style.pointerEvents = 'none';
          }
        });
        onSelect(btn);
      };
      btnWrap.appendChild(b);
    });
      
    var footer = document.createElement('div'); footer.className = 'nxc-msg-footer';
    var time = document.createElement('div'); time.className = 'nxc-msg-time';
    time.textContent = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    footer.appendChild(time);

    col.appendChild(bub); col.appendChild(btnWrap); col.appendChild(footer);
    wrap.appendChild(av); wrap.appendChild(col);
    msgs.appendChild(wrap);
    // Scroll button ko hamesha end par rakho
    var sBtn = document.getElementById('nxc-scroll-btn');
    if(sBtn) msgs.appendChild(sBtn);
    updateScrollBtn();
  }

  function addMsg(role, text){
    renderMsg(role, text, true);
    chatHistory.push({role:role, text:text}); saveHistory(chatHistory);
  }

  // ✅ FIX: Scroll button update only — scroll happen renderMsg mein hota hai
  function updateScrollBtn(){
    var btn = document.getElementById('nxc-scroll-btn');
    if(!btn) return;
    var atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
    btn.style.display = atBottom ? 'none' : 'flex';
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
  msgs.appendChild(wrap); return id;
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
