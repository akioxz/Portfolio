# Akio — Portfolio

Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Fonts: IBM Plex Mono (headings/labels) + IBM Plex Sans (body)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this folder to a GitHub repo (e.g. `akioxz/portfolio`)
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo
3. Leave all settings default (Vercel auto-detects Next.js) → Deploy
4. You'll get a live URL like `your-project.vercel.app`

## Editing content

All page content lives in `components/`:

- `Hero.tsx` — name, tagline, status, CTA buttons
- `About.tsx` — bio paragraph
- `Projects.tsx` — project cards (name, description, tags, status, repo link)
- `Stack.tsx` — frontend/backend tech tags
- `Footer.tsx` — social links + "currently shipping" line

To add a new project, copy a `<ProjectCard />` block inside `Projects.tsx` and
fill in the props (`status="shipped"` or `status="progress"` with a
`percent`).

