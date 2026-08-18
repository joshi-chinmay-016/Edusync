from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class SLAPolicy(Base):
    __tablename__ = "sla_policies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(50), nullable=True) # E.g., 'High', 'Critical'
    category_id = Column(UUID(as_uuid=True), ForeignKey("ticket_categories.id", ondelete="CASCADE"), nullable=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=True)
    response_time_minutes = Column(Integer, nullable=False)
    resolution_time_minutes = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    events = relationship("SLAEvent", back_populates="policy")


class SLAEvent(Base):
    __tablename__ = "sla_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("sla_policies.id", ondelete="CASCADE"), nullable=True)
    event_type = Column(String(100), nullable=False) # e.g., 'SLA_STARTED', 'RESOLUTION_BREACHED'
    timestamp = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    policy = relationship("SLAPolicy", back_populates="events")
    ticket = relationship("Ticket", back_populates="sla_events")
