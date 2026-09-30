# Hotel Management SaaS Platform

## Product Discovery Specification

**Phase:** 2 - Product Discovery  
**Status:** Draft pending product approval  
**Document type:** Requirements only  
**Implementation status:** No application code, UI pages, database migrations, or dependencies are included in this phase.

## 1. Product Vision

The product is a production-ready, multi-tenant Hotel Management Platform as a Service (SaaS).

The platform provides one shared product to multiple independent customer hotels while keeping each customer's configuration, users, permissions, operations, and data isolated. Hotel management is the primary product. The hotel website is an optional add-on, and AI assistants are an additional capability available to authorized staff and guests.

The platform must support the following operating model:

```text
OUR PLATFORM
├── Internal Platform Administration
└── Customer Organizations / Tenants
    ├── Hotel A
    │   ├── Branch A1
    │   └── Branch A2
    ├── Hotel B
    │   └── Branch B1
    └── Hotel C
        └── Branch C1
```

The system must not assume that every customer uses the same modules, has the same number of branches, or uses the optional website and AI capabilities.

## 2. Product Terminology and Hierarchy

The following terminology is the working product model:

| Term | Meaning |
| --- | --- |
| Platform | Our company's complete SaaS product and internal control plane. |
| Internal Super Admin | Authorized employee of our company who administers the platform and customer service. |
| Organization / Tenant | The customer security, configuration, and service boundary. It owns the customer's hotel data and subscription relationship. |
| Hotel | A customer hotel entity and operational management boundary. A tenant may eventually contain one or more hotels if that commercial model is approved. |
| Branch / Property | A physical hotel operating location under a hotel. A hotel may have one or multiple branches. |
| Hotel Super Admin | The customer owner or administrator responsible for that customer's hotel configuration and users. This role is never the internal platform administrator. |
| Module | A functional area or role-oriented workspace enabled for a customer. |
| Entitlement | The service or subscription decision that determines whether a tenant or branch may use a module. |
| Scope | The organization, hotel, branch, or record boundary within which a user may act. |

The exact commercial relationship between an organization and multiple hotels remains an open decision. The data and authorization model must not prevent it.

## 3. Target Users

### 3.1 Internal platform users

- Internal Super Admin
- Platform operations administrator
- Platform support agent
- Platform finance or service administrator
- Platform auditor

Internal users belong to our company and operate in the control plane. They must not be treated as customer hotel users.

### 3.2 Customer hotel users

- Hotel owner
- Hotel Super Admin
- Hotel or branch manager
- Receptionist and front-desk staff
- Reservations staff
- Housekeeping manager and housekeeping staff
- Maintenance manager and maintenance staff
- Accountant and finance manager
- Inventory and purchasing staff
- Restaurant or POS staff
- Staff manager
- Security or operations staff
- Auditor

### 3.3 External users

- Guest
- Website visitor
- Booking customer
- Guest portal user

External users must have access only to public content or their own authorized reservation and guest information.

## 4. Product Scope

### 4.1 In scope

- Multi-tenant hotel management
- Multi-hotel and multi-branch operation
- Customer-specific configuration
- Hotel-specific users, roles, permissions, and module access
- Core hotel operations from room setup through finance and reporting
- Optional hotel website and website CMS
- Central availability and pricing logic
- Public booking engine
- Guest portal
- Staff and guest AI assistants
- Notifications and communications
- Internal platform administration
- Customer support capability
- Service and subscription state management
- Auditability and security controls
- Indian hotel readiness with configurable localization
- Responsive desktop, tablet, and mobile workflows

### 4.2 Product boundaries

- Hotel management is the primary system of record.
- The public website is an optional service layered over hotel data.
- The booking engine uses the same availability and pricing logic as hotel operations.
- AI uses controlled tools and authorized data access; it is not an unrestricted database interface.
- Internal platform administration is separate from customer hotel administration.
- Frontend visibility is not an authorization mechanism.

## 5. Internal Platform Administration Scope

The Internal Super Admin panel is an internal control plane for our company. It is not available to normal hotel customers.

### 5.1 Customer lifecycle

Internal administrators must eventually be able to:

- Add a customer organization or hotel
- Configure initial customer and hotel information
- Configure the customer owner or initial Hotel Super Admin
- Add and configure branches
- View customer organizations, hotels, and branches
- Change customer service status
- Suspend or reactivate service subject to approved policy
- View subscription or service state
- Enable and disable customer modules
- Apply module or feature availability
- Record onboarding progress
- View platform-level operational information

### 5.2 Platform administration

- Manage platform-level users
- Manage internal roles and permissions
- Manage feature availability
- Manage service configuration
- Manage supported integrations and providers
- Manage platform announcements
- View platform activity
- View platform audit logs
- Monitor operational health and background jobs
- Manage support access and controlled impersonation or assistance sessions

Any support access to customer data must be time-limited, permission-controlled, visible to the customer where policy requires, and fully audited.

### 5.3 Separation from customer administration

- Internal Super Admin is a platform role.
- Hotel Super Admin is a customer role.
- Internal users must not be inserted into a customer's normal role hierarchy without an explicit, audited support mechanism.
- Customer users must never access internal platform administration routes or data.
- Platform-wide configuration must not be editable by customer users unless explicitly exposed as tenant configuration.

## 6. Customer Hotel Administration Scope

Every customer hotel must have an owner or Hotel Super Admin workspace for its own authorized tenant context.

The Hotel Super Admin must be able to configure, subject to enabled modules and plan limits:

- Hotel profile
- Hotel name and legal information
- Logo and branding
- Contact information
- Address and location
- Currency and timezone
- Language and localization settings
- Hotel policies
- Cancellation and booking rules
- Branches and branch settings
- Rooms and room types
- Amenities and room images
- Rates, taxes, discounts, and packages
- Customer users and staff
- Roles and permissions
- Branch-level assignments
- Enabled customer modules where the subscription permits customer control
- Payment settings
- Invoice settings and numbering configuration
- Notification templates and preferences
- Reports and export permissions
- Website settings when the website service is enabled
- AI knowledge and assistant settings when the AI service is enabled

Hotel Super Admin access must remain limited to the customer's tenant. It must not allow access to another customer hotel.

## 7. Multi-Hotel and Multi-Branch Requirements

### 7.1 Tenant isolation

Each customer must operate inside an explicitly resolved and server-validated tenant context.

The system must prevent:

- Hotel A accessing Hotel B data
- Hotel B accessing Hotel C data
- An unauthorized branch accessing another branch's restricted data
- A guest accessing another guest's information
- A staff user bypassing their assigned hotel or branch scope
- A client changing a URL or request identifier to access a different tenant

Identifiers supplied by the client must never be treated as proof of authorization.

### 7.2 Branch support

The system must support:

- One organization, one hotel, and one branch
- One organization, one hotel, and multiple branches
- Branch-level configuration
- Branch-specific users and assignments
- Users assigned to multiple branches
- Owners or administrators assigned to all branches
- Managers assigned to selected branches
- Branch-specific rooms, outlets, staff, inventory, operations, and reports
- Hotel-level and organization-level aggregation where applicable

### 7.3 Scope examples

- Branch Manager: Branch A only
- Another Branch Manager: Branch B only
- Hotel Owner: all branches belonging to the authorized hotel
- Organization Owner: all permitted hotels and branches in the organization
- Internal Platform Support: only the customer context explicitly granted for the support task

### 7.4 Reporting scope

Reports must support the smallest permitted operational scope and, where the user's permissions allow, aggregate to:

- Branch level
- Hotel level
- Organization level
- Platform level for internal operational reporting only

## 8. Customer Modules

The platform must support the following 13 customer-facing modules. They are functional areas or workspaces within the same platform, not necessarily separate applications or databases.

### 8.1 Hotel Super Admin / Administration

- Customer hotel configuration
- Branch configuration
- Users, staff, roles, and permissions
- Module access
- General settings
- Branding and integrations
- Audit access subject to permission

### 8.2 Owner / Management

- Owner and executive dashboard
- Hotel and branch performance
- Revenue and occupancy summaries
- Management reports
- Approval workflows
- Cross-branch visibility where authorized

### 8.3 Manager

- Operational dashboard
- Daily activity
- Staff and task oversight
- Exception management
- Approvals
- Branch and department performance

Owner and Manager are primarily role-oriented workspaces over shared domain data. They must not create duplicate operational records.

### 8.4 Reception / Front Desk

- Today's arrivals and departures
- Walk-ins
- Guest search
- Room assignment
- Check-in and check-out
- Room changes
- Guest requests
- Folio and payment actions allowed by permission

### 8.5 Room Management

- Room types
- Rooms and room numbers
- Floor
- Capacity
- Amenities
- Images
- Room status
- Cleaning status
- Maintenance status
- Room history

### 8.6 Housekeeping

- Room cleaning status
- Housekeeping board
- Task creation and assignment
- Cleaning priority
- Inspection
- Room readiness
- Mobile-friendly task workflow

### 8.7 Restaurant / POS

- Outlets
- Menu and categories
- Orders
- Kitchen Order Tickets (KOT)
- Taxes
- Payments
- Room posting
- Shift opening and closing
- Outlet reports

### 8.8 Staff Management

- Staff profiles
- Departments
- Branch assignments
- Roles and permissions
- Shifts
- Attendance
- Staff status
- Staff reports

### 8.9 Guest Management

- Guest profiles
- Contact details
- Stay history
- Preferences
- Notes
- Legally appropriate documents
- Consent
- Communication history
- Guest search and duplicate handling

### 8.10 Accounting / Finance

- Folios
- Charges
- Payments
- Refunds
- Discounts
- Taxes
- Invoices
- Credit notes
- Payment reconciliation
- Financial reports

### 8.11 Inventory / Purchasing

- Items and categories
- Suppliers
- Stock locations
- Stock levels
- Stock movement
- Purchase orders
- Receiving
- Adjustments
- Low-stock alerts
- Purchasing reports

### 8.12 Maintenance

- Maintenance requests
- Work orders
- Priority
- Assignment
- Status
- Assets where enabled
- Maintenance history
- Room or equipment downtime

### 8.13 Security / Operations

- Operational incidents
- Security or incident records
- Access and activity oversight
- Operational alerts
- Emergency or escalation records where defined
- Security-related reporting
- Controlled audit access

## 9. Module Access System

Module access is evaluated through three independent controls:

```text
Subscription / Entitlement
+ Hotel or Branch Scope
+ User Permission
= Access Decision
```

### 9.1 Entitlement

The tenant or branch must have the module enabled by its service or subscription state. A disabled module must not be usable through the API, background jobs, public website, AI tools, or direct URL access.

### 9.2 Scope

The enabled module must be assigned to the relevant organization, hotel, or branch scope. A user must not gain access to a branch merely because the module is enabled elsewhere.

### 9.3 Permission

The current authenticated user must hold the required permission for the requested operation within the requested scope.

### 9.4 Enforcement requirements

- Backend authorization is mandatory.
- API routes must check entitlement, scope, and permission.
- Background workers must preserve tenant and module context.
- Public booking and AI tools must respect enabled services.
- Frontend navigation may hide unavailable features but must not be relied upon for security.
- Disabled module requests must fail with a safe, consistent authorization or entitlement response.
- Module changes must be audited.

## 10. Core Hotel Operations

### 10.1 Rooms

The system must support room types, rooms, room numbers, floor, capacity, amenities, images, operational status, cleaning status, and maintenance status. Room status changes must preserve history and must interact correctly with availability, housekeeping, front desk, and maintenance.

### 10.2 Rates

The system must support:

- Base price
- Seasonal pricing
- Weekend pricing
- Packages
- Discounts
- Taxes
- Occupancy-based pricing
- Availability restrictions
- Minimum and maximum stay rules where enabled
- Rate availability by branch and room type

Currency, tax, date, and pricing rules must be configurable rather than hard-coded for one country.

### 10.3 Booking

The system must support:

- Reservations
- Direct booking
- Walk-in booking
- Booking source
- Guest details
- Room assignment
- Booking modification
- Cancellation
- Booking status
- Booking history
- Temporary booking holds
- Confirmation and notification

### 10.4 Front Desk

The system must support today's arrivals, today's departures, walk-ins, check-in, check-out, room assignment, room change, guest requests, and permitted folio/payment actions.

### 10.5 Guest

The system must support guest profiles, contact details, stay history, preferences, notes, legally appropriate documents, consent, and communication history. Guest data must be restricted by tenant, branch scope, user permission, and guest self-access rules.

### 10.6 Housekeeping

The system must support cleaning status, task assignment, priority, inspection, housekeeping board, room readiness, and a mobile-friendly workflow.

### 10.7 Maintenance

The system must support maintenance requests, work orders, priority, assignment, status, maintenance history, and room or asset context.

### 10.8 Restaurant and POS

The system must support menus, categories, orders, KOT, taxes, payments, room posting, outlet management, and shift closing. POS permissions must distinguish order entry, voids, discounts, refunds, room posting, and shift closing.

### 10.9 Inventory

The system must support items, categories, suppliers, stock, stock locations, stock movement, purchase orders, receiving, adjustments, and low-stock alerts. Inventory movements must be traceable.

### 10.10 Staff

The system must support staff profiles, departments, roles, branch assignment, shifts, attendance, and permissions. Staff records must remain separate from authentication identities while allowing a controlled relationship between them.

### 10.11 Finance

The system must support folios, charges, payments, refunds, discounts, taxes, invoices, credit notes, payment reconciliation, and financial reports. Finalized financial records must be auditable and must not be silently overwritten.

### 10.12 Reports

The system must eventually support:

- Occupancy
- ADR
- RevPAR
- Revenue
- Bookings
- Guest reports
- Housekeeping reports
- Finance reports
- Inventory reports
- Staff reports
- Branch reports
- Export with permission control

Report definitions, time zone, currency, tax treatment, and aggregation rules must be documented before implementation of each report.

## 11. Indian Hotel Requirements and Localization

The first market must be able to operate with Indian hotel workflows, including:

- Indian Rupee (INR / ₹)
- UPI payments
- QR payments
- Online payments
- GST and configurable tax rules
- GST-compatible invoices where legally applicable
- Indian date and time display conventions where configured
- Hotel address and contact information
- Payment reconciliation
- Invoice numbering

The platform must not hard-code India-specific behavior into the core domain. The following must remain configurable:

- Currency
- Currency precision and formatting
- Timezone
- Locale
- Date and time display
- Tax types and rates
- Invoice numbering rules
- Payment methods
- Tax registration fields
- Address format
- Language

Tax and invoice requirements must be validated against the applicable legal and accounting requirements before release. The platform must not claim legal compliance without appropriate review.

## 12. Hotel Website Add-On

Hotel management remains the main product. A customer may optionally purchase or enable a website service.

### 12.1 Website capabilities

- Hotel branding
- Logo
- Colors
- Typography
- Hero section
- Hotel information
- Rooms and room images
- Amenities
- Gallery
- Restaurant
- Services
- Offers
- Contact
- Location
- Policies
- Booking
- Availability
- Guest enquiry
- Responsive mobile presentation
- SEO metadata
- Custom domain
- SSL
- Analytics
- Multilingual content where enabled

### 12.2 Shared hotel data

The website should reuse approved hotel management data where appropriate. For example, a room configured in the management system with its name, price, capacity, images, and amenities should be publishable on the website without duplicate manual entry.

Website content must have publication controls so incomplete or unapproved management data is not automatically exposed publicly.

### 12.3 Website isolation

- Website content must be scoped to the correct organization, hotel, branch, and locale.
- Public endpoints may expose only published content.
- Website administration requires customer permissions and the website entitlement.
- Custom domain and SSL configuration must belong to the correct customer scope.

## 13. Booking Engine

The public booking flow must eventually be:

```text
Search dates and guests
→ Availability
→ Room selection
→ Rate selection
→ Guest details
→ Payment or guarantee
→ Reservation confirmation
→ Notification
```

The booking engine must use the central availability and pricing logic used by hotel operations. It must not create a separate source of truth or separate booking database that can diverge from the hotel system.

The booking flow must support:

- Availability search
- Guest and room occupancy
- Rate and package selection
- Taxes and discounts
- Temporary booking holds
- Payment or payment guarantee
- Reservation confirmation
- Cancellation policy display
- Confirmation notifications
- Idempotent payment and booking callbacks
- Safe recovery from retries and partial failures

## 14. Guest Portal

The guest portal is an optional public-facing capability connected to a reservation.

It may eventually support:

- Reservation lookup
- Reservation details
- Guest profile details
- Online check-in where approved
- Payment or balance information
- Invoice access
- Guest requests
- Hotel messages
- Cancellation or modification requests subject to policy
- Staff assistance

Guest portal users must only access their own authorized reservation and permitted guest information.

## 15. AI Assistants

The platform must support two conceptually separate assistants.

### 15.1 Staff AI Assistant

Authorized staff may eventually:

- Ask about today's check-ins
- Ask about today's check-outs
- Ask about room availability
- Search for a reservation
- Get reservation status
- Ask about housekeeping status
- Create approved service requests
- Create maintenance requests
- Summarize daily operations
- Explain reports
- Search hotel policies
- Search the hotel knowledge base

The assistant must apply the staff user's tenant, hotel, branch, module, and permission context to every response and action.

### 15.2 Guest AI Assistant

Website visitors and guests may eventually use the assistant for:

- Hotel FAQs
- Room information
- Amenities
- Restaurant information
- Hotel policies
- Cancellation policy
- Configured local information
- The guest's own reservation information
- Requesting staff assistance

Guest AI must never expose another guest's data or internal hotel information not intended for guests.

### 15.3 AI security model

Every AI action must follow:

```text
User Authentication
→ Tenant Context
→ Hotel / Branch Context
→ Permission Check
→ Allowed Tool
→ Authorized Data Access
→ Response
```

Additional requirements:

- No unrestricted database access
- No arbitrary SQL generation or execution by the model
- Allowlisted tools only
- Permission checks before every tool action
- Confirmation for sensitive actions such as cancellation, refunds, or changes
- Tenant and branch filters on retrieval
- Guest and staff knowledge separation
- Prompt injection protection
- PII handling and redaction where appropriate
- Human escalation when confidence or authorization is insufficient
- AI conversation and tool audit records
- Model and provider abstraction
- Usage and cost tracking

## 16. Role and Permission System

Use permission-based RBAC with organization, hotel, branch, and record scope.

### 16.1 Potential roles

- Platform Super Admin
- Platform Support
- Hotel Owner
- Hotel Super Admin
- Manager
- Branch Manager
- Receptionist
- Reservations Staff
- Housekeeping Manager
- Housekeeping Staff
- Maintenance Staff
- Accountant
- Finance Manager
- Inventory Manager
- Restaurant / POS Staff
- Staff Manager
- Security Staff
- Auditor
- Guest

### 16.2 Example permissions

```text
reservations.read
reservations.create
reservations.update
reservations.cancel
reservations.check_in
reservations.check_out
rooms.read
rooms.manage
housekeeping.read
housekeeping.manage
payments.read
payments.create
payments.refund
reports.read
reports.export
users.manage
roles.manage
```

### 16.3 Permission requirements

- Permissions must be enforced on the backend.
- Frontend visibility is not security.
- Hotels may create custom roles where the product policy allows it.
- Role assignments must include scope.
- A user may have different roles in different branches.
- Sensitive actions may require step-up authentication or approval.
- Financial actions should support approval rules where required.
- Permission and role changes must be audited.
- Guests must never inherit staff permissions.

## 17. Mobile and Responsive Requirements

The platform must support desktop, laptop, tablet, and mobile use. Mobile requirements are not satisfied by merely shrinking desktop screens.

Priority mobile workflows:

- Reception
- Housekeeping
- Maintenance
- Manager dashboard
- Guest portal
- AI assistant

Mobile interfaces should prioritize quick actions, readable status, touch targets, offline-tolerant feedback where appropriate, clear errors, and minimal data entry for repeated operational tasks.

## 18. Notifications

The notification capability must eventually support:

- In-app notifications
- Email
- SMS
- WhatsApp through a provider abstraction
- Booking confirmation
- Cancellation confirmation
- Payment notification
- Check-in reminder
- Check-out reminder
- Housekeeping alerts
- Maintenance alerts
- Low-stock alerts
- Staff notifications

Notifications must support:

- Tenant and hotel scoped templates
- Localized content where enabled
- Delivery status
- Retry handling
- Provider failure handling
- Idempotency
- User and guest preferences
- Opt-out and consent rules
- Audit and delivery history

## 19. Security Requirements

Security is a product requirement from the beginning.

Required controls include:

- Tenant isolation
- Role-based permissions
- Branch-level permissions
- Secure authentication
- MFA support
- Session management and revocation
- Rate limiting
- Audit logs
- Secure cookies
- CSRF protection where applicable
- Input validation
- Server-side API authorization
- Secure file uploads
- Secrets management
- Encryption where required
- No sensitive data in URLs
- Payment security
- AI security
- Prompt injection protection
- Backup strategy
- Disaster recovery planning
- Safe error handling without sensitive leakage
- Dependency and vulnerability management
- Controlled support access

## 20. Audit Log Requirements

Important actions must be auditable. At minimum, audit coverage must include:

- Login
- Logout
- User creation
- User deletion or deactivation
- Role change
- Permission change
- Booking creation
- Booking cancellation
- Check-in
- Check-out
- Payment
- Refund
- Invoice finalization
- Configuration changes
- Module enable or disable
- Website publishing
- AI actions

Audit records should include, as appropriate:

- Actor identity
- Actor type
- Timestamp
- Tenant, hotel, and branch context
- Action and target resource
- Result
- Request or correlation identifier
- Relevant before and after values without exposing unnecessary secrets
- Source or device information where policy permits

Audit records must be protected from ordinary customer modification. Retention, export, and deletion rules require a later compliance decision.

## 21. Data Isolation Requirements

Every customer-owned record must retain its correct tenant, hotel, and branch context where applicable.

The implementation must enforce:

- Hotel A cannot access Hotel B data.
- Branch A cannot access unauthorized Branch B data.
- Guest A cannot access Guest B data.
- Staff A cannot access unauthorized staff records.
- AI for Hotel A cannot retrieve Hotel B knowledge or operations.
- Background jobs cannot process another tenant's records accidentally.
- Public website APIs cannot expose unpublished or unrelated customer data.

The authorization decision must be made server-side from authenticated identity, resolved tenant context, scope, entitlements, permissions, and record ownership. Frontend-supplied IDs are only lookup inputs, never authorization proof.

## 22. Performance and Reliability Requirements

The product must support real hotel operations with predictable behavior.

Requirements include:

- Fast operational dashboards
- Pagination for large collections
- Search and filtering
- Correct database indexes
- Efficient queries
- Caching where appropriate
- Background jobs for slow or retryable work
- Queue processing
- Rate limiting
- Loading states
- Empty states
- Error states
- Retry handling
- Idempotent external callbacks
- Concurrency protection for availability and payments
- Monitoring for failed jobs and integrations

The product should avoid unnecessary API requests and duplicate sources of truth.

## 23. UX Principles

The product UI must be:

- Professional
- Premium
- Clean
- Modern
- Hotel-focused
- Usable by non-technical staff
- Consistent
- Responsive
- Accessible
- Clear about status and next actions

Important operations must be obvious. Receptionists must be able to complete common tasks quickly. Housekeeping must have a simple mobile workflow. Managers must have clear dashboards and reports. Animations must not interfere with operational speed or accessibility.

## 24. Support System

Because the product is SaaS, customers need a controlled support capability.

The support system should eventually support:

- Support tickets
- Ticket priority
- Ticket status
- Internal notes
- Customer replies
- Attachments
- Support history
- Platform announcements
- Customer-facing knowledge base
- Assignment to support staff
- SLA or response tracking where approved

Internal support staff must have controlled, least-privilege access and audit logging. Support access must not become an untracked bypass of tenant isolation.

## 25. Subscription and Service Model

The service architecture must support flexible commercial configuration without hard-coding pricing in application logic.

Potential concepts include:

- Plans
- Add-ons
- Subscription status
- Enabled modules
- Usage limits
- Trial
- Active
- Suspended
- Expired
- Renewal
- Grace period
- Feature availability
- Branch or user limits
- Service configuration

Subscription and entitlement state must be distinct from user permissions. A user cannot use a module merely because a role contains its permissions when the hotel's service entitlement is disabled.

Pricing, plan names, billing provider, and final commercial limits are not finalized in Phase 2.

## 26. Conceptual Data Model

The conceptual hierarchy is:

```text
Organization / Tenant
→ Hotel
→ Branch
→ Operational Data
```

Operational data includes:

- Users
- Roles
- Permissions
- Rooms
- Room types
- Rates
- Reservations
- Guests
- Folios
- Payments
- Invoices
- Housekeeping
- Maintenance
- Inventory
- POS
- Staff
- Reports
- Website
- AI knowledge and conversations

Every tenant-owned data path must preserve the correct tenant context. The implementation must define which records are organization-wide, hotel-wide, branch-specific, or user/guest-specific before database work begins.

## 27. Product Principles

1. Hotel Management is the main product.
2. Hotel Website is an optional add-on.
3. AI is an additional capability, not the core product.
4. Multi-hotel SaaS must be supported from the beginning.
5. Multi-branch operation must be supported.
6. Modules must be optional per hotel or permitted scope.
7. Roles and permissions must be configurable.
8. Backend authorization is mandatory.
9. Customer data must be isolated.
10. Mobile workflows are important.
11. Indian hotel workflows must be supported.
12. The system must be scalable.
13. UI must be professional and consistent.
14. Duplicate sources of truth must be avoided.
15. Real workflows are more important than static demo screens.
16. Important operations need validation and error handling.
17. Sensitive operations must be auditable.
18. AI must operate through controlled tools and permissions.
19. Website booking must use the same availability logic as hotel operations.
20. Shortcuts that make future SaaS scaling difficult must not be introduced.

## 28. Out of Scope for the Current Phase and Initial Release Definition

The following are not being implemented in Phase 2:

- Application source code
- UI pages
- Database migrations
- Database schema implementation
- Dependency installation
- Production deployment
- Live payment integration
- Live UPI or QR provider integration
- Live GST compliance certification
- Live OTA or channel-manager integration
- Native iOS or Android applications
- Unrestricted AI database access
- AI actions without authorization and audit
- Customer data migration execution
- Final pricing or subscription billing setup

The following are potential later-release features unless product prioritization promotes them:

- Advanced OTA and channel-manager synchronization
- Full external accounting integration
- Payroll processing
- Biometric attendance
- IoT and smart-room integrations
- Loyalty and rewards programs
- Marketplace functionality
- Advanced revenue management and automated dynamic pricing
- Multi-country legal and tax certification
- Native mobile applications
- Offline-first operation
- Franchise-wide benchmarking across unrelated customers

These exclusions do not prevent future architecture support. The release scope must be finalized before implementation planning for each later phase.

## 29. Open Decisions Requiring Approval

### 29.1 Product and commercial decisions

- Is one tenant allowed to own multiple hotels, or is one customer hotel the initial tenant boundary?
- Is the term `branch` intended to mean a physical property, an operational department, or both?
- Which modules belong in the first commercial release?
- Which modules can a Hotel Super Admin enable, and which require Internal Super Admin approval?
- What are the initial service plans, limits, trial rules, and suspension rules?
- Will website and AI be separate add-ons, included in plans, or usage-based services?

### 29.2 Regional and finance decisions

- Initial launch country and legal entity
- Required GST invoice fields and tax behavior
- Required invoice numbering rules
- UPI, QR, and online payment providers
- Refund and reconciliation policy
- Supported currencies and future countries
- Required accounting export format

### 29.3 Identity and security decisions

- Authentication and OIDC provider
- Password login versus mandatory enterprise identity
- MFA policy
- SSO requirements
- Customer support access policy
- Data retention and deletion policy
- Compliance targets and required security certifications
- Required audit retention period

### 29.4 Operational decisions

- Required reservation sources
- Overbooking policy
- Walk-in and no-show policy
- Cancellation and refund rules
- Room assignment and room-blocking rules
- POS and room-posting behavior
- Inventory costing method
- Staff attendance requirements
- Required report definitions and export formats

### 29.5 Website and localization decisions

- Website hosting and custom-domain model
- Branding customization limits
- Content approval workflow
- Supported languages
- Translation ownership
- Analytics and cookie consent requirements
- Online check-in requirements
- Guest document requirements

### 29.6 AI decisions

- Initial AI provider and model policy
- Data residency requirements
- Retention of AI conversations
- Knowledge-source approval workflow
- Staff actions AI may perform
- Guest actions AI may perform
- Human escalation channel
- AI usage quotas and cost controls

### 29.7 Architecture and delivery decisions

- Cloud provider and deployment target
- Modular monolith versus service extraction milestones
- API style and versioning policy
- Database tenancy isolation level and operational ownership
- Backup and disaster recovery objectives
- Availability and support SLA
- Data migration sources and import tools

## 30. Conflicts and Clarifications

No blocking product conflict was identified in the supplied requirements. The following terminology and prioritization items need confirmation:

1. **Organization versus hotel:** The requirements use both organization/tenant and customer hotel. This specification treats the organization as the security and service boundary and the hotel as the customer operating entity. The model can support a one-hotel tenant initially and multiple hotels later.
2. **Hotel versus branch:** This specification treats a hotel as a logical hotel entity and a branch as a physical operating property. This should be confirmed before implementation.
3. **The 13 modules:** The list mixes functional modules with role-oriented workspaces, especially Owner / Management and Manager. This specification keeps all 13 required names while treating those two as shared-data workspaces rather than duplicate databases.
4. **Indian and global support:** Indian workflows are a launch requirement, while currency, taxes, timezone, language, payment methods, and invoice rules must remain configurable for future markets.
5. **Website and AI priority:** Both are required platform capabilities but are add-ons to the core hotel management product and should not delay the core operating workflows unless approved.

## 31. Phase 2 Validation Checklist

- [x] Multi-hotel SaaS
- [x] Multi-branch
- [x] Internal Super Admin
- [x] Customer Hotel Super Admin
- [x] 13 customer modules
- [x] Module enable / disable
- [x] Roles
- [x] Permissions
- [x] Tenant isolation
- [x] Rooms
- [x] Booking
- [x] Guests
- [x] Front desk
- [x] Check-in / check-out
- [x] Housekeeping
- [x] Maintenance
- [x] Restaurant / POS
- [x] Inventory
- [x] Staff
- [x] Finance
- [x] Payments
- [x] Reports
- [x] Indian ₹ / UPI / GST-ready architecture
- [x] Hotel website
- [x] Website CMS
- [x] Booking engine
- [x] Guest portal
- [x] AI Staff Assistant
- [x] AI Guest Assistant
- [x] Notifications
- [x] Support
- [x] Audit logs
- [x] Security
- [x] Mobile responsive requirements
- [x] Performance requirements
- [x] SaaS subscription / service architecture

## 32. Phase 2 Completion Report

### What was documented

- Product vision and scope
- Target users and terminology
- Internal platform administration
- Customer Hotel Super Admin responsibilities
- Multi-hotel and multi-branch requirements
- All 13 customer modules
- Module entitlement, scope, and permission rules
- Core hotel operations
- Indian hotel and localization requirements
- Optional website and CMS requirements
- Shared booking engine requirements
- Guest portal requirements
- Staff and guest AI assistant requirements
- Role and permission requirements
- Mobile, notification, security, performance, and UX requirements
- Audit logging
- Data isolation
- Support system
- Subscription and service model
- Product principles
- Current-phase and initial-release exclusions
- Open decisions and requirement clarifications
- Final validation checklist

### Missing requirements

The core product discovery requirements are covered. Final provider, legal, compliance, commercial, reporting, and operational policy decisions remain open as listed in Section 29.

### Conflicting requirements

No blocking conflicts were found. Terminology and module classification clarifications are recorded in Section 30.

### Decisions still requiring approval

- Organization, hotel, and branch semantics
- Initial market and legal/tax requirements
- Initial module and plan scope
- Authentication, payment, messaging, hosting, and AI providers
- Support access, data retention, compliance, and SLA policies
- Initial release prioritization for website, booking, POS, integrations, and AI

### Implementation confirmation

No application code was implemented in Phase 2. No UI pages were created. No database migrations were created. No dependencies were installed. No application source code was modified.

Phase 3 must not begin until this document and the open decisions are approved.
