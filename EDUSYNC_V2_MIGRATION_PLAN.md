# EduSync V2: Intelligent Campus Service Management Platform
## Repository Audit and Migration Plan

### 1. Current Architecture
**Frontend:**
- **Framework:** React, Vite, Tailwind CSS.
- **Routing:** React Router v6 used in `App.jsx`.
- **State Management:** Local React state, local storage, some Supabase integration.
- **Pages/Components:** `Dashboard.jsx`, `Login.jsx`, `Classrooms.jsx`, `Bookings.jsx`, `LandingPage.jsx`, `Chatbot.jsx`, `ResourceLocator.jsx`, `Profile.jsx`, `SpatialMap.jsx`, `AdminAnalytics.jsx`, `SmartScheduler.jsx`.
- **Auth:** Supabase authentication configured.
- **Animations/Visuals:** Framer Motion and Lottie Files used for loading states.

**Backend:**
- **Framework:** FastAPI.
- **Database ORM:** SQLAlchemy with Supabase PostgreSQL (fallbacks to SQLite).
- **Structure:** Modularized routes (`auth`, `classrooms`, `resources`, `bookings`, `analytics`).
- **Models:** Built around `User`, `Classroom`, `Resource`, `Booking`, `UsageLog`, `AuthLog`.
- **Auth:** Custom JWT-based auth flows or Supabase dependent.

**Infrastructure:**
- **Docker:** Simple `docker-compose.yml` for local development. `backend/Dockerfile` exists.
- **Containerization:** Frontend missing a clear `Dockerfile` for the `docker-compose.yml` service.

### 2. Current Problems
**Frontend:**
- **Navigation/Routes:** Heavy reliance on role-based rendering inside the header; navigation lacks comprehensive routing maps required for a robust multi-persona (Admin, Agent, Student/Faculty) application.
- **State & Data:** Highly mocked data (e.g., hardcoded classrooms and bookings inside `App.jsx` state) rather than robust API-driven state management.
- **Dead-end Pages:** Missing deep linking and relational navigation (e.g., clicking a resource doesn't provide contextual paths).

**Backend:**
- **SQLite Leftovers:** `database.py` still checks for SQLite compatibility (`check_same_thread: False`), which should be removed for a pure PostgreSQL application.
- **Domain Mismatch:** Highly coupled to the old "Classroom Booking" domain (`Classroom`, `Booking`, `Resource`).
- **Missing Architecture Patterns:** Lacks Event-Driven structure (no Kafka, Redis, or Celery). Highly synchronous REST APIs.

**Infrastructure:**
- `docker-compose.yml` expects a `frontend/Dockerfile` that doesn't exist.
- Deployment assumptions are tightly coupled to single-node container deployment without scalable queueing/messaging.

### 3. Features Worth Keeping
- **Basic Foundation:** React/Vite/Tailwind setup, FastAPI core structure, SQLAlchemy (for PostgreSQL), Pydantic schemas setup.
- **User Authentication:** Supabase setup and JWT flow logic (can be adapted).
- **Docker Setup:** The core idea of containerized separation between Frontend and Backend.

### 4. Features to Remove / Deprecate
- **Models & Schemas:** `Classroom`, `Resource`, `Booking`, `UsageLog` domain models and APIs.
- **Routes:** `classroom_routes.py`, `resource_routes.py`, `booking_routes.py`.
- **Frontend Components:** `Classrooms.jsx`, `Bookings.jsx`, `ResourceLocator.jsx`, `SmartScheduler.jsx`, `SpatialMap.jsx`.
- **QR Code Features:** Any implicit references or usage of check-in/check-out flows.

### 5. Proposed EduSync V2 Architecture
EduSync V2 will transition to an **Event-Driven Microservices-oriented Architecture (EDA)** focusing on Helpdesk and Campus Service Management.

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP (for storytelling), Three.js (for network/campus viz), React Query (data fetching), Zod (validation).
- **Backend Core:** FastAPI (REST & WebSockets).
- **Database:** PostgreSQL (Primary OLTP).
- **Message Broker:** Kafka (for asynchronous domain events).
- **Caching & Quick Storage:** Redis (for session caching, rate limiting, and real-time queues).
- **Background Workers:** Celery (for SLA monitoring, escalation triggers, report generation).

### 6. Proposed Database Schema (PostgreSQL)
- **Users & Access:**
  - `users` (id, name, email, role_id)
  - `roles` (id, name, permissions)
  - `departments` (id, name)
  - `teams` (id, department_id, name)
- **Agents:**
  - `agents` (id, user_id, team_id, workload_capacity)
  - `agent_skills` (agent_id, skill_name, proficiency)
- **Tickets:**
  - `ticket_categories` (id, name, parent_id)
  - `tickets` (id, title, description, user_id, category_id, status, priority)
  - `ticket_assignments` (id, ticket_id, agent_id, assigned_at)
  - `ticket_status_history` (id, ticket_id, status, changed_by, changed_at)
  - `ticket_comments` (id, ticket_id, user_id, content, is_internal)
  - `ticket_attachments` (id, ticket_id, file_url)
- **SLAs & Automation:**
  - `sla_policies` (id, category_id, priority, resolve_within_mins)
  - `sla_events` (id, ticket_id, breach_time, status)
- **Incidents & Operations:**
  - `incidents` (id, title, status, severity)
  - `incident_ticket_links` (incident_id, ticket_id)
- **System:**
  - `notifications` (id, user_id, type, message, read)
  - `audit_logs` (id, action, entity, user_id, timestamp)
  - `outbox_events` (id, aggregate_id, type, payload, published)
  - `knowledge_base_articles` (id, title, content, category_id)

### 7. Proposed API Architecture
- **Protocol:** RESTful JSON over HTTP for CRUD; WebSockets for real-time notifications/chat.
- **Namespaces:**
  - `/api/v1/auth/*`
  - `/api/v1/tickets/*` (CRUD, Assign, Resolve)
  - `/api/v1/agents/*` (Queues, Skills)
  - `/api/v1/admin/*` (SLA, Incidents, Analytics)
  - `/api/v1/knowledge/*`
- **Pattern:** Controller -> Service -> Repository. Services emit events via Outbox Pattern to Kafka.

### 8. Proposed Event Architecture
**Domain Events:**
- `ticket.created`, `ticket.classified`, `ticket.assigned`, `ticket.reassigned`, `ticket.escalated`, `ticket.resolved`, `ticket.closed`, `incident.created`, `incident.resolved`.

**Technology Mapping:**
- **Kafka:** Publish/Subscribe for domain events. When `ticket.created` is emitted, consumers will handle: Assignment Logic, Notification Dispatch, and SLA Tracker initialization.
- **Redis:** Real-time agent status tracking, caching Knowledge Base articles, websocket session storage.
- **Celery:** Scheduled cron jobs (e.g., checking SLA breaches every minute) and heavy report generation.

### 9. Proposed Frontend Architecture
- **Tech Stack:** React (TypeScript), Vite, Tailwind.
- **State/Fetch:** TanStack Query for server state; Context API for local UI state.
- **Forms:** React Hook Form + Zod.
- **Visuals:**
  - *Framer Motion:* Micro-interactions and page transitions.
  - *GSAP:* Scroll-based storytelling on the Landing Page.
  - *Three.js/React Three Fiber:* Interactive campus incident visualization map.
  - *Recharts/D3:* Admin analytics dashboards.

### 10. Route Map
**Public:**
- `/`, `/login`, `/register`
**Student/Faculty:**
- `/dashboard`, `/tickets`, `/tickets/new`, `/tickets/:id`, `/knowledge`, `/notifications`, `/profile`
**Agent:**
- `/agent`, `/agent/queue`, `/agent/tickets/:id`
**Admin:**
- `/admin`, `/admin/tickets`, `/admin/tickets/:id`, `/admin/departments`, `/admin/departments/:id`, `/admin/agents`, `/admin/incidents`, `/admin/incidents/:id`, `/admin/analytics`, `/admin/sla`, `/admin/knowledge`, `/admin/audit`, `/admin/settings`

### 11. Migration Strategy
1. **Foundation:** Clean up V1 files (delete booking/classroom files). Create new folder structures. Update dependencies (add TS, Kafka clients, Redis).
2. **Database:** Create and run Alembic migrations for the new schema. Drop old tables.
3. **Backend Core:** Implement new Models and basic REST CRUD routes for Tickets and Users.
4. **Frontend Core:** Setup React Router with new paths. Build layout and authentication context.
5. **Event System:** Stand up Kafka and Redis in `docker-compose.yml`. Implement Producer/Consumer logic for Tickets.
6. **Advanced Features:** Implement SLA tracking (Celery), WebSocket notifications, and Data visualizations (Three.js/Recharts).

### 12. Risks
- **Data Loss:** Dropping old tables. (Ensure old data is exported if needed, though this is a hard pivot).
- **Complexity:** Introducing Kafka and Celery increases operational overhead. Ensure robust Docker compose setup.
- **UI Overhead:** Unnecessary usage of Three.js or GSAP could bloat the frontend. Adhere strictly to using them only for meaningful visualizations (e.g., incident network mapping).

### 13. Recommended Implementation Order
1. Repo Cleanup & Deprecation (Delete V1 artifacts).
2. Infrastructure Setup (Dockerize Postgres, Redis, Kafka).
3. Database Modeling & Migration scripts.
4. Backend API - Core ticketing system.
5. Frontend - Core UI, Routing, Forms (React Query).
6. Backend - Event-driven integrations (Kafka/Celery).
7. Frontend - Real-time updates and Visualizations (Three.js/D3).
8. Analytics and AI Helpdesk enhancements.

### 14. Which Files Should Be Modified
- `README.md` (Update project description and architecture)
- `docker-compose.yml` (Add Redis, Kafka, Celery, fix Frontend Dockerfile path)
- `backend/database.py` (Remove SQLite fallback, enforce clean Postgres)
- `backend/main.py` (Update route registrations)
- `backend/models.py` (Replace entire schema)
- `backend/schemas.py` (Replace entire schema)
- `frontend/src/App.jsx` (Total rewrite for new routing)
- `frontend/package.json` (Add TS, Framer Motion, GSAP, Three.js, React Query, Zod)
- `backend/requirements.txt` (Add Kafka, Redis, Celery, Alembic)

### 15. Which Files Should Be Deleted
- `backend/routes/classroom_routes.py`
- `backend/routes/resource_routes.py`
- `backend/routes/booking_routes.py`
- `frontend/src/components/Classrooms.jsx`
- `frontend/src/components/Bookings.jsx`
- `frontend/src/components/ResourceLocator.jsx`
- `frontend/src/components/SpatialMap.jsx`
- `frontend/src/components/SmartScheduler.jsx`
- `backend/seed.py` (or completely rewritten)
- `database/` folder (Legacy SQL scripts)

### 16. Which Files Should Be Newly Created
- `frontend/Dockerfile` (to fix compose setup)
- `backend/alembic.ini` and `backend/migrations/` (for DB migrations)
- `backend/kafka_producer.py`, `backend/kafka_consumer.py`
- `backend/celery_worker.py`
- `backend/routes/ticket_routes.py`, `backend/routes/agent_routes.py`, `backend/routes/admin_routes.py`
- `frontend/src/pages/` (New directory for standard pages: `Dashboard`, `TicketDetail`, `AgentQueue`, etc.)
- `frontend/src/components/IncidentMap.jsx` (Three.js implementation)
