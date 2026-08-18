from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Department(Base):
    __tablename__ = "departments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    teams = relationship("Team", back_populates="department")
    tickets = relationship("Ticket", back_populates="department")


class Team(Base):
    __tablename__ = "teams"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    department = relationship("Department", back_populates="teams")
    members = relationship("TeamMember", back_populates="team")
    tickets = relationship("Ticket", back_populates="team")
    agents = relationship("Agent", back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    team = relationship("Team", back_populates="members")
