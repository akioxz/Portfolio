# Portfolio continuation notes

## Current state

- Public portfolio is composed in `app/page.tsx` from interactive section components.
- Contact submissions use Zod validation, Cloudflare Turnstile verification, rate limiting, Supabase persistence, and optional Resend email.
- Admin inbox access uses signed, expiring JWT sessions and middleware protection for admin pages and APIs.
- Turnstile verification is fail-closed: missing configuration returns `503`, while missing or invalid verification returns `400` before persistence or email.

## Validation

```bash
npm run lint
npm run test
npm run build
```

`npm run test` runs the contact-route and admin-session security tests in `tests/`. Run one file directly with `node --test tests/contact-route.test.cjs` or `node --test tests/admin-session.test.cjs`.

## Completed in this pass

- Added automated coverage for missing, invalid, malformed, HTTP-failed, and network-failed Turnstile verification, plus the successful persistence/email branch.
- Added automated coverage for missing-secret, malformed, expired, wrong-audience, and valid admin JWT sessions.
- Added admin inbox refresh/logout loading states, request-failure feedback, read-state rollback on failed updates, semantic disclosure buttons, and keyboard focus styling.
- Replaced the project preview `<img>` path with `next/image` sizing to avoid avoidable image loading and layout-shift costs when previews are added.
- Confirmed existing contact, admin, and middleware paths retain scoped failure logging; no new external observability service is required for the current deployment.
- Added middleware coverage for matcher scope, public auth entrypoints, unauthenticated redirects/JSON responses, forged and expired sessions, and valid sessions.
- Reviewed the remaining generated/theme-only local changes; they are now included in the repository state.
- Migrated the admin route guard from deprecated `middleware.ts` to Next.js 16's `proxy.ts` convention while preserving matcher scope and authentication behavior.
- Replaced permanent deletion with protected archive/restore actions, confirmation, loading/error states, and server-confirmed client updates. Apply `supabase/migrations/20260904000000_add_archived_at_to_contact_messages.sql` in Supabase before deploying.
- Added client-side inbox search plus active, unread, and archived filters.
- Replaced the browser-native archive confirmation with a themed, keyboard-accessible in-app dialog that supports Escape and backdrop cancellation.
- Refined the chatbot for mobile with a shorter 360px-capped panel, safe-area-aware positioning, Escape-to-close, input autofocus, and improved focus states.
- Added browser coverage confirming the chatbot opens within a mobile viewport.
- Optimized Projects scroll performance by removing spring lag from scroll-linked transforms, disabling decorative preview motion on mobile/reduced-motion devices, and reducing mobile card shadow/section spacing.
- Improved Beyond the Code gallery accessibility with dialog semantics, focus return, keyboard focus trapping, and Escape handling.
- Paused rotating gallery previews when the section is off-screen or the document is hidden, added a deterministic initial preview, and supplied descriptive image alt text.
- Replaced the remaining reusable raw image elements with `next/image` while preserving dynamic sources and layout sizing.
- Added Playwright smoke coverage for the public page and unauthenticated admin redirect (`npm run test:browser`).

## Security hardening in progress

- Added a five-attempt/ten-minute admin-login rate limit using namespaced hashes in the existing `contact_rate_limits` table, with an in-memory fallback.
- Added double-submit CSRF protection to admin login, archive/restore, and mark-read actions. Login issues a short-lived `csrf_token` cookie; mutations require the matching `x-csrf-token` header.
- Added `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security` response headers. CSP allows only same-origin resources plus Supabase and Cloudflare Turnstile connections/frames.
- Ran `npm audit fix` without `--force`: the report decreased from 13 vulnerabilities (7 high, 6 moderate) to 9 (3 high, 6 moderate). Remaining high findings are the Next.js 16.2.9/sharp/PostCSS chain; resolving them requires the out-of-range `next@16.3.4` force upgrade, which was intentionally not applied.

## Operational follow-up

Vercel logs plus the existing scoped server-side error logging are sufficient for the current project size. In Vercel Project Settings, add deployment-failure and function-error notifications, and keep the production log drain/retention defaults unless traffic requires a paid observability service.

## Launch readiness

The core portfolio, contact flow, admin inbox, security tests, and production guard are ready for launch. Before treating the portfolio as final, manually check the deployed site at mobile and desktop widths, complete one contact-form submission, verify the admin inbox, and confirm the production environment variables remain configured.

The custom domain remains intentionally deferred due to cost. After applying the Supabase migration, manually verify archive/restore in production and run `BASE_URL=https://your-deployment.vercel.app npm run test:browser` from an environment with Playwright browsers installed.

Keep this file and `.github/copilot-instructions.md` aligned when architecture, commands, or operational behavior changes.
