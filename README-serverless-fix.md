
# Serverless email quick fix (Vercel)

**Why you saw “Network error”:**
If `/api/volunteer` or `/api/ama` did not deploy as functions, the browser fetched a 404 HTML page; the client then failed to parse JSON and showed a generic network error. This patch makes sure Vercel recognizes the functions and runs them on Node.js 18.

## Steps
1) Add these files to your repo root:
   - `api/volunteer.js`
   - `api/ama.js`
   - `vercel.json`
   - `package.json` (with `"type":"module"` and `nodemailer`)
2) In Vercel → Project → **Settings → Environment Variables**, set:
   - `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`
   - `TO_EMAIL` = erikmorris4FLgov@gmail.com
   - (optional) `FROM_EMAIL`
3) Push/commit to DEV; wait for deploy to finish. Open Network tab and retry the form. You should see 200 OK with `{ ok: true }`.

Troubleshooting:
- 404 on `/api/volunteer` → the function didn’t deploy. Ensure `api/volunteer.js` exists in the **repo root** and that `vercel.json` is present.
- 500 error → check Vercel logs for missing env vars or SMTP auth issues (app password).
