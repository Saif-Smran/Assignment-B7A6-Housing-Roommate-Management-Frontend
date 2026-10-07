# UrbanMatch

> **Live Production URL**: [https://b7a7.vercel.app/](https://b7a7.vercel.app/)  
> **Backend API**: [https://b7-a6.vercel.app/api](https://b7-a6.vercel.app/api)

UrbanMatch is a Next.js housing and roommate management platform for tenants, property owners, and administrators. It connects verified property listings with room applications, viewing requests, maintenance tracking, and Stripe Checkout payments.

## Demo Evaluation Credentials

You can use the **One-Click Demo Login** buttons directly on the `/login` page or use the credentials below:

| Role | Interface | Demo Email | Demo Password | Default Dashboard |
|---|---|---|---|---|
| **Admin** | Platform Moderator | `testeradmin@example.com` | `testeradmin@1234` | `/dashboard/admin` |
| **Provider / Owner** | Property Management | `testerowner@example.com` | `testerowner@1234` | `/dashboard/owner` |
| **User / Tenant** | Room & Flatmate Finder | `testertenant@example.com` | `testertenant@1234` | `/dashboard/tenant` |

## Features

- Public property and room browsing with filters, pagination, galleries, maps, and availability indicators.
- Tenant dashboard for applications, viewing requests, maintenance tickets, payments, and profile management.
- Owner dashboard for properties, rooms, applications, tenant assignment, viewings, maintenance, earnings, and profile management.
- Admin dashboard for platform statistics, users, and property moderation.
- Server-side Next.js `middleware.ts` enforcing authentication and 3-role route boundaries.
- TanStack Query (`@tanstack/react-query`) for cached, reactive server state management.
- React Hook Form + Zod for type-safe form validation matching backend schemas.
- Stripe Checkout integration for rent, deposits, and utility payments with dedicated success and cancel receipt pages.
- App Router architecture with dedicated `layout.tsx`, `loading.tsx` skeletons, and `error.tsx` error boundaries.
- Responsive UI built with Tailwind CSS, shadcn-style components, Lucide icons, and React Toastify notifications.
- Dynamic route metadata and a branded UrbanMatch favicon.

## Tech Stack

- Next.js 16 App Router (Server Components + Client Components)
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query
- React Hook Form + Zod
- Stripe Checkout
- Leaflet and React Leaflet
- Bun

## Project Structure

```text
.
├── public/                         # Static assets
├── scripts/                        # Project graph/codebase generation
├── src/
│   ├── api/                        # Typed backend API clients
│   ├── app/                        # Next.js App Router pages and layouts
│   │   ├── (auth)/                 # Login and registration
│   │   ├── (public)/               # Home, properties, about, and FAQ
│   │   ├── dashboard/              # Role-aware dashboard shell
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── owner/              # Owner pages and property management
│   │   │   └── tenant/             # Tenant pages and workflows
│   │   ├── api/                    # Next.js route handlers
│   │   ├── icon.svg                # UrbanMatch favicon
│   │   ├── layout.tsx              # Root metadata, fonts, and providers
│   │   └── globals.css             # Global styles and design tokens
│   ├── components/                 # Shared, dashboard, room, owner, and tenant UI
│   ├── hooks/                      # Reusable React hooks
│   ├── interfaces/                 # Shared TypeScript domain types
│   ├── lib/                        # Authentication and utility helpers
│   ├── providers/                  # Query, auth, and application providers
│   ├── routes/                     # Private and role route guards
│   └── validation/                 # Zod validation schemas
├── graphify-out/                   # Generated code graph and architecture reports
├── requirements.md                 # Frontend requirements and route contract
├── next.config.ts                 # Next.js configuration
├── package.json                    # Scripts and dependencies
└── tsconfig.json                   # TypeScript configuration
```

## Requirements

- Bun 1.4 or newer
- A running or deployed B7A6 backend API
- Backend authentication and demo accounts configured for the selected environment

## Getting Started

Install dependencies:

```bash
bun install
```

Create a `.env` file in the project root. Do not commit secrets.

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

TESTER_ADMIN_EMAIL=testeradmin@example.com
TESTER_ADMIN_PASSWORD=testeradmin@1234
TESTER_OWNER_EMAIL=testerowner@example.com
TESTER_OWNER_PASSWORD=testerowner@1234
TESTER_TENANT_EMAIL=testertenant@example.com
TESTER_TENANT_PASSWORD=testertenant@1234

NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, stop the existing Next process before starting another development server.

## Commands

```bash
bun run dev       # Start Next.js development mode
bun run build     # Create a production build
bun run start     # Start the production build
bun run lint      # Run Biome checks
bun run format    # Format source files with Biome
bun run code      # Refresh the project graph and codebase snapshot
```

## Routes

### Public

- `/` - Home page with featured listings and search entry points.
- `/properties` - Filterable property and room listing.
- `/properties/details?id=<propertyId>` - Property details, rooms, availability, viewing, and application actions.
- `/about` - Platform mission and team.
- `/faq` - Tenant and owner FAQs.
- `/login` - Credential login and demo login actions.
- `/register` - Tenant and owner registration.

### Tenant Dashboard

- `/dashboard/tenant` - Applications, upcoming viewings, payment totals, and recent activity.
- `/dashboard/tenant/applications` - Application list, status filters, and cancellation.
- `/dashboard/tenant/viewings` - Viewing request list and cancellation.
- `/dashboard/tenant/maintenance` - Submit and track maintenance requests for approved rooms.
- `/dashboard/tenant/payments` - Payment history and rent/deposit Stripe Checkout actions.
- `/dashboard/tenant/profile` - Tenant profile update form.

### Owner Dashboard

- `/dashboard/owner` - Property, room, application, activity, and earnings overview.
- `/dashboard/owner/properties` - Owner property list, search, and soft deletion.
- `/dashboard/owner/properties/new` - Four-step property and room creation flow.
- `/dashboard/owner/properties/<id>` - Property editing and room availability management.
- `/dashboard/owner/applications` - Approve/reject applications and assign tenants to rooms.
- `/dashboard/owner/viewings` - Confirm or cancel viewing requests.
- `/dashboard/owner/maintenance` - Update maintenance status and assign technicians.
- `/dashboard/owner/earnings` - Owner earnings loaded from `/api/payments/earnings`.
- `/dashboard/owner/profile` - Owner profile update form.

### Admin Dashboard

- `/dashboard/admin` - Platform statistics.
- `/dashboard/admin/users` - User list and role management.
- `/dashboard/admin/properties` - Property moderation.

## Backend API Integration

The frontend client follows the B7A6 backend/Postman API contracts. Requests are made through `src/api/client.ts`, which attaches the stored bearer token and normalizes list responses where required.

Important endpoint groups include:

- Authentication: `/auth/*`
- Profile: `/users/me`
- Properties and rooms: `/properties/*`, `/rooms/*`
- Applications: `/applications/*`
- Viewings: `/viewing-requests/*`
- Maintenance: `/rooms/:roomId/maintenance`, `/maintenance-requests/*`
- Payments: `/payments/initiate`, `/payments/my`, `/payments/earnings`
- Admin: `/admin/*`

The backend is the source of truth for authorization, payment status, room assignment, and room availability. Stripe completion is confirmed by the backend webhook rather than by trusting the browser redirect alone.

## Deployment

The application is deployed to Vercel. Configure the production environment variables in the Vercel project before deploying:

```bash
vercel deploy
vercel deploy --prod
```

Required production configuration includes:

- `NEXT_PUBLIC_API_BASE_URL` pointing to the deployed backend `/api` base URL.
- `NEXT_PUBLIC_APP_URL` set to the deployed frontend origin.
- Demo account credentials used by the login shortcuts.
- Google and Cloudinary variables when those integrations are enabled.

The backend must allow the deployed frontend origin through its `FRONTEND_URL` and CORS configuration. Stripe success and cancel URLs are derived from the current frontend origin.

## Metadata and Icon

The root layout defines the UrbanMatch title template, description, Open Graph defaults, and `/icon.svg` favicon. Public pages provide page-specific metadata, property details use dynamic metadata from the property API, and dashboard route groups provide tenant, owner, and admin metadata.

## Validation

Before opening a pull request or deploying:

```bash
bun run lint
bun run build
bun run code
```

The project is configured for Vercel deployment. Set the production API URL, application URL, demo credentials, and any enabled OAuth or media variables in the Vercel project settings.
