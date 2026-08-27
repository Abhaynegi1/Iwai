# iwai — Every moment. Shared beautifully.

> **Iwai** is a lightweight event photo-sharing platform that turns weddings, birthdays, reunions, and celebrations into a collective memory space.

---

## 💡 Why We Made Iwai

At weddings, parties, festivals, and family reunions, dozens of people take hundreds of candid, irreplaceable photos. But after the event:

- Memories get scattered across unorganized WhatsApp chats with heavy compression.
- Google Drive links expire or require tedious permissions.
- Hosts spend weeks chasing guests for photos.
- Guests rarely get to see the moments captured by others.

**Iwai solves this by giving every event one private, shared gallery.**

```text
Organizer creates event ──► QR code / 6-char code generated ──► Guests scan & join ──► Snap & upload ──► Shared collective gallery
```

---

## 🌿 Design Philosophy

> *"The UI should disappear behind the memories."*

Iwai is built to feel like an **editorial photography collection** and a **premium wedding invitation**, rather than a generic SaaS dashboard or busy social feed.

- **Warm & Photographic**: Curated palette of Warm White (`#F7F7F5`), Ivory (`#FFFDF8`), and Deep Forest (`#123C35`), accented by Emerald (`#1E7A67`), Mint (`#43D399`), and Apricot (`#FFB86C`).
- **Restrained & Calm**: No distracting neon gradients, oversized glowing elements, or floating cards.
- **Photo-First**: Natural image aspect ratios, subtle borders, and immersive viewers let the photography take center stage.

---

## 📱 Product Surfaces

### 1. Mobile App (`apps/mobile`)
Designed as a lightweight **camera + shared gallery** with zero signup friction:
- **Instant Guest Access**: Join via camera QR scanner or 6-character code (`[ W ][ E ][ D ][ 2 ][ 0 ][ 2 ]`).
- **Integrated Camera**: Snap photos with live flash toggle, camera flip, and instant queueing.
- **Collective Gallery**: Live masonry grid with filter pills (*All*, *Recent*, *Popular*) and pull-to-refresh.
- **Immersive Photo Viewer**: Full-screen lightbox with likes, download/share, and uploader attribution.
- **Batch Uploading**: Multi-selection dropzone with thumbnail preview strip and background queue resilience.
- **Event & Guest Info**: Attendee lists, event details, and copyable event codes.

### 2. Web Platform & Dashboard (`apps/web`)
Comprehensive management suite for organizers and hosts:
- **Organizer Dashboard**: Create and configure events, dates, and cover photos.
- **QR Code & Invite Generator**: High-contrast printable QR codes for table cards and venue signage.
- **Gallery Moderation**: Manage attendees, approve/delete photos, and set upload permissions.
- **High-Res Batch Downloads**: Export all event photos in full quality.
- **Marketing Site**: Clean editorial landing page showcasing how Iwai works.

---

## 🏗️ System Architecture

Built as a **modular monolith** optimized for developer velocity, strict typing, and high throughput.

```text
                    ┌─────────────────────────┐
                    │      Next.js Web        │
                    │  (Marketing + Dashboard)│
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     NestJS API          │
                    │  (Modular Monolith REST)│
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        PostgreSQL           BullMQ / Redis*    Payment Gateways
     + Drizzle ORM         (Background Jobs)   (Stripe / Razorpay)
              │
              ▼
       Application State
     (Events, Users, Meta)

 Mobile App (Expo)
     │
     │ 1. Request signed URL
     ▼
 NestJS API
     │
     │ 2. Returns signed PUT URL
     ▼
 Cloudflare R2 Storage (Direct Binary Upload)
     │
     │ 3. Image Optimization Pipeline
     ▼
 Cloudflare CDN ──► Fast Global Gallery Delivery
```

> **Key Principle**: PostgreSQL only stores metadata and references. Photo binaries never touch the database; they upload directly to **Cloudflare R2** via presigned URLs and serve globally via **Cloudflare CDN**.

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Mobile** | [React Native](https://reactnative.dev/) · [Expo](https://expo.dev/) (SDK 54) · TypeScript | Fast iOS & Android cross-platform client |
| **Web** | [Next.js](https://nextjs.org/) (App Router) · React · TypeScript | Dashboard & public marketing portal |
| **Styling** | Vanilla CSS · Design Tokens · [Lucide Icons](https://lucide.dev/) | Warm, editorial design system |
| **Backend** | [NestJS](https://nestjs.com/) · TypeScript | Typed modular monolith REST API |
| **Database** | [PostgreSQL](https://www.postgresql.org/) · [Drizzle ORM](https://orm.drizzle.team/) | Relational state & type-safe queries |
| **Storage & CDN** | [Cloudflare R2](https://www.cloudflare.com/products/r2/) · Cloudflare CDN | S3-compatible zero-egress photo storage |
| **Validation** | [Zod](https://zod.dev/) | End-to-end type validation between client & server |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) · [Turborepo](https://turbo.build/) | Fast cached builds & clean module boundaries |

---

## 📂 Repository Structure

```text
iwai/
├── apps/
│   ├── api/             # NestJS REST API application
│   ├── mobile/          # Expo / React Native mobile application
│   └── web/             # Next.js web dashboard and landing page
│
├── packages/
│   ├── api-client/      # Isomorphic typed API client for web & mobile
│   ├── config/          # Shared ESLint, TypeScript, and Prettier configurations
│   ├── database/        # Drizzle schema, migrations, and database client
│   ├── shared/          # Shared domain types, interfaces, and constants
│   └── validation/      # Shared Zod validation schemas
│
├── docs/
│   └── architecture/    # Architectural decision records, roadmap & domain model
│
├── .github/
│   └── workflows/       # Continuous integration pipelines
│
├── package.json         # Workspace root scripts
├── pnpm-workspace.yaml  # Workspace configuration
└── turbo.json           # Turborepo task pipeline configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 10
- [PostgreSQL](https://www.postgresql.org/) ≥ 15 (for API & Database development)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the example environment files:

```bash
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
```

### 3. Run Development Servers

Start all applications concurrently via Turborepo:

```bash
pnpm dev
```

Or run individual apps:

```bash
# Mobile application (Expo Go / Dev Client)
pnpm --filter @iwai/mobile dev -c

# Next.js web application (http://localhost:3000)
pnpm --filter @iwai/web dev

# NestJS API (http://localhost:3001)
pnpm --filter @iwai/api dev
```

---

## 🛠️ Monorepo Commands

| Command | Action |
|---|---|
| `pnpm dev` | Run all applications in development mode |
| `pnpm build` | Build all packages and applications |
| `pnpm lint` | Run ESLint across all 8 packages |
| `pnpm typecheck` | Run TypeScript typechecks across the monorepo |
| `pnpm test` | Run Jest & Vitest test suites |
| `pnpm format` | Auto-format files with Prettier |
| `pnpm clean` | Clean build caches and artifacts |

---

## 🗺️ Roadmap & Milestones

- [x] **Phase 1 — Foundation**: Domain model, database schema, and monorepo setup.
- [x] **Phase 2 — Core Loop MVP**: Event creation, QR generation, guest join, camera capture, and live gallery feed.
- [x] **Phase 3 — UI/UX Overhaul**: Complete transition to the editorial memory-sharing design system.
- [ ] **Phase 4 — Organizer Suite**: Advanced permissions, moderation tools, and batch export.
- [ ] **Phase 5 — Monetization & Scale**: Subscription tiers, Cloudflare R2 production pipeline, and high-volume background processing.

---

## 📄 License

MIT © IWAI
