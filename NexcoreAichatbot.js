/**
 * NexCore AI — Chatbot Widget
 * Paste this <script> tag at the bottom of your HTML <body>
 * Replace YOUR_API_KEY_HERE with your actual Anthropic API key
 *
 * Usage:
 *   <script src="nexcore-chatbot.js"></script>
 */

(function () {
  const API_KEY = "YOUR_API_KEY_HERE"; // 🔑 Replace with your Anthropic API key

  const SYSTEM_PROMPT = `You are NexCore AI's smart assistant — helpful, concise, and professional.

NexCore AI is a cutting-edge tech company based in Rawalpindi, Pakistan offering:
- AI & Machine Learning (Custom models, LLM integrations, Computer Vision, Automation)
- Web Development (React, Next.js, Node.js — from landing pages to SaaS platforms)
- Cloud & DevOps (AWS, Docker, Kubernetes, CI/CD pipelines)
- AI Chatbots & NLP (ChatGPT API, RAG systems, Claude-powered bots)
- Data Engineering (Python, Spark, Tableau — real-time analytics & pipelines)
- UI/UX Design (Figma, Framer, Design Systems)

Stats: 120+ projects delivered, 98% client satisfaction, 6+ years experience, 40+ expert engineers.
Contact: jahanzaibtahir2006@gmail.com | LinkedIn: linkedin.com/in/jahanzaibtahir | GitHub: github.com/jahanzaibtahir2006

Answer questions about NexCore AI's services, pricing (say contact us for custom quotes), tech stack, and process.
Also help with general AI, web dev, and tech questions. Keep answers short and helpful. Use emojis sparingly.`;

  const STYLES = `
    #nexcore-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e63946, #c1121f);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(230,57,70,0.45);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #nexcore-chat-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 30px rgba(230,57,70,0.6);
    }
    #nexcore-chat-btn svg { width: 26px; height: 26px; fill: white; }

    #nexcore-chat-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 370px;
      max-height: 560px;
      border-radius: 18px;
      z-index: 99998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.28);
      font-family: 'Segoe UI', system-ui, sans-serif;
      transition: opacity 0.2s ease, transform 0.2s ease;
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
    #nexcore-chat-window.open {
      display: flex;
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* DARK THEME (default) */
    #nexcore-chat-window.dark {
      background: #0f0f0f;
      border: 1px solid #2a2a2a;
      color: #f0f0f0;
    }
    #nexcore-chat-window.dark .nc-header { background: #161616; border-bottom: 1px solid #2a2a2a; }
    #nexcore-chat-window.dark .nc-messages { background: #0f0f0f; }
    #nexcore-chat-window.dark .nc-msg-bot { background: #1e1e1e; color: #e8e8e8; }
    #nexcore-chat-window.dark .nc-msg-user { background: linear-gradient(135deg,#e63946,#c1121f); color: #fff; }
    #nexcore-chat-window.dark .nc-input-area { background: #161616; border-top: 1px solid #2a2a2a; }
    #nexcore-chat-window.dark .nc-input { background: #252525; border: 1px solid #333; color: #f0f0f0; }
    #nexcore-chat-window.dark .nc-input::placeholder { color: #666; }
    #nexcore-chat-window.dark .nc-send { background: linear-gradient(135deg,#e63946,#c1121f); }
    #nexcore-chat-window.dark .nc-theme-btn { background: #252525; color: #aaa; border: 1px solid #333; }

    /* LIGHT THEME */
    #nexcore-chat-window.light {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      color: #111;
    }
    #nexcore-chat-window.light .nc-header { background: #f7f7f7; border-bottom: 1px solid #e0e0e0; }
    #nexcore-chat-window.light .nc-messages { background: #fff; }
    #nexcore-chat-window.light .nc-msg-bot { background: #f1f1f1; color: #111; }
    #nexcore-chat-window.light .nc-msg-user { background: linear-gradient(135deg,#e63946,#c1121f); color: #fff; }
    #nexcore-chat-window.light .nc-input-area { background: #f7f7f7; border-top: 1px solid #e0e0e0; }
    #nexcore-chat-window.light .nc-input { background: #fff; border: 1px solid #ccc; color: #111; }
    #nexcore-chat-window.light .nc-input::placeholder { color: #999; }
    #nexcore-chat-window.light .nc-send { background: linear-gradient(135deg,#e63946,#c1121f); }
    #nexcore-chat-window.light .nc-theme-btn { background: #fff; color: #555; border: 1px solid #ccc; }

    .nc-header {
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nc-header-logo {
      width: 34px; height: 34px;
      background: linear-gradient(135deg,#e63946,#c1121f);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 14px; color: white; flex-shrink: 0;
    }
    .nc-header-info { flex: 1; }
    .nc-header-info strong { display: block; font-size: 14px; font-weight: 700; }
    .nc-header-info span { font-size: 11px; color: #22c55e; }
    .nc-theme-btn {
      border: none; cursor: pointer; border-radius: 8px;
      padding: 5px 9px; font-size: 16px; transition: opacity 0.2s;
    }
    .nc-theme-btn:hover { opacity: 0.7; }
    .nc-close-btn {
      background: none; border: none; cursor: pointer;
      font-size: 20px; color: #888; padding: 2px 6px;
      border-radius: 6px; transition: color 0.2s;
    }
    .nc-close-btn:hover { color: #e63946; }

    .nc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
    }
    .nc-messages::-webkit-scrollbar { width: 4px; }
    .nc-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

    .nc-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.55;
      word-wrap: break-word;
      animation: ncFadeIn 0.2s ease;
    }
    @keyframes ncFadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:translateY(0); } }
    .nc-msg-bot { align-self: flex-start; border-bottom-left-radius: 4px; }
    .nc-msg-user { align-self: flex-end; border-bottom-right-radius: 4px; }

    .nc-typing {
      align-self: flex-start;
      display: flex; gap: 5px; align-items: center;
      padding: 10px 14px;
      border-radius: 14px; border-bottom-left-radius: 4px;
      animation: ncFadeIn 0.2s ease;
    }
    #nexcore-chat-window.dark .nc-typing { background: #1e1e1e; }
    #nexcore-chat-window.light .nc-typing { background: #f1f1f1; }
    .nc-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #e63946; animation: ncBounce 1.2s infinite;
    }
    .nc-dot:nth-child(2) { animation-delay: 0.2s; }
    .nc-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ncBounce {
      0%,80%,100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }

    .nc-input-area {
      padding: 12px 14px;
      display: flex; gap: 8px; align-items: flex-end;
    }
    .nc-input {
      flex: 1;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13.5px;
      outline: none;
      resize: none;
      max-height: 90px;
      min-height: 40px;
      font-family: inherit;
      transition: border-color 0.2s;
      line-height: 1.4;
    }
    .nc-input:focus { border-color: #e63946 !important; }
    .nc-send {
      width: 40px; height: 40px; flex-shrink: 0;
      border: none; border-radius: 12px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, opacity 0.15s;
      box-shadow: 0 2px 8px rgba(230,57,70,0.4);
    }
    .nc-send:hover { transform: scale(1.08); }
    .nc-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .nc-send svg { width: 18px; height: 18px; fill: white; }

    @media (max-width: 420px) {
      #nexcore-chat-window { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
      #nexcore-chat-btn { right: 16px; bottom: 20px; }
    }
  `;

  // Inject styles
  const styleEl = document.createElement("style");
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  // Detect page theme (looks for data-theme or dark class on body/html)
  function detectPageTheme() {
    const html = document.documentElement;
    const body = document.body;
    if (
      html.getAttribute("data-theme") === "light" ||
      body.getAttribute("data-theme") === "light" ||
      body.classList.contains("light")
    ) return "light";
    return "dark"; // default dark
  }

  let currentTheme = detectPageTheme();
  let messages = []; // conversation history
  let isOpen = false;
  let isLoading = false;

  // Build HTML
  const btn = document.createElement("button");
  btn.id = "nexcore-chat-btn";
  btn.setAttribute("aria-label", "Open NexCore AI Chat");
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.02 2 11c0 2.67 1.17 5.07 3.04 6.77L4 22l4.55-1.52C9.96 20.81 10.97 21 12 21c5.52 0 10-4.02 10-9S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z"/>
  </svg>`;

  const win = document.createElement("div");
  win.id = "nexcore-chat-window";
  win.className = currentTheme;
  win.innerHTML = `
    <div class="nc-header">
      <div class="nc-header-logo">N</div>
      <div class="nc-header-info">
        <strong>NexCore AI</strong>
        <span>● Online</span>
      </div>
      <button class="nc-theme-btn" id="nc-theme-toggle" title="Toggle theme">🌙</button>
      <button class="nc-close-btn" id="nc-close-btn" title="Close">✕</button>
    </div>
    <div class="nc-messages" id="nc-messages"></div>
    <div class="nc-input-area">
      <textarea class="nc-input" id="nc-input" placeholder="Ask me anything..." rows="1"></textarea>
      <button class="nc-send" id="nc-send" title="Send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  const messagesEl = document.getElementById("nc-messages");
  const inputEl = document.getElementById("nc-input");
  const sendBtn = document.getElementById("nc-send");
  const closeBtn = document.getElementById("nc-close-btn");
  const themeBtn = document.getElementById("nc-theme-toggle");

  // Welcome message
  function addWelcome() {
    if (messagesEl.children.length === 0) {
      addMessage("bot", "👋 Hello! I'm the **NexCore AI** assistant. I can help you with our services — AI/ML, Web Development, Cloud, Chatbots, and more. Or just ask me any tech question!");
    }
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `nc-msg nc-msg-${role}`;
    // Basic markdown: bold
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "nc-typing";
    div.id = "nc-typing";
    div.innerHTML = `<div class="nc-dot"></div><div class="nc-dot"></div><div class="nc-dot"></div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById("nc-typing");
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = "";
    inputEl.style.height = "auto";
    isLoading = true;
    sendBtn.disabled = true;

    addMessage("user", text);
    messages.push({ role: "user", content: text });

    showTyping();

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });

      const data = await res.json();
      hideTyping();

      if (data.content && data.content[0]) {
        const reply = data.content[0].text;
        addMessage("bot", reply);
        messages.push({ role: "assistant", content: reply });
      } else {
        addMessage("bot", "Sorry, I encountered an error. Please try again.");
      }
    } catch (err) {
      hideTyping();
      addMessage("bot", "⚠️ Network error. Please check your connection and try again.");
    }

    isLoading = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  // Toggle open/close
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      win.style.display = "flex";
      setTimeout(() => win.classList.add("open"), 10);
      addWelcome();
      inputEl.focus();
      btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
    } else {
      win.classList.remove("open");
      setTimeout(() => { win.style.display = "none"; }, 200);
      btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.02 2 11c0 2.67 1.17 5.07 3.04 6.77L4 22l4.55-1.52C9.96 20.81 10.97 21 12 21c5.52 0 10-4.02 10-9S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z"/></svg>`;
    }
  });

  closeBtn.addEventListener("click", () => btn.click());

  // Theme toggle
  themeBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    win.className = currentTheme;
    win.classList.add("open");
    themeBtn.textContent = currentTheme === "dark" ? "🌙" : "☀️";
  });

  // Also sync with page theme changes (if your site has a theme toggle)
  const observer = new MutationObserver(() => {
    const newTheme = detectPageTheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      win.className = currentTheme;
      if (isOpen) win.classList.add("open");
      themeBtn.textContent = currentTheme === "dark" ? "🌙" : "☀️";
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "class"] });

  // Send on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send on Enter (Shift+Enter = new line)
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + "px";
  });

})();
