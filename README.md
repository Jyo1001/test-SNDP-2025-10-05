# SNDP Unit 9 — Website (GitHub Pages)

Clean, Wikipedia‑style site for SNDP Unit 9 with a **Directory**, **Loan Portal**, and **User Detail** pages.  
This starter splits **HTML/CSS/JS** and moves all demo data to **JSON** so you can update content without touching code.

## 🌐 Live (GitHub Pages)
After pushing to `main`, enable Pages in **Settings ▸ Pages**. Use the **root** or `/docs` (this repo uses root).

## 🧱 Tech Stack
- Pure static: **HTML + CSS + ES Modules** (no build step required)
- Data: **JSON** files in `/data`, validated by JSON Schemas in `/schemas`
- Routing: **hash SPA** (`#/about`, `#/loans`, `#/user/user01`)
- CI: GitHub Actions to validate JSON against the schemas (via `ajv-cli`)

## 📁 Folder Structure
```
.
├─ index.html              # SPA shell + page sections
├─ 404.html                # SPA fallback (optional; safe to keep)
├─ assets/
│  ├─ css/
│  │  └─ main.css          # Theme + layout
│  └─ js/
│     ├─ app.js            # Entry point, bootstraps everything
│     ├─ router.js         # Hash-based router and route hooks
│     ├─ util.js           # money(), safe(), loadJSON(), storage helpers
│     ├─ auth.js           # demo login, session management
│     ├─ loans.js          # manager/user views, monthly statements
│     └─ directory.js      # directory page (public contact listing)
├─ data/
│  ├─ site.json            # site settings & nav labels
│  ├─ users.json           # demo users (manager + 10 users, Ezhava names)
│  ├─ events.json          # events
│  └─ notices.json         # notices
├─ schemas/
│  ├─ users.schema.json    # JSON Schema for /data/users.json
│  ├─ events.schema.json   # JSON Schema for /data/events.json
│  └─ notices.schema.json  # JSON Schema for /data/notices.json
├─ .github/workflows/
│  └─ ci.yml               # Validate JSON and run a link check
├─ .editorconfig           # Basic editor settings
├─ .prettierrc.json        # Formatting (optional)
└─ LICENSE                 # MIT
```

## 🚀 Quick Start (Local)
> Static `fetch()` of local files requires a local server.
- Option A (Python): `python3 -m http.server 8080` then open http://localhost:8080
- Option B (Node): `npx http-server -p 8080`

## 🔐 Demo Logins
- Manager: **manager / demo123**
- Users: **user01..user10 / demo123**

> Demo auth is **client-side only**. For production, move to server-side auth or an identity provider.

## 🧭 Roadmap
**Phase 0 — Repo Setup**
- Create repo, add branch protections, enable Pages.
- Configure Issue templates & PR checklist.

**Phase 1 — Content & Data**
- Move unit content to `/data/*.json` (already scaffolded).
- Validate in CI with JSON Schema (see `/schemas`).

**Phase 2 — UI/UX**
- Polish directory filters, add pagination for loans if needed.
- Add image assets in `/assets/img` (not included in this starter).

**Phase 3 — QA & Compliance**
- Lighthouse pass (PWA optional), basic a11y checks (labels, focus, contrast).

**Phase 4 — Security & Privacy**
- Replace demo auth; avoid storing PII in public repos.
- Gate loan details behind server/API if going beyond demo.

**Phase 5 — Automation**
- Optional: Markdown content in `/content` + static site generator (Astro/Eleventy).
- Optional: Admin via GitHub CMS (Netlify CMS / Decap).

## 🧪 CI Details
- JSON validation: `ajv -s schemas/*.json -d data/*.json`
- Link check (basic): `lychee` (skips external HTTP rate limits by default config)

## 📄 License
MIT © 2025
