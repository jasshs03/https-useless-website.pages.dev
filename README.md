# useless.exe 🕸️

> A delightfully useless website powered by potatoes.
> Live at: **[useless-website.pages.dev](https://useless-website.pages.dev)** *(or wherever you deployed it)*

A retro-terminal-themed playground of seven completely pointless experiences. Built as a static site — no backend, no tracking, no purpose.

```
[useless~exe]
choose your waste of time_
```

## 🎯 Experiences

| Page | Description |
|---|---|
| 🏃 **runaway_button** | A button that physically refuses to be clicked. |
| 🔢 **pointless_counter** | Increment a number for absolutely no reason. |
| ⏳ **infinite_loader** | A loading bar that loads forever and finishes never. |
| 🐱 **fake_cat_facts** | 100% fabricated trivia about cats. |
| 🚫 **do_nothing** | A button that does nothing (probably). |
| 🐈 **cat_trail** | Cats spawn wherever your cursor moves. |
| 🎮 **add_me** | Modal with gaming handles (Valorant, LoL, Discord, Steam, Twitch). |
| 🥱 **bored** | Generates random useless things to do. |
| 🎡 **wheel** | Spin the wheel of bad decisions. |
| 💢 **complaints** | Type a complaint — get ignored. |
| 🌍 **visitors** | A completely fake live-visitor map. |

Plus secret features: a **Fun Fact** counter (top-right) that tracks how many minutes the site has existed, the **Konami code** (↑↑↓↓←→←→BA), a pixel pet, a fake boot sequence on first visit, and an annoyed reaction when you click the author's name.

## 🚀 Run locally

```bash
npm install      # one-time
npm run dev      # opens http://localhost:8765
```

That's it. No build step. Just static HTML/CSS/JS with ES modules.

## 📁 Structure

```
useless-website/
├── index.html              ← landing menu
├── 404.html
├── favicon.svg             ← spider web 🕸️
├── og-image.svg            ← social preview card
├── _headers                ← Cloudflare security headers
├── _redirects              ← Cloudflare 404 routing
├── Dockerfile              ← optional, for Docker deploy
├── nginx.conf
├── package.json
├── css/
│   └── styles.css
├── js/
│   ├── main.js             ← shared entry point
│   └── modules/            ← one file per feature
└── pages/                  ← one HTML per experience
```

Every "feature module" no-ops if its DOM target isn't on the current page, so a single `main.js` works for every page.

## 🌍 Deploy

### Cloudflare Pages (recommended, free, fast)
Connect this GitHub repo to **[pages.cloudflare.com](https://pages.cloudflare.com)** with:
- Build command: *(empty)*
- Output directory: `/`

Every `git push` auto-deploys.

### Docker
```bash
docker build -t useless-website .
docker run -p 8080:80 useless-website
```

### Anything else
It's pure static files — drag the folder into Netlify, Vercel, GitHub Pages, S3, etc.

## 🛡️ Security

The `_headers` file ships with strict defaults: HSTS, CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, restrictive `Permissions-Policy`, etc.

No user data is collected. No third-party scripts. No cookies. No tracking.

## 🤖 AI generated

This was vibe-coded with AI assistance. The footer says so. Honesty is policy.

## 📜 License

MIT — do whatever, it's useless anyway.

— Letskilljoy 🥔
