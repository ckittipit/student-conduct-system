# Student Conduct System — Frontend

Next.js 14 (App Router) dashboard for managing student conduct points: viewing/creating students, recording conduct violations and bonus points, and managing conduct categories. Installable as a PWA.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [NextAuth.js v5](https://authjs.dev/) (Google OAuth login)
- [TanStack Query](https://tanstack.com/query) for server state
- [shadcn/ui](https://ui.shadcn.com/) + Radix UI + Tailwind CSS
- React Hook Form + Zod for forms/validation
- `next-pwa` for offline/installable support

## Requirements

- Node.js 18+
- The [backend API](../backend/README.md) running and reachable

## Setup

```bash
npm install
# create a .env.local file (see Environment Variables below)
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXTAUTH_URL` | Public URL of this app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret used by NextAuth to sign session tokens |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `http://localhost:4000/api/v1`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

## Project Structure

```
src/
├── app/
│   ├── login/            # Google sign-in page
│   ├── (dashboard)/      # Protected dashboard routes (students, conduct-types, ...)
│   └── api/              # NextAuth route handlers
├── components/
│   ├── students/         # Student list/detail/create UI
│   ├── conduct/          # Conduct record UI
│   ├── bonus/            # Bonus record UI
│   ├── layout/           # Shells, nav
│   ├── shared/           # Reusable cross-feature components
│   └── ui/               # shadcn/ui primitives
├── hooks/                 # use-students, use-conduct, use-bonus (TanStack Query hooks)
├── lib/                   # api client, utils
├── auth.ts                # NextAuth configuration
└── middleware.ts           # Route protection
```

## Authentication

Login is handled via Google OAuth through NextAuth.js (`src/auth.ts`). Authenticated requests to the backend API are made with the resulting session token; `src/middleware.ts` guards dashboard routes.

## PWA

The app uses `next-pwa` for offline support and installability, configured in `next.config.mjs`. This has been toggled on/off during recent deploy debugging — check `next.config.mjs` for current status before assuming it's active.

## Deployment

Configured for Vercel. Cloudinary image domains are whitelisted via `images.remotePatterns` in `next.config.mjs`.
