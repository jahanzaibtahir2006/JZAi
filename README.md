# JZAI — Next.js

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
jzai-nextjs/
├── app/
│   ├── globals.css      # All theme variables & styles
│   ├── layout.tsx       # Root layout with fonts & metadata
│   └── page.tsx         # Home page
├── components/
│   ├── Navbar.tsx        # Sticky nav with scroll effect
│   ├── ThemeToggle.tsx   # Dark/light toggle with localStorage
│   ├── Hero.tsx          # Hero with animated counters
│   ├── Marquee.tsx       # Auto-scrolling ticker
│   ├── Services.tsx      # Service cards grid
│   ├── Process.tsx       # 4-step process with stagger
│   ├── TechStack.tsx     # Tech icons grid
│   ├── WhyUs.tsx         # Benefits with orbit animation
│   ├── CTA.tsx           # Call-to-action section
│   ├── Footer.tsx        # Footer + bottom bar
│   └── ScrollReveal.tsx  # Reusable IntersectionObserver wrapper
├── next.config.js
├── tsconfig.json
└── package.json
```

## Notes

- Chatbot script (`Jzaichatbot.js`) — place in `/public/` and add a Script tag in `layout.tsx` using `next/script`
- Services page (`/services`) needs its own `app/services/page.tsx`
- All theme logic uses `data-theme` on `<html>` with CSS variables
