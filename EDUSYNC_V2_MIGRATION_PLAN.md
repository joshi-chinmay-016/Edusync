# EduSync V2: Intelligent Campus Service Management Platform
## Repository Audit and Architecture Blueprint (Revised)

### 1. Architecture Correction: Modular Monolith with Event-Driven Architecture
EduSync V2 will transition to a **Modular Monolith with Event-Driven Architecture**. The core FastAPI application will remain a single deployable application structured with clear internal domain boundaries. Independent microservices are explicitly discouraged at this stage. Kafka will handle asynchronous domain events, while synchronous internal calls will be handled via standard domain module imports.

**Core Directory Structure:**
```
backend/app/
├── core/
├── auth/
├── users/
├── tickets/
├── departments/
├── agents/
├── sla/
├── incidents/
├── knowledge/
├── notifications/
├── analytics/
└── events/
```

### 2. Technology Responsibilities
- **PostgreSQL:** Source of truth for all transactional application data.
- **Redis:** Used exclusively for caching, rate limiting, distributed locks, ephemeral agent presence/state, and optional WebSocket event coordination when horizontally scaling. (Not the primary WS session store).
- **Kafka:** Used for durable domain events and asynchronous consumers (e.g., event distribution for `ticket.created`, `ticket.classified`, `ticket.assigned`, `incident.created`, etc.).
- **Celery:** Used for background/scheduled execution (e.g., SLA monitoring, escalation jobs, notification retries, scheduled reports, heavy analytics).
- **WebSockets:** Real-time UI updates (e.g., ticket assignment, agent queue changes, incident updates, notifications, admin operational dashboards).

### 3. Transactional Outbox Pattern
To prevent database and event broker inconsistencies, the Transactional Outbox Pattern is a first-class architectural component.
**Flow:**
```
BEGIN TRANSACTION
1. Insert target entity (e.g., ticket)
2. Insert outbox event
COMMIT
```
A background publisher reads from the outbox table and publishes to Kafka. Consumers must be idempotent, relying on the `event_id` to handle at-least-once delivery semantics gracefully.

### 4. Database Model Expansion
The PostgreSQL schema expands from the initial V1 state to encompass comprehensive helpdesk models:
- **Locations & Assets:** `locations`, `buildings`, `assets`, `asset_categories`, `asset_maintenance_history`. (No QR codes).
- **Users & Teams:** `users`, `roles`, `departments`, `teams`, `team_members`, `agents`, `agent_availability`, `agent_skills`.
- **Tickets:** `tickets` (with relationships to reporter, category, subcategory, department, team, assigned agent, location, asset). Timestamps: `created_at`, `updated_at`, `assigned_at`, `resolved_at`, `closed_at`.
- **Ancillary:** `ticket_categories`, `ticket_assignments`, `ticket_comments`, `ticket_attachments`, `sla_policies`, `sla_events`, `notifications`, `audit_logs`, `outbox_events`, `knowledge_base_articles`.

### 5. Incident Management
Incident management is a major product capability modeling a Many-to-One relationship (`Many tickets -> One incident`).
- **Model:** Tracks `severity`, `status`, `affected users`, `affected location`, `related tickets`, `assigned team`, `timeline`, `resolution`.
- **Note:** Automatic incident detection is planned for future ML implementations. The current phase is strictly domain modeling and manual linking.

### 6. AI Roadmap
- **Phase 1:** AI-assisted ticket classification (Natural language input -> category, subcategory, priority, summary, department suggestion). Backend validates before application; AI does not perform authorized actions.
- **Phase 2:** Knowledge-base assisted support / RAG.
- **Phase 3:** Semantic duplicate-ticket detection and incident candidate detection.
- **Phase 4:** Historical ML (ticket volume forecasting, SLA breach prediction, workload forecasting). Requires substantial historical data.

### 7. Asset and Location Model
Assets are first-class entities belonging to locations (e.g., projector, computer, smart board). Tickets directly reference these assets to enable future maintenance analytics. QR-code functionality is strictly forbidden.

### 8. Frontend Architecture
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod.
- **Visuals:**
  - *Framer Motion:* Page transitions, layouts, modals, micro-interactions, list animations.
  - *GSAP:* Landing-page storytelling, scroll-driven sequences, complex timelines.
  - *Three.js/R3F/Drei:* Meaningful operational visualization, incident relationships. Must provide 2D/static fallbacks.
  - *Recharts/D3:* Analytics dashboards.
- *Rule:* 3D is strictly for meaningful visualizations, not global decoration.

### 9. Responsive Design
The UI must strictly support breakpoints: `320px`, `375px`, `768px`, `1024px`, `1440px`, `1920px`. Horizontal scrolling is prohibited for standard layouts. Tables, charts, and ticket details must degrade gracefully to mobile views.

### 10. No Dead-End Navigation
Every major UI component must route to a logical destination.
- Dashboard ticket card -> `/tickets/:id`
- SLA breach metric -> filtered ticket list
- Department metric -> `/admin/departments/:id`
- Knowledge article -> article detail or "Create Ticket"

### 11. Migration Strategy: Preserve Existing V1 Until V2 Works
V1 files and functionalities must remain operational until the V2 foundation (DB, Auth, Ticket Workflow) is fully stood up, tested, and passing integration requirements. Only then will legacy booking/classroom models and files be deprecated.

### 12. Implementation Boundary (Agent Ownership)
- **Backend Core Agent:** Owns `backend/app/core`, auth, users, tickets, departments, agents, SLA logic.
- **Database Agent:** Owns SQLAlchemy models, Alembic migrations, PostgreSQL configuration, indexes, seed data.
- **Frontend Agent:** Owns frontend app, routes, layouts, pages, design system, responsive UI.
- **Visualization/Motion Agent:** Owns Three.js/R3F, GSAP, animation utilities.
- **Event Infrastructure Agent:** Owns Kafka, Redis, Celery, Outbox publisher, consumers, idempotency.
- **AI Agent:** Owns AI classification, KB integration, semantic search.
- **QA Agent:** Owns unit/integration/API/E2E testing.

---

### Final Architectural Deliverables

#### 1. Revised Architecture Diagram (Text)
```text
[Frontend (React/Vite)] --> (REST / WS) --> [FastAPI Modular Monolith]
                                                |-- Core
                                                |-- Auth / Users
                                                |-- Tickets / Incidents
                                                |-- Agents / Teams
                                                |-- SLA / Analytics
                                                |-- Events / Outbox

[FastAPI Modular Monolith] <--> [PostgreSQL] (Primary Data + Outbox Table)
[FastAPI Modular Monolith] <--> [Redis] (Cache, Rate Limit, Locks, WS Pub/Sub)

[Outbox Publisher (Cron/Background)] -> Reads Outbox -> Publishes -> [Kafka]

[Kafka] --> [Event Consumers] --> Trigger Actions
[Celery] --> (SLA Checks, Escalations, Reports) --> DB / Notifications
```

#### 2. Revised Database Model Summary
- **Foundation:** `locations`, `buildings`, `departments`, `teams`, `users`, `roles`.
- **Assets:** `assets`, `asset_categories`, `asset_maintenance_history`.
- **Ticketing:** `tickets`, `ticket_categories`, `ticket_status_history`, `ticket_comments`, `ticket_attachments`, `incidents`, `incident_ticket_links`.
- **Agents & Automation:** `agents`, `agent_availability`, `agent_skills`, `team_members`, `sla_policies`, `sla_events`.
- **System:** `outbox_events`, `audit_logs`, `notifications`, `knowledge_base_articles`.

#### 3. Event Flow (Transactional Outbox)
1. Request arrives to create a Ticket.
2. DB Transaction Begins.
3. `Ticket` record inserted.
4. `Outbox_Event` record (`ticket.created`) inserted.
5. DB Transaction Commits.
6. Celery/Background Publisher polls/streams Outbox, pushes to Kafka.
7. Kafka Consumer receives event (idempotency checked via `event_id`).
8. Consumer executes side-effects (e.g., Slack notification, SLA start).

#### 4. Technology Responsibility Matrix
| Technology | Role | Domain Usage |
| :--- | :--- | :--- |
| **PostgreSQL** | Primary Datastore | Relational data, Transactional Outbox |
| **Redis** | In-Memory / Caching | Agent status, rate limiting, locks, WS node sync |
| **Kafka** | Message Broker | Asynchronous domain events (`ticket.*`) |
| **Celery** | Task/Job Queue | Scheduled tasks, SLA sweeps, heavy background jobs |
| **WebSockets**| Real-Time Comms | UI live updates (agent queues, incident boards) |

#### 5. Route Map
- **Public:** `/`, `/login`, `/register`
- **Student/Faculty:** `/dashboard`, `/tickets`, `/tickets/new`, `/tickets/:id`, `/knowledge`, `/notifications`, `/profile`
- **Agent:** `/agent`, `/agent/queue`, `/agent/tickets/:id`
- **Admin:** `/admin`, `/admin/tickets/:id`, `/admin/departments/:id`, `/admin/agents`, `/admin/incidents/:id`, `/admin/analytics`, `/admin/sla`, `/admin/knowledge`, `/admin/settings`

#### 6. Agent Ownership Boundaries
- **Backend Core:** Business logic and REST API.
- **Database:** Schemas, models, migrations.
- **Frontend:** Standard React UI and state.
- **Visualization/Motion:** Complex GSAP timelines and R3F canvases.
- **Event Infra:** Broker setup, publishers, consumers.
- **AI:** Prompt engineering and API abstraction.
- **QA:** All test suites.

#### 7. Dependency Order Between Agents
1. Database Agent (Models/Migrations)
2. Backend Core Agent (CRUD APIs) & Event Infra Agent (Broker/Outbox)
3. Frontend Agent (Routing/Base UI)
4. AI Agent (Classification hooks)
5. Visualization Agent (Dashboards/Maps)
6. QA Agent (Continuous throughout phases)

#### 8. Safe Migration Sequence
1. Stand up Docker (Postgres, Redis, Kafka).
2. Create V2 database schema alongside V1.
3. Build Modular Monolith structure in backend.
4. Implement Tickets/Users core logic.
5. Build V2 Frontend components and routes.
6. Verify end-to-end V2 flows (Ticket Creation -> Outbox -> Event).
7. Execute Deprecation of legacy `Classroom`/`Booking` modules in both Backend and Frontend.

#### 9. Risks and Tradeoffs
- **Outbox Overhead:** Requires polling or WAL tailing (Debezium); polling is easier but adds latency.
- **Modulith Complexity:** Requires strict discipline from Backend Agents to not tightly couple internal domains, relying on Kafka for cross-domain side-effects.
- **3D Degradation:** Failing to provide 2D fallbacks on low-end hardware will severely impact user experience.
- **V1/V2 Coexistence:** Running both side-by-side during development may increase build times and repository bloat temporarily.
