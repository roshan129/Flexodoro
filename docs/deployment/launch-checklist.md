# Flexodoro Launch Checklist

## Product
- [ ] Landing page content reviewed (hero, CTA, features)
- [ ] Timer flows verified (fixed + flexible + break suggestions)
- [ ] Settings saved and reloaded correctly
- [ ] Music playback tested (play/pause, track switch, volume)
- [ ] Analytics render with real session data

## Technical
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `/api/health` returns `{ status: "ok" }`
- [ ] `/api/stats` and `/api/insights` return success payloads
- [ ] Prisma DB connection works in production

## Deployment
- [ ] `DATABASE_URL` configured in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` configured as `https://www.flexodoro.com`
- [ ] `https://flexodoro.com/*` permanently redirects to `https://www.flexodoro.com/*`
- [ ] Legacy `flexpomodoro.vercel.app` URLs redirect from the Vercel project that owns them
- [ ] Production deploy succeeds with no build errors
- [ ] Smoke test complete on live URL (desktop + mobile)

## Post-Launch
- [ ] Monitor server logs and API errors
- [ ] Verify first real sessions are persisted
- [ ] Validate analytics numbers against DB entries
- [ ] Submit `/sitemap.xml` in the Search Console Domain property
- [ ] Confirm Google-selected canonical is the matching `https://www.flexodoro.com` URL
