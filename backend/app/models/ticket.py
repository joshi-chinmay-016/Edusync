from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class TicketCategory(Base):
    __tablename__ = "ticket_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("ticket_categories.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    parent = relationship("TicketCategory", remote_side=[id], backref="children")
    tickets = relationship("Ticket", back_populates="category")


class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_number = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("ticket_categories.id", ondelete="RESTRICT"), nullable=True, index=True)

    priority = Column(String(50), nullable=False, index=True) # E.g., 'Low', 'Medium', 'High', 'Critical'
    status = Column(String(50), nullable=False, default="OPEN", index=True)

    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=True, index=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="RESTRICT"), nullable=True, index=True)
    assigned_agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="SET NULL"), nullable=True, index=True)

    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)

    reporter = relationship("User", foreign_keys=[reporter_id])
    category = relationship("TicketCategory", back_populates="tickets")
    department = relationship("Department", back_populates="tickets")
    team = relationship("Team", back_populates="tickets")
    assigned_agent = relationship("Agent", back_populates="assigned_tickets", foreign_keys=[assigned_agent_id])
    location = relationship("Location", back_populates="tickets")
    asset = relationship("Asset", back_populates="tickets")

    status_history = relationship("TicketStatusHistory", back_populates="ticket")
    assignments = relationship("TicketAssignment", back_populates="ticket")
    comments = relationship("TicketComment", back_populates="ticket")
    attachments = relationship("TicketAttachment", back_populates="ticket")
    sla_events = relationship("SLAEvent", back_populates="ticket")
    incident_links = relationship("IncidentTicketLink", back_populates="ticket")


class TicketStatusHistory(Base):
    __tablename__ = "ticket_status_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    ticket = relationship("Ticket", back_populates="status_history")


class TicketAssignment(Base):
    __tablename__ = "ticket_assignments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="SET NULL"), nullable=True)
    assigned_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    assigned_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reason = Column(Text, nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    unassigned_at = Column(DateTime(timezone=True), nullable=True)

    ticket = relationship("Ticket", back_populates="assignments")


class TicketComment(Base):
    __tablename__ = "ticket_comments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    ticket = relationship("Ticket", back_populates="comments")
    author = relationship("User", foreign_keys=[author_id])


class TicketAttachment(Base):
    __tablename__ = "ticket_attachments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=True)
    storage_key = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    ticket = relationship("Ticket", back_populates="attachments")
