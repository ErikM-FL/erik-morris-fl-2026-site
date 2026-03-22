
# Erik — Volunteer & AMA (one-zip) with serverless email

Follow these **exact** steps. (If a step mentions a button, click that button verbatim.)

---
## 1) Upload files to GitHub (DEV branch)
1. Open your repo → switch to **DEV**.
2. Click **Add file ▾** → **Upload files**.
3. Drag these from this zip (keep the same folders):
   - `pages/volunteer.html`
   - `pages/ama.html`
   - `api/volunteer.js`
   - `api/ama.js`
   - `vercel.json`
   - `package.json`
4. Scroll down → **Commit changes**.

> Why: Vercel detects Node.js functions from files in the **/api** folder at the repo root and deploys them as Functions on Node 18 when configured. (Vercel docs) 

---
## 2) Create a Gmail **App Password** (SMTP_PASS)
> App Passwords require **2‑Step Verification** on your Google account.

A) Turn on 2‑Step Verification (if needed):
- Go to `myaccount.google.com/security` → under **How you sign in to Google**, click **2‑Step Verification** → **Get started** → finish setup.

B) Generate the App Password:
- Visit `myaccount.google.com/apppasswords` → choose **Other (Custom name)** → type `SMTP for Vercel` → **Create**.
- Copy the 16‑character password shown (without spaces). You won’t see it again after closing.

---
## 3) Add secrets in **Vercel → Project → Settings → Environment Variables**
Click **Add** for each of these:
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = erikmorris4FLgov@gmail.com
SMTP_PASS = <paste your 16-character App Password>
TO_EMAIL  = erikmorris4FLgov@gmail.com
FROM_EMAIL = "Erik Morris Campaign" <erikmorris4FLgov@gmail.com>
```
> Tip: Using the same address for FROM_EMAIL and SMTP_USER keeps Gmail happy.

---
## 4) Redeploy DEV
- In Vercel → **Deployments** → click **Redeploy** (or make a tiny commit). Wait for **Ready**.
- If your project Node version is old, set **Project → Settings → General → Node.js Version** to **18** or **20**.

---
## 5) Test
- Open `/pages/volunteer.html` → fill the form → click **Send**.
- Open the browser **Network** tab: `/api/volunteer` should return **200 OK** with `{ ok: true }`.
- Check your inbox. Repeat for `/pages/ama.html`.

---
## Troubleshooting quick list
- **Network error**: ensure `api/*.js` exists at repo root and `vercel.json` is present → redeploy DEV.
- **500 error**: open Vercel **Function Logs** and recheck SMTP env vars (App Password).

