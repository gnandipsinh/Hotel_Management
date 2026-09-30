# Hotel Management SaaS Platform

## Domain Glossary & Core Terminology

**Phase:** 3 - Domain Glossary
**Status:** Draft pending approval
**Document type:** Authoritative terminology specification
**Rule:** From Phase 4 onward, all phases must use the exact terminology defined here. Synonyms for core entities must not be introduced without documenting them in this file.

---

## 1. Product Terminology

| Term | Definition |
| --- | --- |
| Hotel Management SaaS Platform | The complete multi-tenant software-as-a-service product operated by our company for managing hotel operations. |
| Hotel Management | The primary product purpose: operating rooms, reservations, front desk, guests, housekeeping, maintenance, POS, inventory, staff, finance, and reporting for customer hotels. |
| Hotel Website | An optional add-on: a public-facing website for a hotel, rendered from approved hotel management data and website content. |
| Booking Engine | The public availability-search and reservation-creation capability, usually embedded in or linked from the hotel website. |
| AI Assistant | An additional platform capability (staff or guest) that answers questions and requests approved actions through controlled tools. |
| Module | A functional area or role-oriented workspace within the platform that can be enabled or disabled per customer. |
| Feature | A granular capability within a module that may be controlled by feature flags or plan limits. |
| Add-on | An optional paid or separately entitled capability (for example Website or AI) layered onto the core hotel management product. |
| SaaS | Software as a Service; the platform is provided as a shared service to multiple independent customer organizations. |

**Rule:** Hotel Management is the main product. The Website is an optional add-on. AI is an additional capability, not the core product.

---

## 2. Tenancy Terminology

### 2.1 Canonical hierarchy

```text
Platform
    ↓
Organization / Tenant
    ↓
Hotel
    ↓
Branch
    ↓
Operational Data
```

### 2.1.1 Platform

**Definition:** The complete SaaS software operated by our company.

The platform contains:

- Internal Super Admin
- Customer tenant management
- Hotel management
- Modules
- Authentication
- Permissions
- Operations
- Websites
- Booking engine
- AI
- Integrations
- Support
- Subscription/service management

**Control:** Platform is controlled by our company.

### 2.1.2 Organization / Tenant

**Definition:** Organization is the customer/business account that owns or operates one or more hotels. Tenant is the security and data-isolation boundary represented by that organization.

**Rules:**

- Every customer-owned record must belong to the correct organization/tenant.
- One organization can have one or more hotels.
- One organization can have one or more users.
- Tenant data must never leak to another tenant.
- A tenant is not merely a login account; it is the ownership and isolation boundary for configuration, users, operational data, and service entitlement.

### 2.1.3 Hotel

**Definition:** A Hotel is a logical hotel/business entity belonging to an organization.

A hotel may contain:

- Hotel profile
- Branding
- Policies
- Rooms
- Rates
- Amenities
- Staff
- Reservations
- Guests
- Website
- Services

One organization may own/manage multiple hotels.

### 2.1.4 Branch

**Definition:** A Branch is a physical operating property/location belonging to a hotel.

- A single-property hotel can have one branch.
- A multi-property customer can have multiple branches.

A branch may contain:

- Rooms
- Staff assignments
- Inventory
- Housekeeping
- Maintenance
- POS outlets
- Operational records

Branch-level permissions must be supported.

### 2.1.5 Operational Data

**Definition:** Records produced by day-to-day hotel operations (reservations, folios, housekeeping tasks, inventory movements, POS orders, and so on) that always belong to the correct tenant, hotel, and branch context where applicable.

### 2.1.6 Tenant isolation

**Definition:** The guarantee that data owned by one organization/tenant is never readable or writable by another organization/tenant, enforced server-side on every request.

### 2.1.7 Branch scope

**Definition:** The boundary limiting a user's permissions and data visibility to specific branches assigned through their membership, rather than all branches of a hotel or organization.

---

## 3. Internal Administration Terminology

### 3.1 Platform Super Admin

**Definition:** Our company's highest-level administrator for the platform control plane.

Can manage:

- Customer organizations
- Hotels
- Branches
- Modules
- Service/subscription status
- Platform configuration
- Support
- Audit
- Platform monitoring

**Rule:** This role is NOT a customer hotel employee. It is never interchangeable with Hotel Super Admin.

### 3.2 Platform Support Agent

**Definition:** Internal support staff who can assist customer hotels.

Access must be:

- Permission controlled
- Scope controlled
- Audited
- Time-limited where appropriate

### 3.3 Hotel Super Admin

**Definition:** The highest administrative user on the customer hotel side.

Can manage hotel-level configuration, users, roles, permissions, modules and operations according to entitlement.

**Rule:** Do NOT confuse Hotel Super Admin with Platform Super Admin.

### 3.4 Hotel Owner

**Definition:** Business owner/customer representative of a customer hotel.

May have broad access depending on assigned permissions.

**Rule:** Do not assume owner automatically has every permission unless explicitly configured.

---

## 4. User / Role / Permission Terminology

### 4.1 User

**Definition:** A person with an authenticated platform account.

### 4.2 Staff User

**Definition:** A user who works for a hotel/branch.

### 4.3 Guest User

**Definition:** A customer/guest who interacts with the hotel's guest-facing services (website, booking engine, guest portal, guest AI).

### 4.4 Platform User

**Definition:** An internal user belonging to our company (Platform Super Admin, Platform Support Agent, platform operations staff).

### 4.5 Customer User

**Definition:** A user belonging to a customer organization.

### 4.6 User Membership

**Definition:** The association that defines which organization/hotel/branch a user belongs to and what scope they have.

### 4.7 Role

**Definition:** A reusable collection/template of permissions.

### 4.8 Permission

**Definition:** A specific allowed action, expressed as a granular capability string.

Examples:

```text
reservations.read
reservations.create
reservations.update
reservations.cancel
reservations.check_in
reservations.check_out
payments.refund
reports.export
users.manage
```

### 4.9 Scope

**Definition:** The boundary defining where a permission applies.

Possible scopes:

- Platform
- Organization
- Hotel
- Branch
- Self / Assigned records

**Rule:** User ≠ Role, Role ≠ Permission, and Permission ≠ Scope. All four are distinct concepts.

---

## 5. Module Terminology

### 5.1 Module

**Definition:** A functional area of the Hotel Management Platform.

Examples:

- Hotel Administration
- Room Management
- Reservations
- Front Desk
- Guest Management
- Housekeeping
- Maintenance
- Restaurant/POS
- Staff Management
- Finance
- Inventory
- Security
- Reporting
- Website
- AI

A module can be enabled or disabled for a customer according to service/subscription entitlement.

### 5.2 Module Entitlement

**Definition:** Whether an organization/hotel is allowed to use a module, granted by subscription/service configuration.

**Important:** Module entitlement is NOT the same as user permission.

Example: Hotel has Finance module enabled, but a receptionist may still have `finance.read = false`, therefore the receptionist cannot use Finance.

**Access decision:**

```text
Subscription / Entitlement
+ Hotel or Branch Scope
+ User Permission
= Access Decision
```

**Rule:** Module ≠ Permission, and Module ≠ Entitlement. Frontend visibility is not security.

---

## 6. Room Domain Terminology

### 6.1 Room Type

**Definition:** A category/type of room.

Examples: Deluxe, Standard, Suite.

### 6.2 Room

**Definition:** A physical sellable/accommodatable room.

Example: Room Type = Deluxe, Room Number = 204.

**Rule:** Room Type ≠ Room.

### 6.3 Room Amenity

**Definition:** A facility associated with a room or room type.

Examples: Wi-Fi, TV, AC, Balcony.

### 6.4 Room Status

**Definition:** Operational state of a room.

Examples: Available, Occupied, Reserved, Out of Order, Out of Service.

### 6.5 Cleaning Status

**Definition:** Housekeeping-specific state of a room.

Examples: Clean, Dirty, Cleaning, Inspected.

**Rule:** Room Status and Cleaning Status are separate dimensions and must NOT be mixed or stored in one field.

---

## 7. Rate & Availability Domain Terminology

### 7.1 Rate Plan

**Definition:** A pricing configuration used for selling rooms.

Examples: Standard Rate, Non-refundable, Breakfast Included.

### 7.2 Rate Rule

**Definition:** A condition/rule that modifies availability or pricing.

Examples: Seasonal rate, Weekend rate, Occupancy rule, Minimum stay.

### 7.3 Availability

**Definition:** The sellable inventory state for a given room type/room and date/time range.

### 7.4 Room Block

**Definition:** A deliberate reduction/restriction of available inventory.

### 7.5 Booking Hold

**Definition:** Temporary reservation of inventory while a booking is being completed.

---

## 8. Guest Domain Terminology

### 8.1 Guest

**Definition:** A person staying at or interacting with a hotel.

### 8.2 Guest Profile

**Definition:** The persistent customer record containing appropriate guest information.

### 8.3 Reservation Guest

**Definition:** A guest attached to a specific reservation.

### 8.4 Primary Guest

**Definition:** The primary contact/person for a reservation.

**Rule:** Do not assume that the booking contact and every staying guest are always the same person. Guest ≠ Reservation.

---

## 9. Reservation Domain Terminology

### 9.1 Reservation

**Definition:** A booking record representing an intended or confirmed stay/service.

A reservation may contain:

- Guest(s)
- Room(s)
- Dates
- Rate
- Charges
- Status
- Payment information
- Booking source

**Rule:** Guest ≠ Reservation, and Reservation ≠ Folio.

### 9.2 Reservation Status

**Definition:** The controlled lifecycle state of a reservation.

Potential statuses (values only; no implementation in this phase):

- Inquiry
- Pending
- Held
- Confirmed
- Checked In
- Checked Out
- Cancelled
- No Show

Document which transitions may be valid later. Do not implement statuses yet.

### 9.3 Booking Source

**Definition:** Where the reservation originated.

Examples: Direct, Website, Walk-in, Phone, OTA, Travel Agent, Corporate.

### 9.4 Check-in

**Definition:** The operational process of registering a guest arrival and starting the stay.

### 9.5 Check-out

**Definition:** The operational process of completing the stay and closing the guest's outstanding balance.

---

## 10. Folio & Billing Domain Terminology

### 10.1 Folio

**Definition:** A running financial account associated with a guest/reservation/stay.

It can contain:

- Room charges
- Restaurant charges
- Services
- Taxes
- Discounts
- Payments
- Adjustments

### 10.2 Folio Item

**Definition:** A single financial line within a folio.

### 10.3 Charge

**Definition:** A financial amount posted to a folio.

### 10.4 Payment

**Definition:** Money received against an outstanding amount.

### 10.5 Refund

**Definition:** Money returned to the payer.

### 10.6 Invoice

**Definition:** A formal billing document generated by the system.

**Important:** Folio ≠ Invoice. A folio is a running account. An invoice is a formal billing document.

**Rule:** Charge ≠ Payment, and Payment ≠ Refund.

---

## 11. Finance Terminology

| Term | Definition |
| --- | --- |
| Revenue | Money earned by the hotel from operations (rooms, POS, services). |
| Expense | Money spent by the hotel. |
| Tax | A government-imposed amount applied to charges (for example GST). |
| Discount | A reduction applied to an amount. |
| Deposit | Money received in advance to guarantee or part-pay a reservation. |
| Credit Note | A document recording a reduction of previously billed amounts. |
| Debit Adjustment | A folio adjustment increasing amounts owed. |
| Payment Allocation | The assignment of a payment to one or more charges or invoices. |
| Refund | Money returned to the payer. |
| Outstanding Balance | Amount still owed on a folio or invoice. |
| Reconciliation | The process of matching recorded payments with actual settlement records. |
| Financial Period | A defined accounting time window used for reporting and closing. |

**Rule:** Do not create accounting rules beyond what is defined/approved. Money must never use floating-point arithmetic.

---

## 12. Restaurant / POS Domain Terminology

| Term | Definition |
| --- | --- |
| Outlet | A restaurant/bar/cafe/service point operating within a hotel. |
| Menu | Collection of sellable food/service items. |
| Menu Item | A single item sold by an outlet. |
| Order | Customer purchase record. |
| KOT | Kitchen Order Ticket used to communicate kitchen preparation requirements. |
| Table | Physical restaurant table where applicable. |
| Shift | Operational POS period used for opening/closing and reconciliation. |
| Room Posting | Posting an outlet charge to a guest folio instead of collecting immediate payment. |

**Note:** `Shift` in POS context is an operational sales period; `Shift` in Staff context is a scheduled work period. Always qualify which is meant.

---

## 13. Housekeeping Domain Terminology

| Term | Definition |
| --- | --- |
| Housekeeping Task | A task related to cleaning/preparing/inspecting a room. |
| Task Status | Controlled state of a housekeeping task: Pending, Assigned, In Progress, Completed, Inspected. |
| Housekeeping Board | Operational view of room cleaning status/tasks. |
| Room Inspection | Quality check after cleaning. |

**Rule:** Housekeeping Task ≠ Maintenance Request.

---

## 14. Maintenance Domain Terminology

| Term | Definition |
| --- | --- |
| Maintenance Request | A reported maintenance issue. |
| Work Order | An actionable maintenance job created from a request or operational need. |
| Asset | A hotel-owned physical item that may require maintenance (AC, Refrigerator, Elevator, Generator). |
| Downtime | Period during which an asset/room/service is unavailable due to maintenance. |

---

## 15. Inventory Domain Terminology

| Term | Definition |
| --- | --- |
| Inventory Item | A stock-managed item. |
| Stock Location | Physical location where inventory is stored. |
| Stock Movement | A change in inventory quantity. |
| Supplier | A vendor providing goods/services. |
| Purchase Order | A formal request/order sent to a supplier. |
| Goods Receipt / Receiving | Recording goods received against a purchase order. |
| Stock Adjustment | Manual correction to inventory quantity with audit reason. |

---

## 16. Staff Domain Terminology

| Term | Definition |
| --- | --- |
| Staff Profile | Hotel employee/staff information. |
| Department | Organizational work area (Front Office, Housekeeping, Finance, Restaurant, Maintenance). |
| Shift | Scheduled work period for staff. |
| Attendance | Record of staff attendance. |

**Note:** Staff Profile is the employee record; User is the authenticated account. They are related but not the same entity.

---

## 17. Website Domain Terminology

| Term | Definition |
| --- | --- |
| Hotel Website | Public-facing website belonging to a hotel. |
| Website Configuration | Branding and global website settings. |
| Website Page | A public page (Home, Rooms, About, Contact). |
| Website Section | A reusable content section on a page. |
| Website Media | Images/videos/files used by the website. |
| Custom Domain | A domain connected to a hotel's website. |
| Published Content | Content currently visible publicly. |
| Draft Content | Content not yet publicly visible. |

**Rule:** Website ≠ Booking Engine. The website may host or link the booking engine, but they are distinct capabilities.

---

## 18. Booking Engine Domain Terminology

| Term | Definition |
| --- | --- |
| Booking Engine | Public booking functionality that allows guests to search availability and create reservations. |
| Booking Session | Temporary state during booking. |
| Booking Hold | Temporary inventory reservation. |
| Booking Confirmation | Successful creation of a reservation after required steps are completed. |

**Rule:** Booking Engine ≠ Reservation database. The booking engine must use the same availability/pricing source of truth as the hotel operations system.

---

## 19. AI Domain Terminology

| Term | Definition |
| --- | --- |
| AI Staff Assistant | AI assistant available to authorized hotel staff. |
| AI Guest Assistant | AI assistant available to public guests/website visitors. |
| Knowledge Source | An approved source of information used by AI (hotel policies, FAQs, room descriptions, documents). |
| Knowledge Document | An uploaded or stored source document. |
| Knowledge Chunk | A retrievable portion of a knowledge document. |
| AI Tool | An explicitly allowed action/function the AI can request. |
| AI Tool Call | A logged execution request made by the AI. |
| AI Conversation | A conversation between a user and an AI assistant. |
| AI Usage | Recorded model/token/cost usage. |

**Important:** AI is never a direct unrestricted database administrator. Every AI action follows:

```text
User Authentication
→ Tenant Context
→ Hotel / Branch Context
→ Permission Check
→ Allowed Tool
→ Authorized Data Access
→ Response
```

**Rule:** AI Assistant ≠ Database administrator. Staff AI and Guest AI are separate assistants with separate knowledge and permission scopes.

---

## 20. Notification Domain Terminology

| Term | Definition |
| --- | --- |
| Notification | A message generated by the platform. |
| Channel | Delivery method: In-app, Email, SMS, WhatsApp. |
| Notification Template | Reusable message structure. |
| Delivery Status | State of delivery: Pending, Sent, Delivered, Failed, Retrying. |
| Notification Preference | User/customer preference controlling allowed communications. |

---

## 21. Support Domain Terminology

| Term | Definition |
| --- | --- |
| Support Ticket | A customer support issue/request. |
| Ticket Status | Open, In Progress, Waiting for Customer, Resolved, Closed. |
| Support Agent | Internal company support user. |
| Customer Reply | Response from hotel customer. |

---

## 22. Subscription / Service Domain Terminology

| Term | Definition |
| --- | --- |
| Plan | A predefined commercial/service package. |
| Subscription | A customer's active service relationship. |
| Entitlement | Permission granted by subscription/service configuration. |
| Usage Limit | Configured maximum usage where applicable. |
| Trial | Temporary evaluation period. |
| Active | Service currently usable. |
| Suspended | Service temporarily restricted. |
| Expired | Service period ended. |

**Rules:**

- Plan ≠ Subscription (a plan is a package definition; a subscription is a customer's relationship to a plan).
- Subscription ≠ Entitlement (a subscription grants entitlements; entitlement is the resulting access grant).
- Pricing is not hard-coded in this phase.

---

## 23. Audit Domain Terminology

| Term | Definition |
| --- | --- |
| Audit Log | Immutable record of an important system action. |
| Audit Actor | The user/system responsible for the action. |
| Audit Scope | The organization/hotel/branch context of the action. |
| Audit Event | The recorded action/event. |

Example audit events:

```text
USER_CREATED
ROLE_CHANGED
BOOKING_CREATED
BOOKING_CANCELLED
PAYMENT_CREATED
REFUND_CREATED
MODULE_ENABLED
WEBSITE_PUBLISHED
```

---

## 24. Non-Interchangeable Terms

The following terms must NEVER be used interchangeably:

| Term A | Term B | Distinction |
| --- | --- | --- |
| Tenant | Hotel | Tenant is the security/isolation boundary; Hotel is a logical business entity inside a tenant. |
| Hotel | Branch | Hotel is the logical entity; Branch is the physical operating property. |
| User | Role | User is an authenticated person; Role is a reusable permission template. |
| Role | Permission | Role is a collection/template; Permission is a single allowed action. |
| Module | Permission | Module is a functional area; Permission is a specific action grant. |
| Room Type | Room | Room Type is a category; Room is a physical room instance. |
| Room Status | Cleaning Status | Room Status is operational state; Cleaning Status is housekeeping state. |
| Guest | Reservation | Guest is a person; Reservation is a booking record. |
| Reservation | Folio | Reservation is the booking; Folio is the running financial account. |
| Folio | Invoice | Folio is a running account; Invoice is a formal billing document. |
| Charge | Payment | Charge is an amount posted; Payment is money received. |
| Payment | Refund | Payment is money received; Refund is money returned. |
| Housekeeping Task | Maintenance Request | Cleaning/preparation task vs. repair/maintenance issue. |
| Website | Booking Engine | Public site capability vs. availability/reservation capability. |
| Booking Engine | Reservation database | The booking channel vs. the system of record. |
| AI Assistant | Database administrator | Controlled tool caller vs. unrestricted data access. |
| Plan | Subscription | Package definition vs. customer's service relationship. |
| Subscription | Entitlement | Service relationship vs. resulting access grant. |

---

## 25. Status Terminology Rules

Statuses must be controlled values.

- Do not allow arbitrary free-text statuses in business-critical workflows.
- Future implementation should use typed/enumerated status definitions.
- Before implementing a workflow, define:
  - Allowed statuses
  - Allowed transitions
  - Who can perform transitions
  - Required validations
  - Audit events

---

## 26. Identifier Terminology Rules

Use distinct, context-specific identifiers:

```text
organizationId
hotelId
branchId
userId
roleId
permissionId
roomId
roomTypeId
guestId
reservationId
folioId
invoiceId
paymentId
refundId
moduleId
websiteId
conversationId
```

Do not use generic ambiguous identifiers such as `id` inside business logic where the entity context matters.

---

## 27. Date/Time Terminology Rules

| Term | Definition |
| --- | --- |
| UTC timestamp | Canonical server-side timestamp for all stored instants. |
| Local hotel time | The timezone configured for the relevant hotel/branch. |
| Business date | The hotel operational date where different from the UTC calendar date. |
| Check-in date | Scheduled arrival date. |
| Check-out date | Scheduled departure date. |

All future date/time logic must respect the hotel's configured timezone.

---

## 28. Money Terminology Rules

| Term | Definition |
| --- | --- |
| Amount | A monetary value in a specific currency. |
| Subtotal | Sum before tax and discounts are applied. |
| Tax | Government-imposed amount applied to charges. |
| Discount | Reduction applied to an amount. |
| Total | Final amount after tax and discounts. |
| Paid | Amount received. |
| Refunded | Amount returned. |
| Outstanding | Amount still owed. |
| Currency | The monetary unit of an amount, stored explicitly. |

Rules:

- Use integer minor units or another precise money representation.
- Do NOT use floating-point arithmetic for financial calculations.
- Currency must be stored explicitly.
- Indian Rupee (₹) is supported but must not be hard-coded as the only possible currency.

---

## 29. Consistency Rule (From Phase 4 Onward)

- Use the exact terminology from `docs/domain-glossary.md`.
- Do not introduce synonyms for core entities without documenting them.
- Do not rename core concepts casually.
- If a future requirement conflicts with this glossary, stop and flag the conflict before implementation.
- Update the glossary through an explicit documented decision.

---

## 30. Final Validation Checklist

- [x] Tenant is clearly defined
- [x] Organization is clearly defined
- [x] Hotel is clearly defined
- [x] Branch is clearly defined
- [x] Platform Super Admin is clearly defined
- [x] Hotel Super Admin is clearly defined
- [x] User/Role/Permission are separated
- [x] Module/Entitlement/Permission are separated
- [x] Room Type/Room are separated
- [x] Room Status/Cleaning Status are separated
- [x] Guest/Reservation are separated
- [x] Reservation/Folio/Invoice are separated
- [x] Charge/Payment/Refund are separated
- [x] Website/Booking Engine are separated
- [x] Staff AI/Guest AI are separated
- [x] Plan/Subscription/Entitlement are separated
- [x] Tenant isolation terminology is defined
- [x] Branch scope terminology is defined
- [x] Status terminology is defined
- [x] Money terminology is defined
- [x] Date/time terminology is defined
- [x] Identifier terminology is defined

---

## 31. Completion Report

### What was documented

1. Product terminology
2. Tenancy terminology (Platform, Organization/Tenant, Hotel, Branch, Operational Data)
3. Internal administration terminology (Platform Super Admin, Platform Support Agent, Hotel Super Admin, Hotel Owner)
4. User/role/permission terminology (User, Staff/Guest/Platform/Customer User, Membership, Role, Permission, Scope)
5. Module terminology (Module, Module Entitlement, access decision formula)
6. Room terminology (Room Type, Room, Amenity, Room Status, Cleaning Status)
7. Rate/availability terminology (Rate Plan, Rate Rule, Availability, Room Block, Booking Hold)
8. Guest terminology (Guest, Guest Profile, Reservation Guest, Primary Guest)
9. Reservation terminology (Reservation, Reservation Status, Booking Source, Check-in, Check-out)
10. Folio/billing terminology (Folio, Folio Item, Charge, Payment, Refund, Invoice)
11. Finance terminology (Revenue, Expense, Tax, Discount, Deposit, Credit Note, Debit Adjustment, Payment Allocation, Refund, Outstanding Balance, Reconciliation, Financial Period)
12. Restaurant/POS terminology (Outlet, Menu, Menu Item, Order, KOT, Table, Shift, Room Posting)
13. Housekeeping terminology (Task, Task Status, Board, Inspection)
14. Maintenance terminology (Request, Work Order, Asset, Downtime)
15. Inventory terminology (Item, Stock Location, Stock Movement, Supplier, Purchase Order, Goods Receipt, Stock Adjustment)
16. Staff terminology (Staff Profile, Department, Shift, Attendance)
17. Website terminology (Website, Configuration, Page, Section, Media, Custom Domain, Published/Draft Content)
18. Booking engine terminology (Booking Engine, Session, Hold, Confirmation)
19. AI terminology (Staff/Guest Assistant, Knowledge Source/Document/Chunk, Tool, Tool Call, Conversation, Usage, AI security path)
20. Notification terminology (Notification, Channel, Template, Delivery Status, Preference)
21. Support terminology (Ticket, Ticket Status, Support Agent, Customer Reply)
22. Subscription terminology (Plan, Subscription, Entitlement, Usage Limit, Trial, Active, Suspended, Expired)
23. Audit terminology (Audit Log, Actor, Scope, Event, example events)
24. Non-interchangeable terms table (18 distinctions)
25. Status terminology rules
26. Identifier terminology rules
27. Date/time terminology rules
28. Money terminology rules
29. Consistency rule for Phase 4 onward
30. Final validation checklist

### Terminology conflicts discovered

No blocking conflicts were found. Two ambiguity points were resolved by explicit definitions and notes:

1. **"Shift" dual meaning:** POS Shift (sales period) vs. Staff Shift (scheduled work period). Both are defined; future usage must qualify which is meant.
2. **Staff Profile vs. User:** Related but distinct entities; Staff Profile is the employee record, User is the authenticated account.

### Open terminology decisions

1. Reservation status enumeration: confirm whether `Inquiry`, `Pending`, and `Held` are all required in the first release, or a reduced set is preferred.
2. Whether `Organization` and `Tenant` remain exact synonyms in code naming (recommended: `organizationId` as the identifier, `tenant` as the isolation concept).
3. Whether `Hotel Owner` has a fixed default permission set or is always explicitly configured.
4. Whether `Financial Period` is required for the initial release or deferred.
5. Whether `Table` and KOT are first-release POS scope or later POS enhancements.
6. Confirmation that Room Status and Cleaning Status enums will be finalized during the architecture/schema phase.

### Phase 3 confirmation

Phase 3 is complete.

- `docs/domain-glossary.md` created.
- No application features implemented.
- No UI pages created.
- No database migrations created.
- No unnecessary dependencies installed.

Phase 4 must not begin until this glossary and the open terminology decisions are approved.
