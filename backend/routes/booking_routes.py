from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=schemas.BookingOut)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check conflicts
    conflicts = db.query(models.Booking).filter(
        models.Booking.classroom_id == booking.classroom_id,
        models.Booking.status == models.BookingStatusEnum.Confirmed,
        models.Booking.end_time > booking.start_time,
        models.Booking.start_time < booking.end_time
    ).first()
    
    if conflicts:
        raise HTTPException(status_code=400, detail="Classroom is already booked for this time slot")
        
    new_booking = models.Booking(
        **booking.model_dump(), 
        user_id=current_user.id
    )
    db.add(new_booking)
    
    # Log usage
    log = models.UsageLog(
        classroom_id=booking.classroom_id,
        user_id=current_user.id,
        action="BOOKED",
        usage_date=datetime.utcnow()
    )
    db.add(log)
    
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get("/", response_model=List[schemas.BookingOut])
def get_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role.value == "Admin":
        return db.query(models.Booking).all()
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()

@router.delete("/{id}")
def cancel_booking(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    booking_query = db.query(models.Booking).filter(models.Booking.id == id)
    booking = booking_query.first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.user_id != current_user.id and current_user.role.value != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
        
    booking.status = models.BookingStatusEnum.Cancelled
    # Log usage cancellation
    log = models.UsageLog(
        classroom_id=booking.classroom_id,
        user_id=current_user.id,
        action="CANCELLED",
        usage_date=datetime.utcnow()
    )
    db.add(log)
    
    db.commit()
    return {"message": "Booking cancelled"}
