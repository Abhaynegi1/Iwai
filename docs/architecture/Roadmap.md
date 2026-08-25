# IWAI — Product & Engineering Roadmap

> IWAI is an event memory platform where guests can capture and share photos from weddings, birthdays, anniversaries, parties, and other events in one shared private gallery.

---

## 0. Guiding Principle

IWAI should be built in stages.

We are **not** trying to build a massive scalable system on day one.

Our approach:

> **Validate → Build → Launch → Monetize → Measure → Scale**

Architecture should be designed with future growth in mind, but infrastructure should only become more complex when the product actually requires it.

### Core principles

- Start with a modular monolith.
- Keep clear boundaries between modules.
- PostgreSQL is the source of truth for application data.
- Photos are stored in object storage, never in PostgreSQL.
- Mobile and Web communicate through the API.
- Avoid premature microservices.
- Avoid unnecessary infrastructure.
- Build for the first paying customers before optimizing for millions of users.
- Every major architectural decision should have a clear reason.

---

# Phase 1 — Foundation & Domain Design

### Goal

Establish a clean technical foundation and understand the product domain before implementing features.

### Tasks

- [x] Define the complete IWAI product flow.
- [x] Identify all actors:
  - Organizer
  - Attendee/Guest
  - Admin
  - Future Photographer/Event Planner
- [x] Define event lifecycle.
- [x] Define attendee lifecycle.
- [x] Define photo lifecycle.
- [x] Define permissions and roles.
- [x] Define event ownership.
- [x] Define upload limits.
- [x] Define storage limits.
- [x] Define event expiration.
- [x] Define subscription concepts.
- [x] Design PostgreSQL database schema.
- [x] Define database relationships.
- [x] Define API boundaries.
- [x] Define shared validation schemas.
- [x] Define error-handling strategy.
- [x] Define authentication strategy.
- [x] Document important architectural decisions.

### Deliverable

A finalized domain model and database design that can support the MVP without unnecessary complexity.

---

# Phase 2 — Core Backend

### Goal

Build the backend foundation and core business logic.

### Initial modules

```text
API
├── Auth
├── Users
├── Organizations
├── Events
├── Attendees
├── Photos
└── Uploads
```

### Tasks

- [x] Configure PostgreSQL + Drizzle.
- [x] Create database schema (`users`, `organizations`, `events`, `attendees`, `photos`, `photo_likes`, `subscriptions`).
- [x] Implement migrations (applied to Neon Singapore PostgreSQL).
- [x] Implement authentication (Organizer JWT + Refresh token & Guest ephemeral JWT).
- [x] Implement users & profile management.
- [x] Implement organizations & multi-tenant memberships.
- [x] Implement event creation (with unique 6-char event codes & slugs).
- [x] Implement event management (CRUD, status lifecycle, public lookup).
- [x] Implement attendee management (listing, profile updates, host role delegation).
- [x] Implement event joining (zero-friction guest nickname + code join).
- [x] Implement permissions (`JwtAuthGuard`, `GuestAuthGuard`, `RolesGuard`).
- [x] Implement upload authorization (pre-signed URLs & quota limits).
- [x] Implement dual storage driver (Local Storage for dev + Cloudflare R2 for cloud).
- [x] Implement photo metadata, direct upload confirmation, and likes.
- [x] Implement API validation (Zod validation pipes).
- [x] Implement API error handling (`GlobalExceptionFilter` & `TransformInterceptor`).
- [x] Add API tests (Auth, Events, Attendees, Photos, and Health suites).

### Deliverable

✅ **Completed:** A functioning, tested modular monolith backend in NestJS capable of supporting the complete guest join, photo upload, event management, and gallery flow.

---

# Phase 3 — Mobile MVP

### Goal

Build the simplest possible guest experience.

The most important UX principle:

> **A guest should be able to join an event and upload a photo with almost zero friction.**

### Core flow

```text
Open IWAI
    ↓
Scan QR / Enter Code
    ↓
Join Event
    ↓
Camera
    ↓
Take Photo
    ↓
Upload
    ↓
Shared Gallery
```

### Tasks

- [ ] Event joining.
- [ ] QR scanning.
- [ ] Camera interface.
- [ ] Photo capture.
- [ ] Photo preview.
- [ ] Upload progress.
- [ ] Upload retry.
- [ ] Shared gallery.
- [ ] Basic event information.
- [ ] Basic attendee information.
- [ ] Handle poor network conditions.
- [ ] Local upload queue if required.
- [ ] Basic analytics.

### Important

The mobile application should remain lightweight.

Avoid unnecessary:

- animations
- screens
- onboarding
- account creation
- configuration

The guest experience is the core product.

---

# Phase 4 — Web & Organizer Dashboard

### Goal

Give organizers control over their event.

### Organizer flow

```text
Sign Up
   ↓
Create Event
   ↓
Configure Event
   ↓
Generate QR
   ↓
Share QR
   ↓
Guests Upload
   ↓
Monitor Gallery
```

### Features

- [ ] Authentication.
- [ ] Organizer dashboard.
- [ ] Event creation.
- [ ] Event settings.
- [ ] QR generation.
- [ ] Attendee list.
- [ ] Upload limits.
- [ ] Photo moderation.
- [ ] Delete photos.
- [ ] Gallery management.
- [ ] Event statistics.
- [ ] Download/export.
- [ ] Event status.
- [ ] Event expiration settings.

### Marketing website

- [ ] Landing page.
- [ ] Product explanation.
- [ ] How it works.
- [ ] Pricing.
- [ ] FAQ.
- [ ] Contact.
- [ ] Login.
- [ ] Signup.

---

# Phase 5 — Photo Infrastructure

### Goal

Build a reliable and scalable photo pipeline.

Photos are the most important infrastructure concern in IWAI.

### Architecture

```text
Mobile
   ↓
API
   ↓
Signed Upload URL
   ↓
Object Storage
   ↓
Background Processing
   ↓
Optimized Images
   ↓
CDN
   ↓
Gallery
```

### Storage

Use object storage such as:

- Cloudflare R2

Do NOT store image files in PostgreSQL.

PostgreSQL should only contain metadata such as:

```text
photoId
eventId
uploaderId
storageKey
thumbnailKey
status
createdAt
```

### Tasks

- [ ] Signed upload URLs.
- [ ] Direct client → storage uploads.
- [ ] Upload validation.
- [ ] File size limits.
- [ ] File type validation.
- [ ] Image metadata.
- [ ] Thumbnail generation.
- [ ] Image optimization.
- [ ] Background processing.
- [ ] CDN delivery.
- [ ] Failed upload handling.
- [ ] Storage cleanup.
- [ ] Event expiration cleanup.

---

# Phase 6 — MVP Testing & Real-World Validation

### Goal

Put IWAI into actual events.

Do NOT optimize for scale yet.

Test with real users.

### Initial targets

- [ ] Internal testing.
- [ ] Friends/family events.
- [ ] 5–10 real events.
- [ ] Observe actual guest behavior.
- [ ] Identify upload failures.
- [ ] Identify confusing UX.
- [ ] Measure gallery usage.
- [ ] Measure number of photos per event.
- [ ] Measure average photo size.
- [ ] Measure retention.
- [ ] Collect organizer feedback.

### Questions to answer

- Do guests understand how to join?
- Is QR onboarding fast enough?
- Do guests actually upload photos?
- Do organizers find the dashboard useful?
- How many photos does a typical guest upload?
- How much storage does one event consume?
- What causes users to abandon uploads?
- Would organizers pay for this?
- What feature do organizers actually care about?

---

# Phase 7 — Monetization

### Goal

Turn IWAI from a project into a business.

Do not build a complicated billing system before validating demand.

### Initial model

Possible pricing models:

```text
Per Event
     OR
Event Packages
     OR
Monthly Subscription
```

Potential plans:

```text
Free
├── Limited storage
├── Limited event duration
└── Basic gallery

Pro
├── More storage
├── Larger events
├── Longer retention
├── Downloads
└── Advanced controls

Business
├── Multiple events
├── Multiple organizers
├── Branding
└── Advanced analytics
```

### Tasks

- [ ] Define pricing.
- [ ] Implement plans.
- [ ] Implement subscriptions.
- [ ] Integrate payment provider.
- [ ] Implement billing state.
- [ ] Implement storage quotas.
- [ ] Implement event limits.
- [ ] Implement subscription expiration.
- [ ] Implement invoices/receipts.
- [ ] Add billing dashboard.

### Initial payment providers

- Razorpay
- Stripe

Choose based on target market and actual payment requirements.

---

# Phase 8 — Production Hardening

### Goal

Make IWAI reliable enough for paying customers.

### Security

- [ ] Authentication hardening.
- [ ] Authorization checks.
- [ ] Rate limiting.
- [ ] Input validation.
- [ ] Upload validation.
- [ ] Signed URLs.
- [ ] Secure storage access.
- [ ] Secret management.
- [ ] Security headers.
- [ ] Audit important actions.

### Reliability

- [ ] Error tracking.
- [ ] Logging.
- [ ] Monitoring.
- [ ] Health checks.
- [ ] Database backups.
- [ ] Background job monitoring.
- [ ] Retry strategies.
- [ ] Graceful failure handling.

### Testing

- [ ] Unit tests.
- [ ] Integration tests.
- [ ] API tests.
- [ ] E2E tests.
- [ ] Mobile critical-flow tests.
- [ ] Upload failure tests.
- [ ] Payment tests.

---

# Phase 9 — Scale

### Goal

Scale only the parts that actually become bottlenecks.

Initial architecture:

```text
Web
 │
 ▼
NestJS Modular Monolith
 │
 ├── PostgreSQL
 ├── Object Storage
 └── Background Workers
```

As traffic grows:

```text
                    CDN
                     │
              ┌──────┴──────┐
              ▼             ▼
             Web            API
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
             PostgreSQL   Redis      Queue
                                      │
                                      ▼
                              Background Workers
```

### Potential scaling areas

#### API

Scale horizontally when required:

```text
API Instance 1
API Instance 2
API Instance 3
```

#### Database

- [ ] Query optimization.
- [ ] Proper indexes.
- [ ] Connection pooling.
- [ ] Read replicas if necessary.
- [ ] Database scaling when justified.

#### Photos

- [ ] CDN caching.
- [ ] Image optimization.
- [ ] Storage lifecycle policies.
- [ ] Multiple image resolutions.

#### Background processing

Use:

```text
Redis
+
BullMQ
+
Workers
```

for:

- Image processing
- Notifications
- Cleanup
- Event expiration
- Other long-running jobs

---

# Phase 10 — Microservices (Only If Necessary)

### IMPORTANT

Do not introduce microservices simply because IWAI is growing.

First determine the actual bottleneck.

A module should become a separate service only when there is a strong reason such as:

- Independent scaling requirements.
- Independent deployment requirements.
- High resource consumption.
- Reliability isolation.
- Clear team ownership.
- Significant performance requirements.

### Example

If image processing becomes extremely expensive:

```text
IWAI API
   │
   ▼
Photo Queue
   │
   ▼
Image Processing Service
   │
   ├── Worker 1
   ├── Worker 2
   ├── Worker 3
   └── Worker N
```

The rest of IWAI can remain a modular monolith.

---

# Phase 11 — Product Expansion

Once the core product is proven, explore:

### Event Professionals

- [ ] Photographer accounts.
- [ ] Event planner accounts.
- [ ] Multi-event management.
- [ ] Client management.
- [ ] White-label galleries.
- [ ] Custom branding.

### Guest Experience

- [ ] Reactions.
- [ ] Comments.
- [ ] Favorites.
- [ ] Highlights.
- [ ] Shared albums.
- [ ] Video support.
- [ ] AI-powered highlights.
- [ ] Automatic event recap.

### Business Features

- [ ] Custom domains.
- [ ] Branding.
- [ ] Advanced analytics.
- [ ] Team accounts.
- [ ] Organization management.
- [ ] API access.
- [ ] Enterprise plans.

---

# 🚦 Release Stages

## Stage 1 — Internal

```text
Developers
   ↓
Friends & Family
```

Goal: find technical and UX problems.

---

## Stage 2 — Private Beta

```text
5–10 Events
```

Goal: validate the core experience.

---

## Stage 3 — Public MVP

```text
Real Users
+
Basic Pricing
```

Goal: determine whether people will pay.

---

## Stage 4 — Paid Product

```text
Paying Organizers
+
Reliable Infrastructure
```

Goal: establish repeatable revenue.

---

## Stage 5 — Scale

```text
More Events
+
More Storage
+
More Users
```

Goal: optimize infrastructure based on actual usage.

---

# 📊 Metrics That Matter

Avoid vanity metrics.

Track:

### Event Metrics

- Events created
- Events completed
- Photos per event
- Average photos per guest
- Active guests per event

### Engagement

- Event join rate
- Upload rate
- Gallery views
- Returning users
- Upload completion rate

### Business

- Free → paid conversion
- Revenue per event
- Customer acquisition cost
- Customer retention
- Storage cost per event
- Infrastructure cost per event

### Most important metric

> **How many organizers would pay for IWAI again?**

---

# 🧭 Final Development Path

```text
                    IWAI
                      │
                      ▼
              Domain Design
                      │
                      ▼
               Core Backend
                      │
                      ▼
                Mobile MVP
                      │
                      ▼
             Organizer Website
                      │
                      ▼
            Photo Infrastructure
                      │
                      ▼
             Real Event Testing
                      │
                      ▼
                Monetization
                      │
                      ▼
           Production Hardening
                      │
                      ▼
                  Scaling
                      │
             ┌────────┴────────┐
             ▼                 ▼
       Stay Modular       Extract Service
                           if necessary
```

---

# 🏁 Definition of Success

IWAI is successful when:

1. An organizer can create an event.
2. Guests can join with minimal friction.
3. Guests can capture and upload photos.
4. Everyone can view the shared gallery.
5. The system works reliably during real events.
6. Organizers understand the value.
7. Organizers are willing to pay.
8. Revenue can cover infrastructure costs.
9. The architecture can scale based on actual demand.

> **Build the smallest product that proves the business. Then scale the parts that become expensive.**
```