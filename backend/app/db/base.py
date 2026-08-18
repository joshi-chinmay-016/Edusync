from sqlalchemy.orm import declarative_base

Base = declarative_base()

import models # import v1 models for the baseline
from app.models.organization import Department, Team, TeamMember
from app.models.location import Building, Location
from app.models.asset import AssetCategory, Asset, AssetMaintenanceHistory
from app.models.agent import Agent, AgentSkill, AgentAvailability
from app.models.sla import SLAPolicy, SLAEvent
from app.models.ticket import TicketCategory, Ticket, TicketStatusHistory, TicketAssignment, TicketComment, TicketAttachment
from app.models.incident import Incident, IncidentTicketLink
from app.models.knowledge import KnowledgeBaseArticle
from app.models.notification import Notification
from app.models.audit import AuditLog
from app.models.outbox import OutboxEvent
