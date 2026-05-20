# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (http://localhost:3000)
npm run build        # production build
npm run start        # serve production build

# DB — run after schema changes
npx drizzle-kit push

# Seed admin user (EMAIL: admin@janseva.in  PW: Admin@1234)
npx tsx scripts/seed-admin.ts

# Seed pincodes
npx tsx scripts/seed-pincodes.ts
```

Required env vars in `.env.local`:
```
DATABASE_URL=              # Neon PostgreSQL connection string
AUTH_SECRET=               # openssl rand -base64 32
RAZORPAY_KEY_ID=           # rzp_test_... or rzp_live_...
RAZORPAY_KEY_SECRET=       # from Razorpay dashboard (server-only, never sent to client)
RAZORPAY_WEBHOOK_SECRET=   # set in Razorpay dashboard → Webhooks → Secret
```

## Stack

- **Next.js 16.2.4** · React 19 · TypeScript 5
- **Drizzle ORM** + `@neondatabase/serverless` → Neon PostgreSQL
- **NextAuth v5** (beta.31) · Credentials provider · JWT sessions · bcryptjs
- **Shadcn UI** (shadcn v4) built on `@base-ui/react` (NOT Radix)
- **Tailwind v4** (config in `app/globals.css`, no `tailwind.config.ts`)
- **React Hook Form v7** + `@hookform/resolvers v5` + **Zod v4**
- Sonner (toasts) · Vaul (drawer) · date-fns · react-day-picker

## Architecture

### Next.js 16 specifics
- **`middleware.ts` does not exist** — auth middleware lives in `proxy.ts` (Next.js 16 renamed it)
- Route groups: `(landing)`, `(auth)`, `(patient)`, `(admin)` — each has its own layout with `export const dynamic = "force-dynamic"`
- No root-level auth provider; each group layout calls `requireAdmin()` or `requirePatient()` server-side

### Route groups & pages

| Group | Path | Notes |
|-------|------|-------|
| `(landing)` | `/` | Public home with Hero, FeaturedTests, HealthPackages, HowItWorks, Testimonials, CTA, CoverageChecker |
| `(landing)` | `/tests` | Test listing; `/tests/[slug]` detail page |
| `(landing)` | `/packages` | Package listing |
| `(landing)` | `/book` | Booking wizard (5-step) |
| `(landing)` | `/about` | About page |
| `(landing)` | `/contact` | Contact page |
| `(auth)` | `/sign-in` | NextAuth sign-in |
| `(auth)` | `/sign-up` | Register new patient account |
| `(patient)` | `/patient/dashboard` | Patient overview |
| `(patient)` | `/patient/appointments` | Patient appointments |
| `(patient)` | `/patient/results` | Patient results |
| `(admin)` | `/admin/dashboard` | Admin stats + recent orders |
| `(admin)` | `/admin/orders` | Order list; `/admin/orders/[id]` detail |
| `(admin)` | `/admin/tests` | Test CRUD; `/admin/tests/new`, `/admin/tests/[id]/edit` |
| `(admin)` | `/admin/packages` | Package CRUD; `/admin/packages/new` |
| `(admin)` | `/admin/patients` | Patient list |
| `(admin)` | `/admin/pincodes` | Pincode management |
| `(admin)` | `/admin/results` | Results upload/management |
| root | `/results` | Public result lookup (mobile number) |
| root | `/results/[mobile]` | Public results for a mobile — no auth |

### Auth flow
- NextAuth v5 + Credentials provider + bcryptjs — config in `lib/auth/config.ts`
- `role` field on `users` table: `"patient"` (default) or `"admin"`
- JWT strategy: `role` is stored in the JWT token and attached to `session.user`
- `lib/auth/server.ts` exports `requireAdmin()` and `requirePatient()` — both redirect to `/sign-in` on failure
- `proxy.ts` enforces route-level protection: `/admin/*` requires `role === "admin"`, `/patient/*` requires any session

### API routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | — | Register patient (bcrypt hash, role: patient) |
| GET | `/api/tests` | — | List active tests (public) |
| GET | `/api/pincodes/check` | — | Check pincode serviceability |
| POST | `/api/orders` | — | Create order + upsert patient by mobile |
| GET | `/api/orders` | — | List all orders |
| GET | `/api/results` | — | Results; `?mobile=` filters by patient mobile |
| POST | `/api/contact` | — | Contact form submission |
| POST | `/api/payment/create-order` | — | Server recomputes total, creates Razorpay + DB order |
| POST | `/api/payment/verify` | — | HMAC-SHA256 signature verify, marks order paid |
| POST | `/api/payment/webhook` | Razorpay sig | Webhook handler (payment.captured / payment.failed) |
| GET/POST | `/api/admin/tests` | admin | List / create tests |
| PATCH/DELETE | `/api/admin/tests/[id]` | admin | Update (soft-delete via `isActive=false`) test |
| GET/POST | `/api/admin/packages` | admin | List / create packages |
| PATCH/DELETE | `/api/admin/packages/[id]` | admin | Update / delete package |
| GET/POST | `/api/admin/pincodes` | admin | List / create pincodes |
| PATCH/DELETE | `/api/admin/pincodes/[id]` | admin | Update / delete pincode |

### Database

Drizzle ORM + Neon serverless PostgreSQL. `lib/db/index.ts` uses a `Proxy` so the client never crashes at import time when `DATABASE_URL` is absent.

All types inferred from `lib/db/schema.ts` — no separate type files needed.

**Tables:**

| Table | Key fields |
|-------|-----------|
| `users` | `id`, `name`, `email`, `password_hash`, `role` (`patient`/`admin`), `mobile` |
| `test_categories` | `id`, `name`, `slug`, `icon`, `description`, `sort_order` |
| `tests` | `id`, `name`, `slug`, `code`, `category_id`, `price`, `discounted_price`, `sample_type`, `turnaround_hours`, `is_active`, `is_popular` |
| `packages` | `id`, `name`, `slug`, `price`, `discounted_price`, `test_ids` (int[]), `is_active`, `is_popular` |
| `pincodes` | `id`, `pincode`, `area_name`, `city`, `state`, `is_active`, `home_collection_available` |
| `patients` | `id`, `user_id` (nullable FK), `name`, `mobile` (unique), `email`, `dob`, `gender`, `address_line`, `pincode` |
| `collection_slots` | `id`, `date`, `time_label`, `max_bookings`, `current_bookings`, `is_available` |
| `orders` | `id`, `order_number`, `patient_id`, `items` (jsonb), `subtotal`, `discount`, `total`, `payment_status`, `collection_mode`, `collection_address`, `collection_pincode`, `slot_id`, `status` |
| `results` | `id`, `order_id`, `test_id`, `patient_id`, `parameters` (jsonb), `report_url`, `status`, `collected_at`, `processed_at`, `released_at` |

**Pricing:** stored as **integers in paise** (₹199 = `19900`). Use `formatPrice()` from `lib/utils.ts` to display.

**Order statuses:** `booked` → `sample_collected` → `processing` → `report_ready`

**Result statuses:** `pending` → `processing` → `released`

### UI components
- Shadcn UI uses `@base-ui/react` (NOT Radix) — **`asChild` prop does not exist on `<Button>`**
- For link-buttons always use `buttonVariants()` + `<Link>`: `<Link className={cn(buttonVariants({ variant: "outline" }), "...")} href="...">`
- Tailwind v4: config in `app/globals.css` under `@theme inline { ... }` — no `tailwind.config.ts`
- Brand tokens: `--color-navy-*`, `--color-brand-green-*`, `--color-teal-*` (legacy alias = same values as brand-green), `--color-sky-*`, `--color-orange-*`
- Semantic tokens: `--color-success` (#10B981), `--color-warning` (#F59E0B), `--color-error` (#EF4444)
- Utility classes: `bg-hero-gradient`, `bg-teal-gradient`, `bg-navy-gradient`, `shadow-card`, `shadow-card-hover`, `shadow-green-glow`
- Fonts: `font-sans` → Plus Jakarta Sans, `font-display` → Instrument Serif (italic weight)
- Theme primary = Logo Green (`#2DB549`); secondary = Navy-50

### Cart
- `lib/cart/cart-context.tsx` — `CartProvider` wraps `(landing)` layout; persists to `localStorage` under key `janseva-cart`
- Items keyed by `{ id, type }` where `type` is `"test" | "package"` — allows same numeric id for a test and a package to coexist
- `useCart()` is only valid inside `(landing)` subtree

### Booking wizard
- `components/booking/BookingWizard.tsx` — 5-step flow: Pincode → CollectionMode → SlotPicker → PatientDetails → Summary
- Each step is a separate component in `components/booking/steps/`
- `BookingData` interface: `pincode`, `areaName`, `collectionMode` (`"home"|"walkin"`), `date`, `slot`, `patientName`, `patientMobile`, `patientEmail`, `patientDob`, `patientGender`, `address`
- On submit, calls `POST /api/orders` — upserts patient by mobile number, creates order

### Razorpay payment integration

**Flow:**
1. SummaryStep → `POST /api/payment/create-order`  
   Server re-fetches all prices from DB (client prices never trusted), upserts patient, creates Razorpay order, inserts DB order with `razorpayOrderId` already set.
2. Client receives `razorpayOrderId + amount + keyId` → opens Razorpay checkout modal.
3. On success → `POST /api/payment/verify`  
   Server verifies HMAC-SHA256 signature (`razorpay_order_id|razorpay_payment_id` signed with `KEY_SECRET`), cross-checks `razorpayOrderId` against DB, marks `paymentStatus: "paid"`.
4. Client redirects to `/booking-confirmed?order=JL...`.
5. `POST /api/payment/webhook` — independent backup, verifies `X-Razorpay-Signature` with `RAZORPAY_WEBHOOK_SECRET`, idempotent (`paid` orders are not re-processed).

**Security invariants:**
- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are server-only; only `RAZORPAY_KEY_ID` is sent to the browser.
- Amount is always computed server-side — the client sends only item IDs and types.
- Signature checks use `crypto.timingSafeEqual` to prevent timing attacks.
- Webhook always returns 200 to prevent Razorpay retry storms on our parse errors.

**Webhook events configured in Razorpay dashboard:**
- `payment.captured` → marks order `paid`
- `payment.failed` → marks order `failed`

**DB fields added to `orders`:** `razorpay_order_id`, `razorpay_payment_id`  
**`paymentStatus` values:** `pending` | `paid` | `failed` | `refunded`

**Server-side Razorpay client:** `lib/razorpay.ts` — lazy singleton  
**Browser types:** `types/razorpay.d.ts`

### Public quick-result lookup
- `/results` → mobile number input; `/results/[mobile]` → shows reports for that mobile number
- No auth required — designed for patients who don't have accounts
- `GET /api/results?mobile=<number>` returns results for that patient

### Components map

```
components/
  booking/
    BookingWizard.tsx         # 5-step wizard shell
    CartDrawer.tsx            # slide-out cart
    steps/
      PincodeStep.tsx
      CollectionModeStep.tsx
      SlotPickerStep.tsx
      PatientDetailsStep.tsx
      SummaryStep.tsx
  landing/
    Hero.tsx
    FeaturedTests.tsx
    HealthPackages.tsx
    HowItWorks.tsx
    WhyJanseva.tsx
    Testimonials.tsx
    CoverageChecker.tsx       # pincode serviceability check
    TestSearch.tsx
    CtaBanner.tsx
  shared/
    SiteHeader.tsx
    SiteFooter.tsx
    PincodeInput.tsx
  tests/
    TestCard.tsx
  ui/                         # Shadcn components (@base-ui/react)
```

### Hooks
- `hooks/useDebounce.ts` — generic debounce
- `hooks/usePincodeCheck.ts` — debounced pincode serviceability check against `/api/pincodes/check`
