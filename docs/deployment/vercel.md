# Vercel Deployment Guide

## Prerequisites
- Vercel account
- PostgreSQL database connection string

## Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection URL for Prisma
- `NEXT_PUBLIC_APP_URL`: canonical production origin (`https://www.flexodoro.com` in production)

## Deploy Steps
1. Push repository to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Add `DATABASE_URL` in Project Settings -> Environment Variables.
4. Add `NEXT_PUBLIC_APP_URL=https://www.flexodoro.com` for the Production environment.
5. Set Vercel Build Command to `npm run build:vercel` so migrations run before `next build`.
6. Deploy.

## Production Domains and Search
- Keep `www.flexodoro.com` as the canonical production hostname.
- The app permanently redirects `flexodoro.com` requests to the `www` hostname.
- Configure the Vercel project that owns `flexpomodoro.vercel.app` to permanently redirect its indexed URLs to their closest equivalents on `https://www.flexodoro.com`. This must be done on that older project; this repository cannot affect a different Vercel project.
- After deployment, submit `https://www.flexodoro.com/sitemap.xml` in a Search Console Domain property and inspect the homepage canonical.

## Prisma Migration Requirement
- Ensure `prisma/migrations` is committed to the repository.
- For existing projects that deployed before migrations were added, trigger a redeploy so Vercel can run `prisma migrate deploy`.
- If `DATABASE_URL` points to a brand-new database, deployment will create the `Session` table from migrations automatically.

## Post-Deploy Checks
1. Visit `/api/health` and confirm `status: ok`.
2. Create a focus session and confirm `/api/sessions` writes to DB.
3. Open analytics section and verify stats/insights are visible.

## Notes
- App builds successfully with `npm run build`.
- Prisma client is generated at build/runtime via package setup.
- Final pre-release validation list: [launch-checklist.md](launch-checklist.md)
