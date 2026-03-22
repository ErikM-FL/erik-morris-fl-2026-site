# Email setup (Vercel serverless)

These pages post to serverless API routes that send email via SMTP using Nodemailer.

## 1) Set environment variables in Vercel (Project → Settings → Environment Variables)
- `SMTP_HOST`  → your SMTP host (e.g., smtp.gmail.com)
- `SMTP_PORT`  → 587 (or your provider's port)
- `SMTP_USER`  → SMTP username (full email or login)
- `SMTP_PASS`  → SMTP password or app password
- `TO_EMAIL`   → erikmorris4FLgov@gmail.com
- (optional) `FROM_EMAIL` → from address to show on emails; defaults to SMTP_USER

After saving, redeploy the DEV branch so the functions pick up the new values.

## 2) Install dependencies (Vercel will do this automatically)
The included `package.json` contains `nodemailer`. On your next deploy, Vercel will install it for the serverless functions.

## 3) Test locally (optional)
If you run locally with `vercel dev` or a Node server, ensure the env vars are present in your shell.

## Security note
The destination email is **not** present in page HTML or client JS. It's only used on the serverless function via `process.env.TO_EMAIL`.
