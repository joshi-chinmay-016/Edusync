from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class RoleEnum(enum.Enum):
    Admin = "Admin"
    Faculty = "Faculty"
    Student = "Student"

class BookingStatusEnum(enum.Enum):
    Confirmed = "Confirmed"
    Cancelled = "Cancelled"
    Completed = "Completed"

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    bookings = relationship("Booking", back_populates="user")
    usage_logs = relationship("UsageLog", back_populates="user")
    auth_logs = relationship("AuthLog", back_populates="user")

class Classroom(Base):
    __tablename__ = "Classrooms"
    id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String(100), unique=True, index=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    building = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resources = relationship("Resource", back_populates="classroom")
    bookings = relationship("Booking", back_populates="classroom")
    usage_logs = relationship("UsageLog", back_populates="classroom")

class Resource(Base):
    __tablename__ = "Resources"
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("Classrooms.id", ondelete="CASCADE"), nullable=False)
    resource_name = Column(String(100), nullable=False)

    classroom = relationship("Classroom", back_populates="resources")

class Booking(Base):
    __tablename__ = "Bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("Classrooms.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum(BookingStatusEnum), default=BookingStatusEnum.Confirmed)

    user = relationship("User", back_populates="bookings")
    classroom = relationship("Classroom", back_populates="bookings")

class UsageLog(Base):
    __tablename__ = "UsageLogs"
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("Classrooms.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    usage_date = Column(DateTime, nullable=False)

    classroom = relationship("Classroom", back_populates="usage_logs")
    user = relationship("User", back_populates="usage_logs")


class AuthLog(Base):
    __tablename__ = "AuthLogs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="auth_logs")
