# Housing & Roommate Management Platform: Frontend Requirements

Frontend for the B7A6 backend (Express + Prisma + Stripe). Built to satisfy the assignment's Project Requirements. Everything marked **MUST** is graded.

Backend repo: https://github.com/Saif-Smran/Assignment-B7A6-Housing-Roommate-Management-backend
All backend routes are prefixed with `/api`. Responses follow `{ success, message, data, errors? }`. Lists return `data: { items, pagination: { page, limit, total, pages } }`.

---

## 1. Tech Stack

| Category | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript (strict) | Server Components by default |
| Styling / UI | Tailwind CSS + shadcn/ui | One theme, light and dark tokens |
| Server state | TanStack Query | Mutations, invalidation, client refetch |
| Client state | React Context for auth user. Zustand only if a wizard needs it | Do not add both without a reason |
| Forms | React Hook Form + Zod (`@hookform/resolvers`) | Real-time validation |
| Auth | Custom JWT stored in httpOnly cookies + Next middleware | See section 3 |
| Payments | Stripe Checkout (test mode) | Backend creates the session, frontend redirects |
| Charts | Recharts | Admin and owner analytics |
| Media / icons | `next/image`, Lucide React | Cloudinary in `remotePatterns` |
| Toasts | Sonner | All API failures |
| Deployment | Vercel | Set backend `FRONTEND_URL` to the deployed origin |

Not used: SSLCommerz, NextAuth, Chart.js. One tool per job.

---

## 2. Roles

Backend roles are `TENANT`, `OWNER`, `ADMIN`. Owner is the "Provider" role from the assignment brief.

| Role | Dashboard root | Can do |
|---|---|---|
| TENANT | `/dashboard` | Browse, apply, request viewings, pay, raise maintenance |
| OWNER | `/owner` | Manage own properties and rooms, handle applications, viewings, maintenance, see earnings |
| ADMIN | `/admin` | Manage users and roles, all properties, platform stats, audit logs |

**MUST** enforce at two levels:
1. **Route level:** middleware checks the role from the JWT and redirects wrong-role users (to their own dashboard) and guests (to `/login?redirect=...`).
2. **UI level:** conditional rendering by role (nav links, action buttons, tables). Never rely on hiding alone, the backend is the last line of defense.

---

## 3. Auth Architecture (decide once, follow everywhere)

Problem: Next middleware cannot read `localStorage`, and cross-domain cookies from the backend are fragile. Solution: backend-for-frontend pattern.

- `POST /api/auth/login` (Next route handler) calls backend `/api/auth/login`, then sets httpOnly cookies: `accessToken`, `refreshToken`. Also sets a non-sensitive `role` cookie for UI hints.
- Middleware verifies the access token with `jose` and reads the role claim. Use `middleware.ts` (or `proxy.ts` on Next.js 16+).
- Server Components read the cookie and call the backend with `Authorization: Bearer <token>` through one `serverFetch` helper.
- Client components call a Next proxy route handler (`/api/backend/[...path]`) that attaches the bearer token. The token never touches client JS.
- On a 401, the proxy tries `/auth/refresh-token` once, retries, and on failure clears cookies and redirects to `/login`.
- Logout clears cookies and calls backend `/auth/logout`.
- Optional bonus: Google sign-in via ID token (backend already supports it).

**Demo login (MUST):** `/login` has three one-click buttons (Admin, Tenant, Owner). Each calls a server action that logs in with credentials from server-only env vars (`DEMO_ADMIN_EMAIL`, etc.), then redirects to that role's dashboard. Demo accounts must exist in the deployed database (use the backend seed util). Owner demo account needs seeded properties, rooms, applications, and payments so no screen looks empty.

---

## 4. Core Rules Checklist

- [ ] **Real API only.** No mock data, hardcoded JSON, or placeholder content in any core flow.
- [ ] **No placeholder content.** No Lorem ipsum, no placeholder images. Seed real-looking properties with real Cloudinary images.
- [ ] **URL state sync.** Every filter, sort, search, and pagination control reads and writes `useSearchParams` (`?page=2&city=Dhaka&minRent=5000`). Debounce the search input. Reset `page` to 1 when a filter changes.
- [ ] **Loading.** A `loading.tsx` skeleton for every data-fetching route. No full-page spinners.
- [ ] **Errors.** `error.tsx` at root and in each dashboard segment, `not-found.tsx`, Sonner toast on every failed mutation or fetch.
- [ ] **Empty states.** Every list and table has an icon, message, and a next action.
- [ ] **Images.** `next/image` everywhere, with `sizes` and `alt`.
- [ ] **Server Components by default.** `"use client"` only for state, effects, and event handlers. Keep client islands small (filter bar, forms, charts).
- [ ] **TypeScript.** `strict: true`, zero `any`. Types for every API response, prop, and form.
- [ ] **Mobile-first.** Test at 375, 768, 1280 in DevTools. Tables collapse to cards or scroll in their own container.
- [ ] **SEO.** `generateMetadata` (title, description, Open Graph) on every public page. Property detail uses the property title and primary image.

---

## 5. Pages (28 routes, minimum 18 required)

### Public (Server Components, SEO metadata)

| Route | Page | Data |
|---|---|---|
| `/` | Home: hero search, featured properties, how it works, stats, CTA | `GET /properties?limit=6` |
| `/properties` | Listing with filters, sort, pagination (the "Services" page) | `GET /properties`, `GET /properties/search?q=` |
| `/properties/[id]` | Detail: gallery, amenities, rooms list, request viewing, apply | `GET /properties/:id`, `GET /properties/:id/rooms` |
| `/about` | Mission, team, platform story | Static, real copy |
| `/contact` | Validated contact form with toast | Static form. If no backend endpoint exists, add one or use a real email service. No fake submit |
| `/faq` | Domain page: FAQ accordion for tenants and owners | Static, real copy |

Listing filters (URL-synced): `q`, `city`, `minRent`, `maxRent`, `propertyType`, `sortBy`, `sortOrder`, `page`, `limit`.

### Authentication

| Route | Page |
|---|---|
| `/login` | Email and password form, three Demo Login buttons, optional Google sign-in |
| `/register` | Role choice (Tenant or Owner only, never Admin), name, email, phone, password. Zod validated |

### Tenant Dashboard (`/dashboard`, TENANT only)

| Route | Page | Data |
|---|---|---|
| `/dashboard` | Overview: stat cards, latest applications, upcoming viewings | `GET /applications/my`, `GET /viewing-requests`, `GET /payments/my` |
| `/dashboard/applications` | Table with status filter and pagination, cancel action | `GET /applications`, `PATCH /applications/:id/status` |
| `/dashboard/viewings` | Viewing requests with status, cancel action | `GET /viewing-requests`, `PATCH /viewing-requests/:id/status` |
| `/dashboard/maintenance` | Submit and track requests. Form only for rooms with an approved application | `GET /maintenance-requests`, `POST /rooms/:id/maintenance` |
| `/dashboard/payments` | Payment history plus "Pay now" for approved applications (rent, deposit) | `GET /payments/my`, `POST /payments/initiate` |
| `/dashboard/profile` | Profile form with validation | `GET/PATCH /users/me` |

### Owner Dashboard (`/owner`, OWNER only)

| Route | Page | Data |
|---|---|---|
| `/owner` | Overview: stat cards, pending applications, recent activity | Aggregated from lists below |
| `/owner/properties` | Own properties CRUD table with filters, soft delete with confirm dialog | `GET /properties` (own), `DELETE /properties/:id` |
| `/owner/properties/new` | **Multi-step wizard** (see section 6) | `POST /properties`, `POST /properties/:propertyId/rooms` |
| `/owner/properties/[id]` | Edit property, manage rooms, room availability dates | `PATCH /properties/:id`, `/rooms/*`, `PATCH /rooms/:id/availability` |
| `/owner/applications` | Applications for own properties, approve or reject, assign tenant | `GET /applications/for-property/:propertyId`, `PATCH /applications/:id/status`, `POST /rooms/:id/assign` |
| `/owner/viewings` | Confirm or cancel viewing requests | `GET /viewing-requests`, `PATCH /viewing-requests/:id/status` |
| `/owner/maintenance` | Update maintenance status (IN_PROGRESS, RESOLVED, REJECTED) | `GET /maintenance-requests`, `PATCH /maintenance-requests/:id/status` |
| `/owner/earnings` | Recharts: revenue by month, by payment type, payment table | `GET /payments/:id` and owner payment list |
| `/owner/profile` | Profile form | `GET/PATCH /users/me` |

### Admin Dashboard (`/admin`, ADMIN only)

| Route | Page | Data |
|---|---|---|
| `/admin` | Analytics: stat cards, Recharts (users by role, properties by city, payments by status) | `GET /admin/dashboard-stats` |
| `/admin/users` | User table, search, role filter, role change dialog | `GET /admin/users`, `PATCH /admin/users/:id/role` |
| `/admin/properties` | All properties with filters, moderation actions | `GET /admin/properties`, `DELETE /admin/properties/:id` |
| `/admin/reports` | Audit log viewer and platform reports | See "Gaps" below |

### Shared and Payment

| Route | Page |
|---|---|
| `not-found.tsx` | Custom 404 with links home and to the user's dashboard |
| `error.tsx` | Global error boundary with retry button |
| `/payment/success` | Confirmation, shows payment status fetched from `GET /payments/:id`, links to payment history. Do not trust the redirect alone, confirm status from the API |
| `/payment/cancel` | Cancelled message, retry payment button, back to dashboard |

---

## 6. Complex Flows

**Owner wizard (`/owner/properties/new`), MUST have 4 steps:**
1. Basics: title, description, property type, address, city, state, country, zip. 
2. Amenities and images: amenity picker, Cloudinary upload with preview and progress bar, mark primary image.
3. Rooms: add one or more rooms (type, capacity, rent, deposit, availability dates).
4. Review and submit.

Each step has its own Zod schema. Persist draft state across steps (form context or Zustand). Show a stepper, allow back navigation without data loss.

**Tenant apply flow:** property detail, choose room, apply dialog (move-in date, optional move-out, message), toast, redirect to `/dashboard/applications`. Owner approves, tenant sees "Pay now", pays via Stripe, lands on success page.

**Payment flow (MUST, real Stripe test mode):**
1. Tenant clicks Pay, frontend calls `POST /payments/initiate` (applicationId, paymentType RENT or DEPOSIT).
2. Backend returns the Stripe Checkout URL (confirm exact field in Postman collection). Frontend redirects to it.
3. Stripe returns to `/payment/success` or `/payment/cancel`.
4. Status is confirmed from the backend, which updates it through the webhook. Pending payments older than 24h are failed by the backend cron, so show PENDING clearly.
5. No manual status updates, no pay-later, no cash option anywhere in the UI.

---

## 7. Forms, Uploads, Hooks, Components

**Forms.** All forms use React Hook Form + Zod. Show inline, human-readable errors as the user types. Map backend `errors[]` back onto fields.

**Uploads.** Backend accepts multipart (Multer to Cloudinary). Use XHR or Axios `onUploadProgress` for progress. Show preview before upload, validate type and size client-side.

**Custom hooks:** `useAuth`, `useDebounce`, `useUrlState` (read and write search params), `usePagination`, `useConfirm`.

**Reusable components (no copy-paste UI):** `DataTable`, `StatCard`, `StatusBadge` (one map for Application, Payment, Viewing, Maintenance statuses), `SearchInput`, `FilterBar`, `Pagination`, `EmptyState`, `PropertyCard`, `RoomCard`, `ConfirmDialog`, `PageHeader`, `ImageUploader`, `Stepper`, `RoleGuard`.

**Suggested structure:**
```
src/
  app/
    (public)/           home, properties, about, contact, faq
    (auth)/             login, register
    dashboard/          tenant routes (layout has role guard + sidebar)
    owner/              owner routes
    admin/              admin routes
    payment/            success, cancel
    api/                auth route handlers, backend proxy
    error.tsx  not-found.tsx
  components/           ui (shadcn), shared, feature folders
  hooks/  lib/ (serverFetch, apiClient, auth, utils)  types/  schemas/
  middleware.ts
```

---

## 8. Shared Types (from the backend schema)

```ts
type Role = "TENANT" | "OWNER" | "ADMIN";
type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";
type PaymentType = "RENT" | "DEPOSIT" | "UTILITY";
type ViewingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type MaintenanceStatus = "SUBMITTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface ApiResponse<T> { success: boolean; message: string; data: T; errors?: { field?: string; message: string }[] }
interface Paginated<T> { items: T[]; pagination: { page: number; limit: number; total: number; pages: number } }
```
Define `User`, `Property`, `PropertyImage`, `Room`, `Application`, `Payment`, `ViewingRequest`, `MaintenanceRequest` from the Prisma models in the backend REQUIREMENTS.md. Verify against real responses, do not guess field shapes.

---

## 9. Gaps to Resolve Before Coding

The backend REQUIREMENTS.md and the frontend rules conflict in a few places. Check the Postman collection and fix the backend where needed, because mock data is not allowed.

| Gap | Impact | Action |
|---|---|---|
| Owner-scoped property list and owner payment list are not clearly defined | `/owner/properties`, `/owner/earnings` | Check if `GET /properties` filters by owner. If not, add `?ownerId=me` or `GET /owner/...` endpoints |
| Audit log endpoint appears in the summary but not in the admin endpoint table | `/admin/reports` | Confirm `GET /admin/audit-logs`. If missing, add it (model and logging already exist) |
| Property image upload endpoint not listed | Wizard step 2 | Find the upload route in the Postman collection, or add `POST /properties/:id/images` |
| `POST /payments/initiate` response shape (checkout URL field) | Payment flow | Confirm from Postman. Confirm Stripe success and cancel URLs point to `/payment/success` and `/payment/cancel` on the frontend |
| Refresh token delivery (body vs cookie) | Auth proxy | Confirm from login response. The example shows tokens in the body |
| BDT as Stripe test currency | Payment flow | Verify checkout works in test mode with the default `BDT`. If not, switch the backend currency |
| Admin stats response shape | Admin charts | Confirm fields before designing charts |
| `Notification`, `UtilityBill`, `UtilitySplit` models have no endpoints | No UI | Out of scope. Roommate matching and utility splitting are in the repo description but have no API. Do not fake them. Add backend endpoints first if you want them |
| CORS | Browser calls | Backend `FRONTEND_URL` must equal the deployed frontend origin. The proxy pattern avoids most issues, but keep it correct |

---

## 10. Environment Variables

```
NEXT_PUBLIC_APP_URL=
BACKEND_URL=                    # server-only, e.g. https://<backend>.vercel.app/api
JWT_ACCESS_SECRET=              # same as backend, used by middleware to verify (or use decode + backend verification)
DEMO_ADMIN_EMAIL= DEMO_ADMIN_PASSWORD=
DEMO_OWNER_EMAIL= DEMO_OWNER_PASSWORD=
DEMO_TENANT_EMAIL= DEMO_TENANT_PASSWORD=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```
Never expose secrets with `NEXT_PUBLIC_`. Stripe secret stays on the backend only.

---

## 11. Build Order

1. Scaffold: Next.js, Tailwind, shadcn, theme tokens, layout, types, `serverFetch`, proxy route.
2. Auth: login, register, cookies, middleware, demo login buttons, role redirects.
3. Public: home, listing (URL filters), detail, about, contact, FAQ, SEO metadata.
4. Tenant: apply flow, applications, viewings, profile.
5. Owner: wizard with uploads, property and room management, applications, viewings.
6. Payments: initiate, success, cancel, payment history. Test the full flow end to end early, it is the riskiest item.
7. Maintenance and owner earnings.
8. Admin: overview charts, users, properties, reports.
9. Polish: skeletons for every route, empty states, error boundaries, mobile pass, a11y pass.
10. Deploy, seed demo data, click every demo login as an evaluator would.

---

## 12. Definition of Done

- [ ] 18+ real pages deployed, none duplicated or dummy
- [ ] Three demo logins work on the live site and land on populated dashboards
- [ ] Wrong-role route access is redirected by middleware, and UI hides forbidden actions
- [ ] Stripe test payment works from initiate to success and to cancel, status confirmed from the API
- [ ] Every filter, sort, search, and page is in the URL and survives refresh and sharing
- [ ] Every data route has `loading.tsx`, every list has an empty state, every failure shows a toast
- [ ] Zero `any`, zero Lorem ipsum, zero placeholder images, zero mock data
- [ ] Lighthouse mobile check on home and listing, no layout break at 375px
- [ ] README with live URL, demo credentials, setup steps, and route map
