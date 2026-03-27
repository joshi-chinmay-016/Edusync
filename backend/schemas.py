from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, BookingStatusEnum

# User schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Classroom schemas
class ClassroomCreate(BaseModel):
    room_name: str
    capacity: int
    building: str

class ClassroomOut(BaseModel):
    id: int
    room_name: str
    capacity: int
    building: str
    
    class Config:
        from_attributes = True

# Resource schemas
class ResourceCreate(BaseModel):
    classroom_id: int
    resource_name: str

class ResourceOut(BaseModel):
    id: int
    classroom_id: int
    resource_name: str
    
    class Config:
        from_attributes = True

# Booking schemas
class BookingCreate(BaseModel):
    classroom_id: int
    start_time: datetime
    end_time: datetime

class BookingOut(BaseModel):
    id: int
    user_id: int
    classroom_id: int
    start_time: datetime
    end_time: datetime
    status: BookingStatusEnum
    
    class Config:
        from_attributes = True

# Analytics & AI schemas
class RecommendationOut(BaseModel):
    message: str


class EventLogCreate(BaseModel):
    action: str
    user_email: Optional[EmailStr] = None
    room_name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
