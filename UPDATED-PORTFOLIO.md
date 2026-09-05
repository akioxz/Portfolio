# Portfolio continuation notes

## Current state

### Uncommitted contact confirmation work â€” verified 2026-09-05

- `components/ContactModal.tsx` replaces the submitted form with the paper-into-envelope Motion success state. It respects `prefers-reduced-motion`, retains the existing close affordances, and auto-closes after 2.5 seconds.
- The confirmation now has the neutral heading `Message Received` and renders the API-provided success message. Its fallback is `Your message was received.`, not a delivery claim.
- `app/api/contact/route.ts` tracks whether the Supabase insert succeeded. When Resend is unavailable, it returns `503` rather than a false success if no message was persisted. A persisted-but-not-emailed message remains an explicit received-message success.
- `tests/contact-route.test.cjs` covers the Supabase-insert-failure plus missing-Resend case, asserting `503`, no success field, and no Resend calls.
- Verified in this session: `npm.cmd run test` completed with 16 passed / 0 failed; `npm.cmd run lint` completed with no ESLint diagnostics; `npm.cmd run build` compiled, type-checked, and generated all routes successfully; `git diff --check` returned no whitespace errors. Expected test logs include missing-config and simulated Turnstile/Supabase failure cases.
- The working tree has substantive modifications in `app/api/contact/route.ts`, `components/ContactModal.tsx`, and `tests/contact-route.test.cjs`. `tsconfig.json` is also shown as modified by Git but has no textual diff.

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

### Production verification

- Production deployment of commit `045d88f` serves all four security headers. An actual request returned `200` with CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and HSTS `max-age=31536000; includeSubDomains`.
- Production `GET /api/admin/login` returned `200` and issued a 64-character CSRF token. A production login POST without the CSRF token returned `403`.
- Exact production browser command: `$env:BASE_URL='https://axelvillanueva.vercel.app'; npm run test:browser`
- Exact production Playwright output:
  ```
  Running 6 tests using 2 workers
  ✓ [chromium] public portfolio loads on desktop and mobile
  ✓ [mobile] public portfolio loads on desktop and mobile
  ✓ [chromium] admin inbox redirects unauthenticated visitors to login
  ✓ [mobile] admin inbox redirects unauthenticated visitors to login
  ✓ [chromium] chatbot opens within the mobile viewport
  ✓ [mobile] chatbot opens within the mobile viewport
  6 passed (7.6s)
  ```
- Manual production click-through recorded from the user's live-site check: the contact form accepted a real Turnstile submission and the message appeared in the inbox; admin login succeeded; Active, Unread, and Archived filters worked; archive, restore, and mark-read worked; desktop chatbot, theme toggle, and Projects scrolling had no issues; mobile theme toggle and Projects scrolling had no issues, but the chatbot card still appeared too large.
- Tightened the mobile chatbot card to a 300px height cap and 320px width cap. This requires one post-deploy mobile confirmation before launch readiness is final.
- Production environment variable names confirmed by the user: `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CONTACT_DESTINATION_EMAIL`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SUPABASE_URL`.
- Fixed laggy theme switching by removing the full-page View Transition clip animation and the global all-element color transition. Theme changes are now immediate, while component-level interaction transitions remain intact.
- Added back a lightweight 260ms theme veil animation. It masks the instant variable swap with a single composited overlay, includes reduced-motion support, and avoids repainting every page element.
- Corrected the theme veil so it captures the outgoing dark/light color before changing themes; the overlay now visibly fades away instead of resolving to the already-active incoming color.
- Replaced the veil with a circular View Transition reveal inspired by the supplied 60fps.design reference. The new theme expands from the toggle button over 380ms with a strong ease-out curve; reduced-motion mode collapses the animation to an instant swap.
- Refined the circular reveal to a smoother 440ms iOS-style ease-out curve, giving the mask a softer finish without adding extra page-wide animation work.
- Final launch gate closed on 2026-09-04. Production commit `e42e294` includes the circular theme reveal and the previously deployed mobile chatbot sizing fix from `4984e5e`.
- Live mobile verification at 390x844 confirmed the chatbot panel is 320px wide, remains inside the viewport with no horizontal overflow, and the circular theme transition is supported and completes with the theme state changing correctly. Reduced-motion context was also exercised; no theme-reveal animation was observed beyond the page's independent existing animations.
- Production Playwright verification remained green: 6 tests passed in 8.9s. The Vercel deployment response identified the live Vercel revision; the authenticated Vercel Source tab was not available from this terminal, so commit provenance was verified through the pushed Git history and live behavior.

## Operational follow-up

Vercel logs plus the existing scoped server-side error logging are sufficient for the current project size. In Vercel Project Settings, add deployment-failure and function-error notifications, and keep the production log drain/retention defaults unless traffic requires a paid observability service.

## Launch readiness

**Complete as of 2026-09-04.** The core portfolio, contact flow, admin inbox, security hardening, production browser checks, manual click-through, mobile chatbot sizing, and circular theme reveal have been verified. The custom domain remains intentionally deferred due to cost.

The custom domain remains intentionally deferred due to cost. After applying the Supabase migration, manually verify archive/restore in production and run `BASE_URL=https://your-deployment.vercel.app npm run test:browser` from an environment with Playwright browsers installed.

Keep this file and `.github/copilot-instructions.md` aligned when architecture, commands, or operational behavior changes.

## Final production contact verification — 2026-09-05

- The user confirmed that `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is present in Vercel Production, Preview, and Development environments.
- The user directly observed the Cloudflare Turnstile widget rendering and passing verification on the live production contact form; the supplied screenshot confirmed the successful submission flow.
- A real production contact submission was completed with the following inbox evidence shown in the supplied screenshot:
  - Sender name: `Test Production`
  - Sender email: `vaxelvillanueva252004@gmail.com`
  - Message: `TEST TEST TEST`
  - Inbox timestamp: `Sep 5, 2026, 6:12 AM`
- The screenshot showed the message present in the production admin inbox with the `Reply via Email` and `Archive` actions available.
- This closes the previously open production contact-form and admin-inbox verification item based on the user's direct live-site observation and supplied inbox screenshot.
- Resend notification delivery remains unconfirmed because no notification-recipient inbox evidence was provided. The contact submission's appearance in Supabase/admin inbox is verified; email notification receipt is not.
