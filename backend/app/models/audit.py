from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(255), nullable=False)
    metadata_details = Column(JSON, nullable=True) # avoiding `metadata` as it is an SQLAlchemy keyword
    timestamp = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, index=True)

    actor = relationship("User", foreign_keys=[actor_id])
