from sqlalchemy import Column, String, Integer, DateTime, Text, JSON
from app.db.base import Base
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

class OutboxEvent(Base):
    __tablename__ = "outbox_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    aggregate_type = Column(String(100), nullable=False)
    aggregate_id = Column(String(255), nullable=False)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    published_at = Column(DateTime(timezone=True), nullable=True, index=True)
    retry_count = Column(Integer, default=0)
    last_error = Column(Text, nullable=True)
