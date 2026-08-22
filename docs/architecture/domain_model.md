# IWAI — Domain Model & Architecture Specification

> **Platform Purpose**: An event memory platform where guests capture and share photos from weddings, birthdays, anniversaries, parties, and conferences into one shared, private, real-time gallery.

---

## 1. Actors & Roles

```
┌────────────────────────────────────────────────────────┐
│                        ACTORS                          │
├─────────────────┬───────────────────┬──────────────────┤
│ System Admin    │ Organization/User │ Guest Attendee   │
│ (Platform-wide) │ (Event Host)      │ (Anonymous/User) │
└─────────────────┴───────────────────┴──────────────────┘
```

### 1.1 Actor Types

1. **System Admin (`admin`)**:
   - Platform operator with access to global telemetry, organization tiers, abuse moderation, and system configuration.

2. **Organizer / Host (`user`)**:
   - An authenticated account (Email/Password or Google OAuth).
   - Creates and manages Organizations and Events.
   - Configures event dates, quotas, branding, and privacy.
   - Generates QR codes and short event passcodes.
   - Moderates photos (approving, hiding, deleting).
   - Upgrades subscription tiers for increased storage and features.

3. **Co-Host / Staff (`co_host`)**:
   - An attendee with elevated privileges within a single event.
   - Can delete/flag photos and invite attendees, but cannot change billing or delete the event.

4. **Guest Attendee (`guest`)**:
   - Zero-friction participation.
   - Enters via QR scan or short 6-character event code + nickname.
   - Holds an ephemeral, cryptographically signed Guest Event Token (`guest_token`).
   - Can upload photos from mobile/web camera, view gallery, like photos, and download permitted photos.

5. **Official Photographer (`photographer`)**:
   - Designated attendee role with bypass for guest upload limits and watermark/high-res preservation tags.

---

## 2. Core Entity Lifecycles

### 2.1 Event Lifecycle

```
 ┌───────────┐      Publish      ┌───────────┐
 │   DRAFT   │ ────────────────> │  ACTIVE   │
 └───────────┘                   └───────────┘
                                       │
                              Event End / Host Lock
                                       │
                                       ▼
 ┌───────────┐   Retention End   ┌───────────┐
 │  EXPIRED  │ <──────────────── │  LOCKED   │
 └───────────┘                   └───────────┘
```

- **`DRAFT`**: Event configured by organizer; QR/code generated but uploads not yet active.
- **`ACTIVE`**: Event is live. Guests can join, take photos, upload, and view the real-time gallery.
- **`LOCKED`**: Event has completed or host disabled uploads. Guests can view and download photos, but new uploads are rejected.
- **`ARCHIVED`**: Read-only archival state for host records.
- **`EXPIRED`**: Past storage retention period (e.g. 30 days for Free, 1 year for Pro). Photos scheduled for object storage cleanup.

---

### 2.2 Photo Lifecycle & Ingestion Pipeline

```
Mobile / Web Client
       │
       │ 1. POST /photos/upload-request (file metadata: size, mime, sha256)
       ▼
   API Server ────> Validates event status & guest quota
       │
       │ 2. Issues Pre-Signed PUT URL (Cloudflare R2) + Photo record (status: pending_upload)
       ▼
Cloudflare R2 Bucket
       ▲
       │ 3. Client uploads binary directly to R2
       │
Client ───────> 4. POST /photos/confirm-upload (photoId)
       │
   API Server ────> Verifies object exists & queues background processing
       │
       ▼
Worker / Pipeline
       ├── Generates WebP Thumbnail (400x400)
       ├── Generates WebP Preview (1600x1200)
       ├── Computes Blurhash placeholder
       ├── Extracts EXIF (date taken, orientation, camera metadata)
       └── Updates Photo record (status: ready)
       │
       ▼
Real-time Gallery Feed
```

#### Photo Statuses:
- **`pending_upload`**: Upload authorization granted; waiting for client upload confirmation (auto-expires after 30 mins).
- **`processing`**: Binary received; image optimization, thumbnailing, and blurhash computation in progress.
- **`ready`**: Photo fully processed and visible in event gallery.
- **`flagged`**: Flagged by moderation or host; hidden from guest gallery.
- **`deleted`**: Soft-deleted by host or uploader; scheduled for physical object removal.

---

## 3. Security & Permission Matrix

| Capability | Guest | Photographer | Co-Host | Organizer/Host | Admin |
|---|---|---|---|---|---|
| View Public Gallery | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload Photos | ✅ (Within Quota) | ✅ (Unlimited) | ✅ | ✅ | ✅ |
| Like Photos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Own Photo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Any Photo | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit Event Details | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Subscriptions | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 4. Authentication Strategy

1. **Organizers**:
   - Standard JWT Token Pair (`access_token`: 15m, `refresh_token`: 7d).
   - Payload: `{ sub: userId, email: string, role: string }`.

2. **Guests**:
   - Ephemeral Event JWT (`guest_token`: valid until event expires / 7d).
   - Payload: `{ sub: attendeeId, eventId: string, role: "guest", nickname: string }`.
   - Zero password requirement; stored in client local storage / secure storage.

---

## 5. Storage Quotas & Limits

| Plan Tier | Max Events | Max Photos / Event | Max File Size | Retention Period |
|---|---|---|---|---|
| **Free** | 1 active | 250 photos | 15 MB | 30 days after event |
| **Pro** | 5 active | 2,500 photos | 25 MB | 1 year |
| **Business** | Unlimited | 10,000+ photos | 50 MB | Unlimited / Custom |
