# Phase 1 — Project Foundation & Architecture Blueprint

## 1. Executive Summary

HotelHub is an enterprise-grade, multi-tenant Hotel Management Software-as-a-Service (SaaS) platform engineered for modern independent hoteliers, boutique resorts, and multi-branch hospitality chains.

The platform architecture provides a unified operating system encompassing:
- Front-desk property management system (PMS) and real-time room racks
- Dynamic Indian Bharat QR / UPI payment reconciliation
- Dual-slab Indian GST invoicing (SAC 9963 / 9964)
- Multi-branch group governance with tenant isolation
- 14 specialized role-based staff control panels
- Housekeeping, restaurant POS/KOT, inventory, and automated night audits

---

## 2. Approved Master Visual Language

The approved HotelHub dark luxury design system established in the landing page serves as the master visual baseline for all 45 phases:

- **Color Palette**:
  - Backgrounds: Deep navy `#070A16` and obsidian `#090D1C`
  - Surfaces: Dark glass cards (`#0C1022`, `#0E1428`) with `border-white/10` and `backdrop-blur-xl`
  - Primary Accents: Electric blue (`#2563EB`, `#3B82F6`) and indigo (`#4F46E5`, `#6366F1`)
  - Supporting Accents: Cyan (`#06B6D4`, `#22D3EE`) and violet (`#8B5CF6`)
  - Status Accents: Emerald (`#10B981` / Available), Blue (`#3B82F6` / Occupied), Amber (`#F59E0B` / Cleaning), Purple (`#A855F7` / Reserved)
  - **Strict No-Gold Policy**: Zero golden gradients, gold buttons, gold borders, or traditional gold hotel aesthetics. Modern, high-tech hospitality SaaS feel throughout.

- **Typography & Structure**:
  - Font: Geist Sans via Next.js Font Optimization
  - Proportions: Generous whitespace, rounded cards (`rounded-2xl`, `rounded-3xl`), subtle glows (`blur-3xl`, `shadow-blue-950/60`), and responsive grid layouts.

---

## 3. Technology Stack & Toolchain Verification

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | `16.3.6` | Server & client rendering, streaming, API proxy routes |
| **Language** | TypeScript | `^5.0` | Strict static typing (`target: ES2017`, `strict: true`) |
| **UI Library** | React | `19.2.8` | Component rendering with React 19 compiler primitives |
| **Styling** | Tailwind CSS v4 + PostCSS | `^4.0` | High-performance atomic utility styling with `@theme inline` |
| **Animation** | tw-animate-css | `^1.4.0` | Fluid micro-interactions and transitions |
| **Icons** | Lucide React | `^1.48.0` | High-fidelity vector iconography |
| **Database** | MongoDB + Mongoose | `^8.8.0` | Multi-tenant schema, tenant-keyed queries, indexing |
| **Storage** | Cloudinary / Local Provider | `^2.11.0` | Media assets, hotel logos, room photo galleries, signed storage |
| **Notifications** | Sonner | `^2.0.8` | Real-time toast feedback for asynchronous user actions |
| **Utilities** | date-fns, clsx, tailwind-merge | `^4.4.0` | Date manipulation and dynamic class management |

---

## 4. Multi-Tenant Architecture Foundation

The system is designed to support the complete multi-tenant hierarchy:

```
Platform Super Admin (Control Plane)
  └── Hotel Tenants (e.g. Grand Horizon Resorts)
        ├── Subscription & Entitlement Plan (Starter / Pro / Enterprise)
        ├── Branches (Candolim Beachfront, Mumbai BKC, Jaipur Palace)
        │     ├── Floors & Physical Rooms (101, 102, 103...)
        │     └── Department Amenities (Pool, Spa, Conference)
        ├── Staff User Accounts & Roles (14 RBAC Roles)
        ├── Guest Profiles & Corporate Accounts
        └── Unified Finance & Tax Engine (GSTIN, Dynamic UPI QR, Folios)
```

### Key Architectural Tenets:
1. **Tenant Isolation**: Every database collection (except global catalog schemas) is keyed by `hotelId` and indexed with composite keys (`hotelId + branchId + createdAt`).
2. **Entitlement-Driven UI**: Navbars and sidebars dynamically evaluate active subscription modules so hotels only access features enabled in their plan.
3. **Role-Based Access Control (RBAC)**: 14 distinct roles (from General Manager to Room Attendant) with strict route guarding (`DemoRouteGuard` and future session guards).
4. **Preservation**: Existing routes (`/`, `/login`, `/onboarding`, `/dashboard`, `/admin`, `/manager`, `/security`, `/settings`) remain completely intact.

---

## 5. The 45-Phase Master Roadmap

1. **OpenCode + AI Setup** *(Phase 1 — Current)*
2. **Project Architecture**
3. **Folder Structure**
4. **Design System**
5. **Responsive UI Foundation**
6. **MongoDB Atlas + Mongoose**
7. **Cloud Image/File Storage**
8. **Hotel-focused Landing Page** *(Preserved)*
9. **Get Started / Hotel Onboarding UI** *(Preserved)*
10. **Demo Login**
11. **Real Authentication**
12. **Internal Super Admin**
13. **Hotel Management**
14. **Branch Management**
15. **Module Access Management**
16. **Customer/User Management**
17. **License/Service Management**
18. **Support & System Monitoring**
19. **Hotel Profile & Branding**
20. **Room & Property Management**
21. **Advanced Pricing**
22. **Hotel Services**
23. **Booking Engine**
24. **Guest Management**
25. **Check-in / Check-out**
26. **Guest Portal**
27. **Receptionist Panel**
28. **Manager Panel**
29. **Staff Management**
30. **Housekeeping**
31. **Restaurant Setup**
32. **Restaurant/POS + KOT**
33. **Inventory**
34. **Suppliers & Purchasing**
35. **Maintenance**
36. **Security**
37. **Accountant & Finance**
38. **Billing/Folio/Invoices**
39. **Payments + UPI/QR**
40. **Night Audit & Financial Reports**
41. **AI Hotel Chatbot / Assistant**
42. **Customer Hotel Website Builder**
43. **Hotel Website ↔ Management System Integration**
44. **Notifications, Reports, Import/Export, Audit, Security, Backup**
45. **Complete QA → Performance → Mobile Testing → Deployment → Final Release**

---

## 6. Development Conventions & Guidelines

- **Component Creation**: Components must be placed in modular domains (`components/landing/`, `components/onboarding/`, `components/dashboard/`, `components/hospitality/`, etc.).
- **Icons**: Always import from `lucide-react`. Never create inline SVGs when standard icons exist.
- **Theme Enforcement**: Respect dark-mode first design with blue/purple/cyan accents. Never hardcode gold hex values (`#FFD700`, `#D4AF37`, etc.).
- **State Hygiene**: Avoid impure functions in render (such as `Math.random()` or direct mutation). Use React state and hooks safely.
- **Error Boundaries**: Handle loading states, empty states, and validation gracefully.
