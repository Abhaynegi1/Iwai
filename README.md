# IWAI

> Event memory and photo-sharing platform.

IWAI lets event organizers create a shared photo gallery that guests can contribute to simply by scanning a QR code — no app install required for guests.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm + Turborepo |
| Language | TypeScript (strict) |
| Web | Next.js · React · Tailwind CSS · shadcn/ui |
| Mobile | React Native · Expo |
| API | NestJS (modular monolith) |
| Database | PostgreSQL · Drizzle ORM |
| Storage (future) | Cloudflare R2 + CDN |
| Background Jobs (future) | Redis + BullMQ |

---

## Repository Structure

```
iwai/
├── apps/
│   ├── api/          # NestJS REST API
│   ├── mobile/       # Expo React Native app
│   └── web/          # Next.js marketing + dashboard
│
├── packages/
│   ├── api-client/   # Typed API client (shared by web + mobile)
│   ├── config/       # Shared ESLint, Prettier, TypeScript configs
│   ├── database/     # Drizzle ORM client + schema infrastructure
│   ├── shared/       # Shared types, constants, enums
│   └── validation/   # Shared Zod schemas
│
├── docs/
│   └── architecture/ # Architecture decision records
│
└── .github/
    └── workflows/    # GitHub Actions CI
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 10
- [PostgreSQL](https://www.postgresql.org/) (for API development)

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and other variables
```

### 3. Start all apps in development mode

```bash
pnpm dev
```

Or start individual apps:

```bash
# Web app (http://localhost:3000)
pnpm --filter web dev

# API (http://localhost:3001)
pnpm --filter api dev

# Mobile (Expo Go / simulator)
pnpm --filter mobile dev
```

---

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages and apps |
| `pnpm typecheck` | Type-check all packages and apps |
| `pnpm test` | Run all test suites |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm clean` | Clean all build artifacts |

---

## Dependency Boundaries

```
Web      ──► @iwai/shared · @iwai/validation · @iwai/api-client
Mobile   ──► @iwai/shared · @iwai/validation · @iwai/api-client
API      ──► @iwai/shared · @iwai/validation · @iwai/database
Database ──► (infrastructure only — no app dependencies)
```

Mobile and Web **never** talk directly to the database.

---

## Architecture

See [`docs/architecture/overview.md`](./docs/architecture/overview.md) for the full architecture overview.

---

## License

MIT © IWAI
