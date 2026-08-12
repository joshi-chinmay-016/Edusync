# EduSync V2 — Agent Engineering Contract

## 1. Project Identity

EduSync V2 is an Intelligent Campus Service Management Platform.

The product is NOT a classroom booking or timetable management system.

The primary problem being solved is:

> Automatically understand, route, prioritize, assign and track campus service/support requests until resolution.

Examples:

- IT problems
- Network issues
- Examination issues
- Accounts/payment issues
- Maintenance issues
- Library issues
- Administration issues
- Campus infrastructure problems

---

# 2. Architecture

EduSync uses:

**Modular Monolith + Event-Driven Architecture**

The backend is ONE FastAPI deployable application.

Do NOT create independent microservices unless explicitly requested.

Backend domain modules:

backend/app/

    core/
    auth/
    users/
    tickets/
    departments/
    agents/
    sla/
    incidents/
    knowledge/
    notifications/
    analytics/
    events/

Synchronous business logic should use internal domain/service calls.

Kafka is used for asynchronous domain events and side effects.

---

# 3. Technology Responsibilities

## PostgreSQL

Primary source of truth.

Use PostgreSQL for:

- users
- tickets
- departments
- agents
- assets
- locations
- incidents
- SLA data
- audit data
- outbox events

Do not introduce SQLite for V2.

---

## Redis

Use Redis only where appropriate:

- caching
- rate limiting
- distributed locks
- ephemeral agent presence/state
- WebSocket coordination when horizontally scaling

Do NOT use Redis as the primary application database.

---

## Kafka

Kafka is the durable event bus.

Example events:

- ticket.created
- ticket.classified
- ticket.assigned
- ticket.reassigned
- ticket.escalated
- ticket.resolved
- ticket.closed
- incident.created
- incident.resolved

Do not use Kafka for ordinary synchronous internal function calls.

---

## Celery

Celery is for background/scheduled jobs:

- SLA monitoring
- escalation
- notification retries
- scheduled reports
- heavy background analytics

Do not use Celery as a replacement for Kafka domain events.

---

## WebSockets

WebSockets provide real-time UI updates:

- ticket assignment
- agent queue changes
- incident updates
- notifications
- admin dashboard updates

---

# 4. Transactional Outbox

When a domain operation creates an event:

BEGIN TRANSACTION

1. Modify the domain entity.
2. Insert the corresponding outbox event.

COMMIT

Then the outbox publisher publishes the event to Kafka.

Consumers must be idempotent.

Every event must have a unique event_id.

Assume at-least-once delivery.

Never assume exactly-once delivery.

---

# 5. Core Database Domains

The V2 database contains:

Foundation:

- users
- roles
- departments
- teams
- team_members

Locations:

- buildings
- locations

Assets:

- asset_categories
- assets
- asset_maintenance_history

Agents:

- agents
- agent_availability
- agent_skills

Tickets:

- ticket_categories
- tickets
- ticket_status_history
- ticket_assignments
- ticket_comments
- ticket_attachments

SLA:

- sla_policies
- sla_events

Incidents:

- incidents
- incident_ticket_links

Knowledge:

- knowledge_base_articles

System:

- notifications
- audit_logs
- outbox_events

---

# 6. Product Rules

## Ticket lifecycle

Preferred lifecycle:

OPEN
→ TRIAGED
→ ASSIGNED
→ IN_PROGRESS
→ RESOLVED
→ CLOSED

Additional states may include:

WAITING_FOR_USER
ESCALATED
REOPENED

Do not allow arbitrary invalid state transitions.

---

# 7. AI Rules

AI is an assistant, NOT the authority.

Phase 1:

Natural language ticket
→ category
→ subcategory
→ priority suggestion
→ summary
→ department suggestion

The backend validates AI output.

AI must NOT directly perform privileged actions.

Future phases:

1. Knowledge-base RAG
2. Semantic duplicate detection
3. Incident candidate detection
4. Historical ML prediction

Do not claim predictive ML functionality before sufficient data exists.

---

# 8. Incident Model

Multiple tickets can belong to one incident.

Example:

50 students report WiFi problems in the same building.

These may become:

INCIDENT:
Campus WiFi outage

Do not implement automatic incident detection unless explicitly requested.

---

# 9. Frontend Architecture

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- GSAP
- Three.js
- React Three Fiber
- Drei
- Recharts/D3 when appropriate

Frontend structure:

src/

    app/
    components/
    features/
    layouts/
    pages/
    hooks/
    lib/
    types/
    visualization/

Prefer feature-oriented architecture.

---

# 10. Animation Rules

## Framer Motion

Use for:

- page transitions
- modal transitions
- drawers
- list animations
- layout transitions
- micro-interactions

## GSAP

Use for:

- landing-page storytelling
- scroll-driven animation
- complex animation timelines

## Three.js / React Three Fiber

Use only for meaningful visualization.

Good examples:

- campus operations visualization
- incident relationships
- infrastructure visualization

Do NOT add 3D decoration to every page.

Every WebGL visualization must have a graceful fallback.

---

# 11. Responsive Design

The application must support:

320px
375px
768px
1024px
1440px
1920px

Do not rely on horizontal scrolling for normal application layouts.

Tables, dashboards, charts, ticket views and forms must have mobile layouts.

---

# 12. Navigation Rule

There must be NO dead-end pages.

Every important interactive element must lead somewhere meaningful.

Examples:

Dashboard ticket
→ ticket detail

SLA metric
→ filtered ticket list

Department metric
→ department detail

Incident visualization
→ incident detail

Knowledge article
→ article detail
→ create ticket if unresolved

Ticket creation
→ ticket detail

---

# 13. Data Rules

Do not use hardcoded fake production data.

Development seed data is allowed.

Production-facing UI must consume backend APIs.

Do not hide API failures.

Every data-driven page should support:

- loading
- empty
- error
- success

---

# 14. Security

Never:

- commit secrets
- commit .env files
- hardcode API keys
- expose credentials
- bypass RBAC
- trust client-side authorization
- trust raw LLM output

Validate all inputs server-side.

Use proper authentication and authorization.

---

# 15. Multi-Agent Ownership

Agents must respect file ownership.

## Database Agent

Owns:

- database configuration
- SQLAlchemy models
- Alembic
- migrations
- seed infrastructure

Do NOT modify frontend.

Do NOT implement API routes.

---

## Backend Agent

Owns:

- FastAPI modules
- business logic
- REST APIs
- authentication
- authorization

Do NOT redesign database schema unless explicitly coordinated.

---

## Frontend Agent

Owns:

- React
- TypeScript
- routes
- pages
- components
- layouts
- responsive UI

Do NOT modify backend.

---

## Visualization Agent

Owns:

- Three.js
- R3F
- Drei
- GSAP
- visualization components
- animation utilities

Do NOT rewrite application architecture.

---

## Event Infrastructure Agent

Owns:

- Kafka
- Redis
- Celery
- Outbox publisher
- event consumers
- idempotency

Do NOT change domain models without coordination.

---

## AI Agent

Owns:

- AI classification
- knowledge-base integration
- semantic search
- AI service abstraction

Do NOT bypass backend authorization.

---

## QA Agent

Owns:

- unit tests
- integration tests
- API tests
- frontend tests
- E2E tests
- regression testing

QA should not silently modify production architecture to make tests pass.

---

# 16. General Agent Rules

Before coding:

1. Read AGENTS.md.
2. Read EDUSYNC_V2_MIGRATION_PLAN.md.
3. Inspect the existing implementation.
4. Understand existing conventions.
5. Create a plan.
6. Identify files that will be changed.

During coding:

- Stay within assigned ownership.
- Avoid unrelated refactoring.
- Avoid unnecessary dependencies.
- Do not duplicate existing utilities.
- Reuse existing abstractions when appropriate.

Before finishing:

1. Run tests.
2. Run linting.
3. Run type checking where applicable.
4. Verify the application builds.
5. Review the final diff.
6. Report changed files.
7. Report verification commands.
8. Report unresolved issues.

Never claim a feature works without testing it.

---

# 17. Important Product Principle

EduSync is not trying to demonstrate how many technologies can be used.

Every technology must solve a real engineering problem.

The system should prioritize:

correctness
→ maintainability
→ security
→ usability
→ observability
→ scalability

before visual complexity.
