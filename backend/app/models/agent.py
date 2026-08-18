from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Time
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Agent(Base):
    __tablename__ = "agents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    team = relationship("Team", back_populates="agents")
    skills = relationship("AgentSkill", back_populates="agent")
    availability = relationship("AgentAvailability", back_populates="agent")
    assigned_tickets = relationship("Ticket", back_populates="assigned_agent", foreign_keys="[Ticket.assigned_agent_id]")


class AgentSkill(Base):
    __tablename__ = "agent_skills"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(255), nullable=False)

    agent = relationship("Agent", back_populates="skills")


class AgentAvailability(Base):
    __tablename__ = "agent_availability"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(Integer, nullable=False) # 0 = Monday, 6 = Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)

    agent = relationship("Agent", back_populates="availability")
