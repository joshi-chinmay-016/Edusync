from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    incident_number = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False) # e.g. 'SEV-1', 'SEV-2', 'SEV-3'
    status = Column(String(50), nullable=False, default="INVESTIGATING") # 'INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED'

    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    department = relationship("Department")
    team = relationship("Team")
    location = relationship("Location")
    ticket_links = relationship("IncidentTicketLink", back_populates="incident")


class IncidentTicketLink(Base):
    __tablename__ = "incident_ticket_links"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="ticket_links")
    ticket = relationship("Ticket", back_populates="incident_links")
