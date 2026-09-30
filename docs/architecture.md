# HotelHub — Master System Architecture Specification

> **Phase 2 Architectural Baseline**  
> **Status**: Approved & Active  
> **Scope**: Master Architecture for the Complete 45-Phase Hotel Management SaaS  
> **Visual Reference**: Master Dark Luxury Design System (Deep Obsidian/Navy `#070A16`, Electric Blue `#2563EB`, Indigo `#4F46E5`, Cyan `#06B6D4`, Glass Surfaces — **Zero Gold**)

---

## 1. Executive Summary & Architecture Overview

**HotelHub** is an enterprise-grade, multi-tenant Hotel Management Software-as-a-Service (SaaS) platform engineered for independent hoteliers, boutique resort collections, and multi-property hospitality conglomerates.

The platform provides a unified hospitality operating system spanning:
- Front-desk property management system (PMS) and real-time interactive room matrix
- Contactless Indian Bharat QR / UPI payment reconciliation and instant checkout
- Dual-slab Indian GST invoicing engine (SAC 9963 / 9964) with automated tax breakdown
- Multi-branch property governance with cryptographic and query-level tenant isolation
- 14 specialized role-based staff control panels (General Manager down to Room Attendants)
- Housekeeping, restaurant POS/KOT, inventory, engineering maintenance, and automated night audits
- Platform Super Admin master control plane for tenant subscriptions and module licensing

The architecture is designed from the ground up for high reliability, zero cross-tenant bleeding, sub-second query performance, and modular extensibility across all 45 development phases.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             HOTELHUB PLATFORM TOPOLOGY                           │
└──────────────────────────────────────────────────────────────────────────────────┘

   [ Public Web & Guests ]      [ Hotel Staff & Operators ]    [ Platform Operators ]
              │                              │                           │
              ▼                              ▼                           ▼
      Landing & Onboarding            14 Staff Role Panels          Super Admin Panel
       (/, /onboarding)             (/dashboard, /manager)               (/admin)
              │                              │                           │
              └──────────────────────────────┼───────────────────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │       Next.js App Router      │
                             │  (Server & Client Components) │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │     Application & Routing     │
                             │    /api/[module]/* Handlers   │
                             │   Tenant Context Resolution   │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │    Domain & Service Layer     │
                             │    Business Rule Validation   │
                             │   Hotel / Branch / Booking    │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │     Data Access Layer         │
                             │     Repositories & Models     │
                             │    Tenant Scoped Queries      │
                             └───────┬───────────────┬───────┘
                                     │               │
                                     ▼               ▼
                        ┌─────────────────┐    ┌─────────────────┐
                        │  MongoDB Atlas  │    │ Storage Engine  │
                        │ Multi-Tenant DB │    │ Cloudinary/Disk │
                        └─────────────────┘    └─────────────────┘
```

---

## 2. Architectural Layers & Separation of Concerns

The codebase enforces strict unidirectional dependency flow across 5 well-defined layers:

```
PRESENTATION
    ↓
ROUTING / APPLICATION
    ↓
DOMAIN / BUSINESS LOGIC
    ↓
DATA ACCESS
    ↓
DATABASE / INFRASTRUCTURE
```

### Layer Responsibilities

| Layer | Primary Location | Responsibilities | Forbidden Concerns |
|---|---|---|---|
| **1. Presentation** | `app/`, `components/` | Visual rendering, user interactions, form UX, client state, accessibility, animations (`tw-animate-css`). | No direct database queries, no secret key access, no raw storage operations. |
| **2. Application / Routing** | `app/api/`, server actions | HTTP routing, request parsing, session & tenant context resolution, input validation, HTTP status dispatch. | No complex business calculations, no direct UI rendering logic. |
| **3. Domain / Services** | `services/`, `lib/domain/` | Core hospitality business rules, transactional state machines, rate calculation, folio balancing, entitlement checks. | No HTTP request/response objects (`NextRequest`, `NextResponse`), no direct UI components. |
| **4. Data Access** | `models/`, `lib/db/` | Mongoose schema definitions, field validation, compound indexes, atomic mutations, query building. | No presentation markup, no session cookie reading. |
| **5. Infrastructure** | `lib/storage/`, `lib/db/mongoose.ts` | Cloudinary / local storage providers, MongoDB connection pooling, external API gateways (UPI, SMS, Gemini). | No hotel business logic; strictly generic adapter capabilities. |

---

## 3. Multi-Tenant Architecture & Data Segregation

HotelHub implements a strict hierarchical tenancy model:

```
Platform Super Admin (Control Plane)
  └── Hotel Tenant (e.g. Grand Horizon Palace)
        ├── Hotel-Level Settings & Branding (Logo, GSTIN, Default Currency)
        ├── Active Subscription & Module Entitlements (Starter / Pro / Enterprise)
        ├── User Directory & Role Assignments (GMs, Receptionists, Accountants)
        └── Branches / Properties
              ├── Candolim Beachfront Branch
              │     ├── Floors & Room Matrix (101, 102, 103...)
              │     ├── Live Reservations & Bookings
              │     ├── Guests & Historical Folios
              │     ├── Housekeeping Status & Turnaround Queue
              │     └── POS Outlets & Restaurant Tables
              └── BKC Business Hub Branch
                    ├── Floors & Rooms
                    └── Branch Operations
```

### Tenant Isolation Enforcement Rules:
1. **Mandatory Foreign Key**: Every resource belonging to a hotel (rooms, bookings, folios, users, inventory, POS orders) **MUST** include a non-nullable `hotelId: Types.ObjectId` referencing the `Hotel` collection.
2. **Compound Indexing**: Every collection index begins with the tenant identifier:
   - `{ hotelId: 1, _id: 1 }`
   - `{ hotelId: 1, branchId: 1, status: 1 }`
   - `{ hotelId: 1, email: 1 }` (unique within the hotel tenant)
3. **Query Scoping**: Services and data-access functions must never execute unbounded queries. Every read and mutation requires an explicit `hotelId` filter derived from the validated `TenantContext`.
4. **Cross-Tenant Guardrails**: Attempting to query an entity with a mismatched `hotelId` immediately triggers an `ApiError.tenantAccessDenied("Cross-tenant access prohibited")` resulting in HTTP 403.

---

## 4. Access Control Architecture (RBAC & Entitlements)

Authorization is evaluated across **5 conceptual layers** before any sensitive action is executed:

```
1. Platform Permissions   → Is the user a Platform Super Admin?
       ↓
2. Hotel Permissions      → Does the user belong to this Hotel tenant?
       ↓
3. Branch Permissions     → Is the user assigned to this specific Branch?
       ↓
4. Module Permissions     → Is this module enabled in the Hotel's active subscription?
       ↓
5. Action Permissions     → Does the user's Role permit this specific CRUD action?
```

### The 14 Hospitality Roles Matrix

| Role Key | Role Label | Scope | Primary Route | Allowed Modules |
|---|---|---|---|---|
| `platform_super_admin` | Platform Super Admin | Global | `/admin` | `super_admin`, `hotel_management`, `module_access`, `licensing`, `system_monitoring` |
| `hotel_super_admin` | Hotel Owner / MD | Hotel-wide | `/dashboard` | All subscribed hotel modules |
| `manager` | General Manager | Multi-Branch | `/manager` | `dashboard`, `rooms`, `bookings`, `guests`, `staff`, `housekeeping`, `reports` |
| `receptionist` | Front Desk Receptionist | Branch | `/dashboard` | `dashboard`, `rooms`, `bookings`, `guests`, `billing` |
| `room_management` | Room Operations Lead | Branch | `/dashboard` | `rooms`, `housekeeping`, `maintenance` |
| `booking_management` | Central Reservations Agent | Hotel-wide | `/dashboard` | `bookings`, `guests`, `rates` |
| `guest_management` | Guest Relations Officer | Branch | `/dashboard` | `guests`, `bookings`, `concierge` |
| `housekeeping` | Housekeeping Supervisor | Branch | `/dashboard` | `rooms`, `housekeeping`, `maintenance` |
| `restaurant` | F&B / Restaurant Captain | Outlet | `/dashboard` | `restaurant`, `pos`, `inventory` |
| `staff_management` | HR & Roster Manager | Hotel-wide | `/dashboard` | `staff`, `attendance`, `payroll` |
| `inventory` | Stores & Purchase Manager | Hotel-wide | `/dashboard` | `inventory`, `suppliers`, `purchase_orders` |
| `finance` | Chief Accountant | Hotel-wide | `/dashboard` | `finance`, `billing`, `invoices`, `taxes_gst`, `night_audit` |
| `maintenance` | Chief Engineer | Branch | `/dashboard` | `maintenance`, `work_orders`, `asset_management` |
| `security` | Chief Security Officer | Branch | `/security` | `security`, `visitor_logs`, `keycards`, `incident_reports` |

---

## 5. Comprehensive Module Boundaries

The SaaS domain is partitioned into 5 functional clusters encompassing all 45 roadmap phases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HOTELHUB MODULAR DOMAIN BOUNDARIES                    │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 1. HOTEL CORE        │ 2. OPERATIONS        │ 3. FINANCE & COMPLIANCE       │
│  - Hotel Profile     │  - Reception Desk    │  - General Ledger             │
│  - Branch Hierarchy  │  - Manager Suite     │  - Guest Folio Engine         │
│  - Room Inventory    │  - Staff Rostering   │  - GST Invoicing (SAC 9963)   │
│  - Dynamic Pricing   │  - Housekeeping App  │  - UPI / Bharat QR Gateway    │
│  - Booking Engine    │  - Restaurant / POS  │  - Night Audit Automation     │
│  - Guest Directory   │  - Kitchen KOT       │  - Financial Reporting        │
│  - Fast Check-in/out │  - Inventory Control │                               │
│  - Guest Portal      │  - Vendor Purchasing │                               │
│                      │  - Maintenance CMMS  │                               │
│                      │  - Security & Access │                               │
├──────────────────────┴──────────────────────┴───────────────────────────────┤
│ 4. PLATFORM GOVERNANCE                     │ 5. AI & DIGITAL CHANNELS       │
│  - Super Admin Control Plane                │  - Conversational AI Concierge │
│  - Hotel Tenant Provisioning                │  - Guest Website Builder       │
│  - Module Licensing & Plans                 │  - Direct Booking Engine Sync  │
│  - System Health & Telemetry                │  - Channel Manager Gateway     │
└─────────────────────────────────────────────┴───────────────────────────────┘
```

Each module encapsulates:
- **Schema Model**: Distinct Mongoose model with strictly typed interfaces in `models/`
- **Domain Service**: Business logic implementation in `services/[module]/`
- **API Endpoints**: RESTful routes in `app/api/[module]/`
- **UI Components**: Presentation widgets in `components/[module]/`

---

## 6. Service Layer Architecture

Services are pure business coordinators located under `services/`.

### Service Rules:
1. **Zero UI Coupling**: Services must never import React components, JSX, hooks, or client state.
2. **Framework Agnostic**: Business methods accept plain JavaScript/TypeScript parameters (e.g. `{ hotelId, data }`) and return plain typed objects. They do not depend on Next.js `NextRequest` or `NextResponse`.
3. **Atomic Operations**: Financial folios, check-ins, and multi-document mutations utilize MongoDB transactions via `withTransaction()` in `lib/db/mongoose.ts`.
4. **Idempotency**: Critical operations (payment recording, folio closing, invoice number generation) must be safely retryable without duplicate debit or inventory corruption.

---

## 7. API Architecture & Routing Conventions

All backend API routes follow the RESTful path pattern:
```
/api/[module]/[resource]
```

### Standard Route Structure:
- `/api/hotel` — Tenant profile and branding management
- `/api/branch` — Multi-branch hierarchy CRUD
- `/api/rooms` — Room categories, inventory, and rack status
- `/api/bookings` — Reservation creation, modification, and check-in/out
- `/api/guests` — Guest profiles, Aadhaar/Passport verification, stay history
- `/api/finance` — Folios, GST invoices, and payment receipts
- `/api/modules` — Catalog listing and tenant module assignments
- `/api/internal/*` — Platform-level Super Admin administrative endpoints

### The 7-Step API Handler Lifecycle:

```
[ Incoming HTTP Request ]
          │
          ▼
   1. Input Parsing & Format Sanitization
          │
          ▼
   2. Tenant & Branch Context Resolution
          │
          ▼
   3. Session Authentication Check
          │
          ▼
   4. RBAC & Module Entitlement Authorization
          │
          ▼
   5. Delegate to Domain Service Layer
          │
          ▼
   6. Construct Standard JSON Envelope: { success: true, data: T, meta?: ... }
          │
          ▼
   7. Catch & Normalize Errors via handleRouteError()
```

---

## 8. Unified Error Architecture & Taxonomy

HotelHub enforces a standardized error hierarchy preventing internal database driver details or stack traces from reaching clients:

```ts
export const ErrorCode = {
  INVALID_INPUT: "INVALID_INPUT",                   // 400 Bad Request
  UNAUTHENTICATED: "UNAUTHENTICATED",               // 401 Unauthorized
  FORBIDDEN: "FORBIDDEN",                           // 403 Forbidden
  TENANT_ACCESS_ERROR: "TENANT_ACCESS_ERROR",       // 403 Cross-Tenant Violation
  NOT_FOUND: "NOT_FOUND",                           // 404 Not Found
  CONFLICT: "CONFLICT",                             // 409 Duplicate / Race Condition
  DATABASE_ERROR: "DATABASE_ERROR",                 // 500 Managed DB Failure
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR", // 502 Upstream Service Failure
  INTERNAL_ERROR: "INTERNAL_ERROR",                 // 500 Uncaught Exception
} as const;
```

### Standard Error Response Envelope:
```json
{
  "success": false,
  "error": {
    "code": "TENANT_ACCESS_ERROR",
    "message": "Cross-tenant access prohibited",
    "details": {
      "hotelId": ["Access denied to requested tenant resource"]
    }
  }
}
```

---

## 9. Data Access Architecture

### Query & Mutation Hierarchy:
```
Route Handler / Server Action
       ↓
Domain Service Layer
       ↓
Repository / Data Access Function
       ↓
Mongoose Model (`models/*.ts`)
       ↓
MongoDB Database
```

### Guidelines:
- **Direct Queries vs Repositories**: Simple CRUD may query the Mongoose model directly within a service. Complex multi-stage aggregates (RevPAR calculation, occupancy timelines, folio ledgers) are isolated into dedicated repository helpers.
- **Strict Query Projections**: Projections exclude sensitive fields (e.g. `passwordHash`, `internalNotes`) by default.
- **Lean Queries**: Read-heavy dashboard queries utilize `.lean()` for high performance and low memory allocation.

---

## 10. Storage Architecture (Provider Agnostic)

The file and media storage subsystem is completely decoupled from business logic via the `StorageProvider` interface in `lib/storage/provider.ts`:

```
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE ENGINE ROUTER                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    [ Cloudinary Provider ]         [ Local Storage Provider ]
     - Production CDN                - Development Fallback
     - Automatic WebP/AVIF           - Automated Test Suites
     - Scalable Media Delivery       - Zero External Setup
```

### Storage Capabilities:
- `uploadFile(buffer, path, options)`: Ingests documents, guest ID scans, and hotel logos.
- `deleteFile(path)`: Purges obsolete assets and invalid uploads.
- `getSignedUrl(path, ttl)`: Generates time-limited secure URLs for sensitive documents (Aadhaar cards, GST tax certificates).
- `getPublicUrl(path)`: Returns high-speed CDN URLs for public hotel logos and room photos.

---

## 11. Routing Architecture & Route Groups

Application routes are organized into four distinct logical zones:

```
/ (Root)
│
├── 1. PUBLIC ZONE (Unauthenticated & Marketing)
│     ├── /                 (Approved Dark Luxury Landing Page)
│     ├── /onboarding       (7-Step Hotel Tenant Onboarding Flow)
│     └── /design-system    (Living Component Showcase & Tokens)
│
├── 2. DEMO ZONE (Development & Evaluation)
│     └── /login            (Role Selector & Instant One-Click Demo Access)
│
├── 3. HOTEL APPLICATION ZONE (Multi-Tenant Hotel Operations)
│     ├── /dashboard        (Front Desk, Live Room Rack, KPI Overview)
│     ├── /manager          (General Manager Operations Suite)
│     ├── /security         (Security, Keycards, Incident Logs)
│     └── /settings         (Property Configuration, GST, UPI VPAs)
│
└── 4. PLATFORM CONTROL PLANE (Super Admin SaaS Governance)
      └── /admin            (Tenant Registry, Licensing, Global Monitoring)
```

---

## 12. Configuration Architecture

All runtime configurations, navigation trees, and static presets are centralized in `config/`:

- `config/navigation.ts`: Sidebar hierarchies, role-based visibility rules, and module groupings.
- `config/demo.ts`: Fixture definitions for all 14 roles, default user accounts, and mock hotel tenants.
- `config/onboarding.ts`: Multi-step onboarding validation schemas, initial state, and module catalog.
- `lib/design-system/tokens.ts`: Typography, radius, border, surface, and elevation tokens.

---

## 13. Environment Architecture

Environment variables are organized into clean logical categories in `.env.example`:

1. **Application Core**: `NODE_ENV`, `PORT`, `NEXT_PUBLIC_APP_URL`
2. **Database**: `MONGODB_URI`, `MONGODB_DB_NAME`
3. **Storage**: `LOCAL_STORAGE_DIR`, `STORAGE_SIGNING_SECRET`, `CLOUDINARY_*`
4. **Authentication**: `AUTH_SECRET`, `AUTH_SESSION_COOKIE_NAME`
5. **Email & Messaging**: `SMTP_*`, `EMAIL_FROM_ADDRESS`, `SMS_GATEWAY_API_KEY`
6. **Payments & Invoicing**: `PAYMENT_GATEWAY_*`, `UPI_MERCHANT_*`
7. **AI & Gemini**: `GEMINI_API_KEY` (Server-only secret; never client-facing)
8. **External Integrations**: `OTA_WEBHOOK_SECRET`

---

## 14. Security Architecture

1. **Cryptographic Tenant Segregation**: Every resource is strictly scoped by `hotelId`. Cross-tenant mutations are blocked at both the service validation and database query levels.
2. **Defense-in-Depth Authorization**: Route protection is enforced at 3 layers:
   - Next.js Navigation guards (`DemoRouteGuard` and future auth middleware)
   - API Handler validation checks
   - Domain Service business rule evaluations
3. **Regex & Input Sanitization**: Form inputs (GSTIN, PAN, Phone, Email, Currency codes) are validated using strict precompiled regular expressions in `lib/db/validate.ts`.
4. **Audit Logging**: Sensitive operations (rate adjustments, cash refunds, room status overrides) create append-only audit records in the `AuditLog` collection (`models/AuditLog.ts`).

---

## 15. Future Extensibility Protocol (8-Step Module Addition)

To add any future module from the 45-phase roadmap without refactoring existing code:

1. **Domain Model**: Define the Mongoose schema with `hotelId` and compound indexes in `models/[Entity].ts`.
2. **Data Access Types**: Define TypeScript interfaces in `types/[module].ts`.
3. **Domain Service**: Implement transactional business operations in `services/[module]/[entity]Service.ts`.
4. **API Route Handlers**: Create REST endpoints in `app/api/[module]/route.ts` with standard validation and error wrappers.
5. **UI Components**: Build responsive hospitality cards and tables in `components/[module]/`.
6. **Navigation Wiring**: Register the route and required module key in `config/navigation.ts`.
7. **RBAC Mapping**: Map allowed roles and permissions in `config/demo.ts`.
8. **Automated Tests**: Write verification scripts in `scripts/phase[X]-test.ts`.

---

## 16. Master 45-Phase Roadmap Alignment

```
FOUNDATION (Phases 1–11)
  1. OpenCode + AI Setup [Completed]
  2. Project Architecture [Current - Completed]
  3. Folder Structure
  4. Design System
  5. Responsive UI Foundation
  6. MongoDB Atlas + Mongoose
  7. Cloud Image/File Storage
  8. Hotel-focused Landing Page [Preserved]
  9. Get Started / Hotel Onboarding UI [Preserved]
  10. Demo Login [Preserved]
  11. Real Authentication

INTERNAL CONTROL (Phases 12–18)
  12. Internal Super Admin
  13. Hotel Management
  14. Branch Management
  15. Module Access Management
  16. Customer/User Management
  17. License/Service Management
  18. Support & System Monitoring

HOTEL CORE (Phases 19–26)
  19. Hotel Profile & Branding
  20. Room & Property Management
  21. Advanced Pricing
  22. Hotel Services
  23. Booking Engine
  24. Guest Management
  25. Check-in / Check-out
  26. Guest Portal

OPERATIONS (Phases 27–36)
  27. Receptionist Panel
  28. Manager Panel
  29. Staff Management
  30. Housekeeping
  31. Restaurant Setup
  32. Restaurant/POS + KOT
  33. Inventory
  34. Suppliers & Purchasing
  35. Maintenance
  36. Security

FINANCE (Phases 37–40)
  37. Accountant & Finance
  38. Billing/Folio/Invoices
  39. Payments + UPI/QR
  40. Night Audit & Financial Reports

AI + DIGITAL (Phases 41–43)
  41. AI Hotel Chatbot / Assistant
  42. Customer Hotel Website Builder
  43. Hotel Website ↔ Management System Integration

PRODUCTION RELEASE (Phases 44–45)
  44. Notifications, Reports, Import/Export, Audit, Security, Backup
  45. Complete QA → Performance → Mobile Testing → Deployment → Final Release
```

---

## 17. Visual Identity & No-Gold Governance

All future phases must strictly adhere to the approved visual language:
- **Surface**: Obsidian `#070A16`, deep navy `#090D1C`, and semi-transparent glass cards (`bg-slate-900/60`, `backdrop-blur-xl`, `border-white/10`).
- **Accents**: Electric blue (`#2563EB`, `#3B82F6`), indigo (`#4F46E5`, `#6366F1`), and cyan (`#06B6D4`, `#22D3EE`).
- **Strict Ban on Gold**: Zero gold gradients (`#FFD700`, `#D4AF37`, `#F59E0B` as a primary theme), zero gold buttons, zero gold borders, zero golden typography. The interface must always feel like an ultra-modern, high-performance technology platform.
