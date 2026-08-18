from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Building(Base):
    __tablename__ = "buildings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    locations = relationship("Location", back_populates="building")


class Location(Base):
    __tablename__ = "locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    building_id = Column(UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="CASCADE"), nullable=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("locations.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="locations")
    parent = relationship("Location", remote_side=[id], backref="children")
    assets = relationship("Asset", back_populates="location")
    tickets = relationship("Ticket", back_populates="location")
