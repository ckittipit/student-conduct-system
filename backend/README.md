# Student Conduct System — Backend

NestJS REST API for tracking student conduct points: disciplinary records, bonus point rewards, and conduct categories. Uses PostgreSQL via Prisma, JWT auth with Google OAuth login, and Cloudinary for evidence image uploads.

## Tech Stack

- [NestJS 11](https://nestjs.com/) (TypeScript)
- [Prisma 5](https://www.prisma.io/) + PostgreSQL
- Passport: JWT strategy + Google OAuth2 strategy
- Cloudinary (image uploads)
- Swagger / OpenAPI docs
- Helmet, class-validator, @nestjs/throttler

## Requirements

- Node.js >= 20.11.0
- A PostgreSQL database (see `docker-compose.yml` in the repo root for a local instance)

## Setup

```bash
npm install
# create a .env file (see Environment Variables below)
npx prisma migrate deploy   # apply migrations
npm run start:dev
```

The API listens on `http://localhost:4000` by default, with all routes prefixed under `/api/v1`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT access tokens |
| `JWT_EXPIRES_IN` | JWT token expiry (e.g. `1d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BACKEND_URL` | Public URL of this API (used in OAuth callback) |
| `FRONTEND_URL` | URL of the frontend app (used for CORS) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PORT` | Port to listen on (default `4000`) |

## Scripts

```bash
npm run start:dev      # watch mode
npm run start:prod      # run compiled build (node dist/src/main)
npm run build           # nest build
npm run lint             # eslint --fix
npm run format           # prettier
npm run test             # unit tests
npm run test:e2e         # e2e tests
npm run test:cov         # coverage
```

## Database

Schema is defined in `prisma/schema.prisma`. Core models:

- **User** — `ADMIN` / `TEACHER` / `VIEWER` roles, Google login, records conduct/bonus entries
- **Student** — code, name, grade level (M1–M6), `totalPoints` (default 100), active flag
- **ConductType** / **ConductItem** — categories of violations and their point deductions
- **ConductRecord** — a logged incident: student, conduct item, recording user, remark category (`CONFESSION` / `PROBATION` / `WITHDRAWN`), optional evidence URL
- **BonusRecord** — a logged reward: student, recording user, title, points added

```bash
npx prisma migrate dev --name <change>   # create a new migration
npx prisma studio                         # browse data
```

## API Docs

Swagger UI is available at `/api/docs` once the server is running (e.g. `http://localhost:4000/api/docs`).

## Project Structure

```
src/
├── auth/             # JWT + Google OAuth strategies, guards
├── students/         # Student CRUD
├── conduct-types/     # Manage violation categories/items
├── conduct-records/   # Record incidents, deduct points
├── bonus-records/      # Award bonus points
├── cloudinary/         # Image upload service
├── prisma/             # Prisma service/module
└── main.ts             # App bootstrap
```

## Deployment

Configured for Railway. Build with `npm run build`, run with `npm run start:prod`.
