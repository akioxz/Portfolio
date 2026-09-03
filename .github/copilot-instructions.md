# Copilot instructions for `akio-portfolio`

## Project overview

This is a Next.js App Router portfolio site using TypeScript, React 18, Tailwind CSS, Motion/GSAP, and Supabase. It is deployed to Vercel.

- `app/page.tsx` is intentionally a client component because it owns splash-screen state and composes the public sections in display order: splash, header, hero, stats, projects, stack, certifications, beyond-the-code content, footer, and the dynamically imported chatbot.
- Public UI is in `components/`; reusable structured content is in `data/` (education, certifications, and chatbot knowledge). The README lists the primary editable copy locations, while some structured section content remains local to its component.
- `app/layout.tsx` owns metadata, Inter and Geist Mono font loading, `ThemeProvider`, and the global CSS entry point. `next-themes` toggles the `.dark`/`.light` classes used by CSS variables.
- `app/api/contact/route.ts` is the public contact backend: Zod validates the request, Cloudflare Turnstile is verified server-side, requests are rate-limited, messages are stored in Supabase when configured, and Resend optionally sends notification and auto-reply emails.
- Contact verification is fail-closed: a missing `TURNSTILE_SECRET_KEY` returns `503`; a missing token, failed verification, malformed response, non-OK verification response, or verification network error returns `400` before persistence or email.
- `/admin/login` and `/admin/inbox` are the private contact-message inbox. The login route validates `ADMIN_PASSWORD` and issues a seven-day `admin_session` JWT; `lib/admin-session.ts` centralizes the issuer, audience, expiry, and Web Crypto-compatible verification. The inbox server page reads Supabase data and `InboxClient.tsx` handles expansion, optimistic read-state updates, refresh, search/filtering, deletion, and logout.
- `proxy.ts` is defense-in-depth for `/admin/:path*` and `/api/admin/:path*` using Next.js 16's proxy convention. Login and logout are allowed through; unauthenticated page requests redirect to login and unauthenticated admin API requests return `401`. Route-level checks remain authoritative.

## Commands

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Available project scripts:

```bash
npm run build   # production build and Next.js type checking
npm run start   # serve the production build
npm run lint    # ESLint using eslint.config.mjs
npm run test    # contact-route, admin-session, and middleware security tests
```

The focused test files are `tests/contact-route.test.cjs`, `tests/admin-session.test.cjs`, and `tests/middleware.test.cjs`; run one directly with `node --test <file>` when iterating. For changes, run `npm run lint` and `npm run test`; use `npm run build` when the change affects routing, server/client boundaries, configuration, or TypeScript.

Temporary scripts or harnesses for isolated behavior checks belong outside the repository or in the session workspace and must be removed after use.

See `UPDATED-PORTFOLIO.md` for the current continuation notes and prioritized follow-up work.

## Environment configuration

Copy `.env.local.example` to `.env.local` for local setup. The contact flow uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` and/or `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` and optional `CONTACT_DESTINATION_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (required to issue or validate admin sessions)

Do not expose service-role, Resend, Turnstile secret, password, or session-secret values in client components or `NEXT_PUBLIC_*` variables. Missing optional integrations are intentionally logged and skipped in development, but admin authentication cannot work without both `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.

## Codebase conventions

- Use the `@/*` path alias for repository-root imports, such as `@/components/Header` and `@/lib/admin-auth`.
- Respect App Router server/client boundaries. Add `"use client"` only to components that use hooks, browser APIs, portals, or event handlers. Keep Supabase server reads and authentication checks in server pages/API route handlers.
- The chatbot is dynamically imported with `ssr: false` because it depends on browser interaction and Motion. Portal-based modals must remain client-only and preserve Escape-to-close and body-scroll locking.
- Keep editable portfolio content in the existing section components or `data/` modules rather than embedding it in route handlers. The README identifies `Hero.tsx`, `About.tsx`, `Projects.tsx`, `Stack.tsx`, and `Footer.tsx` as primary copy locations; chatbot responses and prompt suggestions are defined in `data/chatbot-knowledge.ts`.
- Use the existing Tailwind design tokens (`bg-ink`, `bg-surface`, `text-cream`, `text-slate`, `text-amber`, `text-teal`) instead of hard-coded theme colors. These map to CSS variables in `app/globals.css` and support the `.dark`/`.light` themes.
- Preserve the typography split from `tailwind.config.ts`: `font-sans` uses Inter and `font-mono` uses Geist Mono. Labels, metadata, and technical UI generally use the mono face.
- Reuse the existing `react-icons/vsc` and `react-icons/si` icon sets plus Motion/GSAP patterns for interactive UI. Respect `useReducedMotion` where existing scroll or entrance animations use it.
- API handlers validate untrusted input at the boundary, return JSON with an appropriate HTTP status, log integration failures with a scoped prefix, and escape user-provided values before placing them in HTML email templates. Avoid moving secrets or server-only Supabase access into client components.
- Admin data comes from the Supabase `contact_messages` table, and rate limiting uses `contact_rate_limits`. Preserve the fallback in-memory rate limiter when Supabase configuration is unavailable.
- Message deletion is a protected permanent `DELETE /api/admin/messages/[id]` operation; keep the confirmation step and only remove the row from client state after the server confirms success.
- Production diagnostics use scoped server-side logs surfaced through Vercel; do not add an error aggregation dependency without an operational need.
- Keep the existing visual direction: near-black/white theme variables, restrained borders, mono UI labels, responsive Tailwind utilities, subtle grain, and motion rather than introducing a separate component or styling system. Preserve the sticky, scroll-driven project-card behavior when editing `Projects.tsx`.
- Do not edit generated `.next/` output or `tsconfig.tsbuildinfo`. `next-env.d.ts` is generated by Next.js; only accept its changes when they are produced by the current Next.js tooling.

## Repository-specific tooling

The repository contains local hook configurations under `.claude/`, `.codex/`, and `.cursor/`. They run Impeccable checks around UI edits after edits and at session stop; avoid bypassing or rewriting them when changing frontend files. The hooks may use machine-local skill paths, so keep their configuration intact.
