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

`npm run test` runs the focused contact-route security tests in `tests/contact-route.test.cjs`. There is no supported single-test selector beyond invoking that file directly with `node --test tests/contact-route.test.cjs`.

## Next work

1. Expand security coverage around admin session verification and middleware failure paths.
2. Improve admin inbox usability with explicit request-failure feedback before adding destructive actions.
3. Review production observability for Supabase, Resend, and Turnstile failures.
4. Polish project previews, accessibility, and image loading without changing the existing visual direction.

Keep this file and `.github/copilot-instructions.md` aligned when architecture, commands, or operational behavior changes.
