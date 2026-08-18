from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    assets = relationship("Asset", back_populates="category")


class Asset(Base):
    __tablename__ = "assets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("asset_categories.id", ondelete="RESTRICT"), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    identifier = Column(String(255), unique=True, index=True, nullable=False)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category = relationship("AssetCategory", back_populates="assets")
    location = relationship("Location", back_populates="assets")
    maintenance_history = relationship("AssetMaintenanceHistory", back_populates="asset")
    tickets = relationship("Ticket", back_populates="asset")


class AssetMaintenanceHistory(Base):
    __tablename__ = "asset_maintenance_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    performed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=False)
    maintenance_date = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    asset = relationship("Asset", back_populates="maintenance_history")
