# Erik Morris for Florida Governor — 2026 (Static Site)

This is a lean, static website for the 2026 Florida gubernatorial **write‑in** campaign.
It maps each platform row to a dedicated page, includes localized write‑in pages and graphics (ES/HT/ZH/VI/KO), and a home‑page canvas that **types “ERIK MORRIS”**, then **holds 30 seconds** before cycling languages.

## Preview Locally
Open `index.html` in your browser. No build step.

## Edit Content
- Pages live in `pages/`. Colors & spacing in `styles.css`.
- Localized write‑in pages: `pages/how-to-write-in-<lang>.html`.
- Graphics: `assets/write-in-<lang>.svg` (vector, language‑specific) and `assets/write-in-instructions.png` (English PNG).

## Free Hosting Options

### Option A — Vercel (drag‑and‑drop)
1. Go to <https://vercel.com> and sign in.
2. Click **Add New → Project → Upload** and **drag the entire `erik-morris-fl-2026-site/` folder**.
3. Framework: **Other**. No build command. Output: root.
4. Click **Deploy** → get a live URL.
5. (Optional) Add your custom domain in **Settings → Domains**.

### Option B — GitHub Pages
1. Create a GitHub repo, e.g., `erik-morris-fl-2026-site`.
2. Upload the folder contents to the repo root (or push via git).
3. Repo **Settings → Pages** → **Deploy from branch** → `main` and `/` (root).
4. Visit `https://<user>.github.io/erik-morris-fl-2026-site/`.

### Option C — Netlify (drag‑and‑drop)
1. Go to <https://app.netlify.com> and create a site.
2. Drag‑and‑drop the `erik-morris-fl-2026-site/` folder.
3. Netlify assigns a free URL; add your domain if desired.
