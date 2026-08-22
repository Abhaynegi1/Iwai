# IWAI — Architecture Overview

## What is IWAI?

IWAI is an event memory and photo-sharing platform. It lets event organizers create a shared photo gallery that every guest can contribute to simply by scanning a QR code — no app install required for guests.

**Core user journeys:**

- **Organizer** creates an event, gets a QR code, shares it with guests.
- **Guest** scans the QR code, takes photos with the web or mobile app, uploads them instantly.
- **Everyone** sees a unified, real-time gallery of memories.

---

## Monorepo Structure

```
iwai/
├── apps/
│   ├── api/          NestJS REST API (modular monolith)
│   ├── mobile/       Expo React Native app (camera-first)
│   └── web/          Next.js marketing site + organizer dashboard
│
├── packages/
│   ├── api-client/   Typed fetch client (Web + Mobile → API)
│   ├── config/       Shared ESLint, Prettier, TypeScript configs
│   ├── database/     Drizzle ORM + PostgreSQL (API only)
│   ├── shared/       Types, constants, enums (all apps)
│   └── validation/   Zod schemas (all apps)
│
└── docs/
    └── architecture/ This document and future ADRs
```

**Tool stack:**
- **Monorepo**: pnpm workspaces + Turborepo
- **Language**: TypeScript (strict mode everywhere)
- **CI**: GitHub Actions

---

## Web Application (`apps/web`)

Built with **Next.js** (App Router) and **React**.

**Responsibilities:**
- Public marketing pages
- Organizer authentication and dashboard
- Event creation and management UI
- Public gallery views (shareable links)
- Billing and subscription management

**Styling:** Tailwind CSS + shadcn/ui component library.

**Dependency rule:** Web communicates only with the API. It never imports `@iwai/database`.

---

## Mobile Application (`apps/mobile`)

Built with **Expo** and **React Native**.

**Responsibilities:**
- Camera-first photo capture experience
- QR code scanning to join events
- Photo upload to event galleries
- Real-time gallery view during events
- Push notifications (future)

**Key Expo capabilities leveraged:**
- `expo-camera` — native camera access
- `expo-barcode-scanner` — QR scanning
- `expo-image-picker` — photo library access
- `expo-notifications` — push notifications
- EAS Build — production builds and OTA updates

**Dependency rule:** Mobile communicates only with the API. It never imports `@iwai/database`.

---

## Backend API (`apps/api`)

Built with **NestJS** following a **modular monolith** architecture.

**Architecture decision: Modular Monolith**

The API is structured as a single deployable unit with clearly bounded modules. Each module owns its own:
- Controllers (HTTP interface)
- Services (business logic)
- Repository/query layer (database access)
- DTOs and validation

This makes it easy to:
1. Move fast initially (no network overhead between modules)
2. Enforce clean boundaries (modules import each other through interfaces, not directly)
3. Extract individual modules into microservices later if needed

**Planned modules:**
```
src/modules/
├── auth/           JWT + session management
├── users/          User profiles
├── organizations/  Organizer accounts / teams
├── events/         Event lifecycle
├── attendees/      Guest join / participation
├── photos/         Photo metadata and gallery logic
├── uploads/        Signed URL generation for R2
├── galleries/      Gallery views and sharing
├── subscriptions/  Plan management
├── payments/       Stripe integration
├── notifications/  Push + email
└── admin/          Internal admin tools
```

**Global API configuration:**
- Prefix: `/api`
- Versioning: `/api/v1/...` (URI-based)
- Global `ValidationPipe` (whitelist, transform)
- CORS configured via `CORS_ORIGIN` env var

---

## Database (`packages/database`)

**Technology:** PostgreSQL + Drizzle ORM

**Why Drizzle?**
- TypeScript-first with full type inference
- SQL-close API — no magic, predictable behavior
- Excellent migration tooling (Drizzle Kit)
- No ORM overhead

**Schema design (pending):**
The domain schema has not been designed yet. Tables will be added to `src/schema/` as features are designed.

**Migration strategy:**
- Drizzle Kit generates SQL migrations in `drizzle/`
- Migrations are committed to the repository
- Applied in CI/CD before deployment

**Dependency rule:** Only `apps/api` may import `@iwai/database`. Never Web or Mobile.

---

## Shared Packages

### `@iwai/shared`
Types, constants, and enums that are platform-agnostic and used by Web, Mobile, and API.

Examples: `ApiResponse<T>`, `PaginationMeta`, `APP_NAME`, HTTP status constants.

### `@iwai/validation`
Zod schemas for request validation. Shared so:
- API validates incoming requests with the same schemas
- Web and Mobile can validate form input before sending

### `@iwai/api-client`
A typed fetch-based HTTP client for the IWAI API. Used by Web and Mobile to interact with the API. Avoids duplicating fetch logic in both apps.

### `@iwai/config`
Shared ESLint configs, Prettier config, and TypeScript base configs.

---

## Data Flow

### Photo Upload (Future Architecture)

```
Mobile App
  │
  ├─► POST /api/v1/uploads/presigned-url
  │         API creates a presigned URL for Cloudflare R2
  │         Returns: { uploadUrl, photoId }
  │
  ├─► PUT {uploadUrl}  (direct browser → R2, bypasses API)
  │         Mobile uploads directly to R2
  │
  └─► POST /api/v1/photos
            API records photo metadata in PostgreSQL
            Triggers background job for processing

Background Worker (BullMQ + Redis)
  │
  ├─► Generate thumbnails
  ├─► Optimize image (WebP conversion)
  └─► Update photo metadata in DB

Cloudflare CDN
  └─► Serves optimized images globally
```

**Why direct-to-R2?**
Eliminates API as a proxy for large binary data. The API only handles metadata. This scales better and reduces bandwidth costs.

---

## Dependency Boundaries

```
┌──────────────────────────────────────────────────────┐
│ apps/web         apps/mobile                         │
│   │                │                                 │
│   └────┬───────────┘                                 │
│        │                                             │
│        ▼                                             │
│   @iwai/api-client  @iwai/shared  @iwai/validation   │
│        │                                             │
│        ▼                                             │
│   apps/api  ──────────────────► @iwai/database       │
│                                        │             │
│                                        ▼             │
│                                   PostgreSQL         │
└──────────────────────────────────────────────────────┘
```

**Rules:**
- `apps/web` and `apps/mobile` MUST NOT import `@iwai/database`
- `@iwai/database` MUST NOT import business logic from apps
- `@iwai/shared` and `@iwai/validation` have no app-layer dependencies

---

## Future Infrastructure (Not Yet Implemented)

| Component | Technology | Purpose |
|---|---|---|
| Object Storage | Cloudflare R2 | Photo storage |
| CDN | Cloudflare | Image delivery |
| Background Jobs | BullMQ + Redis | Image processing, notifications |
| Email | (TBD) | Transactional email |
| Push Notifications | Expo Push Service | Mobile notifications |

---

## Architectural Principles

1. **Modular monolith first** — add microservices only when there's a proven need.
2. **PostgreSQL is the source of truth** for relational data. Redis is ephemeral.
3. **Photos live in object storage** (R2), never in PostgreSQL BLOBs.
4. **Mobile and Web never talk to the database directly.** The API is the only gateway.
5. **Keep boundaries clean.** A module's internals are not the business of other modules.
6. **Avoid premature abstractions.** YAGNI until you actually need it.
7. **Everything should be replaceable.** No vendor lock-in at the application layer.
