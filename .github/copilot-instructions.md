# Copilot instructions for `akio-portfolio`

## Project overview

This is a Next.js App Router portfolio site using TypeScript, React 18, Tailwind CSS, Motion, and Supabase.

- `app/page.tsx` is the public landing page. It is a client component that composes the portfolio sections in display order: splash, header, hero, stats, projects, stack, certifications, beyond-the-code content, footer, and the client-only chatbot.
- Most public UI lives in `components/`. Portfolio copy and structured content that is shared by UI logic lives in `data/` (for example, education, certifications, and chatbot knowledge).
- `app/layout.tsx` owns global metadata, Google font loading, the theme provider, and the global CSS entry point.
- `app/api/contact/route.ts` is the public contact-form backend. It validates input with Zod, applies rate limiting, optionally verifies Cloudflare Turnstile, stores submissions in Supabase, and optionally sends notification and auto-reply email through Resend.
- `/admin/login` and `/admin/inbox` provide the private contact-message inbox. `lib/admin-auth.ts` validates the password and signs/verifies a seven-day `admin_session` JWT cookie with `jose`. The inbox page checks the session on the server, loads messages from Supabase, and delegates interactive expansion/read-state updates to `InboxClient.tsx`.
- Admin API routes require the same session check. The read endpoint updates `contact_messages.is_read`; logout deletes the session cookie.

## Commands

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Available project scripts:

```bash
npm run build   # production build; also performs Next.js type checking
npm run start   # serve the production build
npm run lint    # ESLint using eslint.config.mjs
```

There is currently no test script or test suite in the repository, so there is no supported single-test command. For a focused validation pass, run `npm run lint` and `npm run build` after changes.

## Environment configuration

Copy `.env.local.example` to `.env.local` for local setup. The contact flow uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` and/or `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` and optional `CONTACT_DESTINATION_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (required to issue or validate admin sessions; add it locally even though the example file may not list it)

Do not expose service-role, Resend, Turnstile secret, password, or session-secret values in client components or `NEXT_PUBLIC_*` variables. Missing optional integrations are intentionally logged and skipped in development, but admin authentication cannot work without both `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.

## Codebase conventions

- Use the `@/*` path alias for repository-root imports, such as `@/components/Header` and `@/lib/admin-auth`.
- Respect App Router server/client boundaries. Add `"use client"` only to components that use hooks, browser APIs, portals, or event handlers. Keep Supabase server reads and authentication checks in server pages/API route handlers.
- The public page is intentionally a client composition because of the splash state and interactive sections. The chatbot is dynamically imported with `ssr: false` because it depends on browser interaction and Motion.
- Keep editable portfolio content in the existing section components or `data/` modules rather than embedding it in route handlers. Project cards are defined in `components/Projects.tsx`; chatbot responses and prompt suggestions are defined in `data/chatbot-knowledge.ts`.
- Use the existing Tailwind design tokens (`bg-ink`, `bg-surface`, `text-cream`, `text-slate`, `text-amber`, `text-teal`) instead of hard-coded theme colors. These map to CSS variables in `app/globals.css` and support the `.dark`/`.light` themes.
- Preserve the typography split from `tailwind.config.ts`: `font-sans` uses Inter and `font-mono` uses Geist Mono. Labels, metadata, and technical UI generally use the mono face.
- Reuse the existing `react-icons/vsc` icon set and Motion patterns for interactive UI. Keep overlays/modals portal-based and preserve Escape-to-close, body-scroll locking, and accessible dialog/button labels.
- API handlers validate untrusted input at the boundary, return JSON with an appropriate HTTP status, log integration failures with a scoped prefix, and escape user-provided values before placing them in HTML email templates.
- Admin data comes from the Supabase `contact_messages` table, and rate limiting uses `contact_rate_limits`. Preserve the fallback in-memory rate limiter when Supabase configuration is unavailable.
- Keep the existing visual direction: near-black/white theme variables, restrained borders, mono UI labels, responsive Tailwind utilities, subtle grain, and motion rather than introducing a separate component or styling system.

## Repository-specific tooling

The repository contains local hook configurations under `.claude/`, `.codex/`, and `.cursor/`. They run Impeccable checks around UI edits; avoid bypassing or rewriting them when changing frontend files.
