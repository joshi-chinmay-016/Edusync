import pandas as pd
from sqlalchemy.orm import Session
from .data_loader import load_bookings, load_usage_logs
import models

def get_usage_summary(db: Session):
    df = load_bookings(db)
    if df.empty:
        # Get all rooms to populate empty states
        all_rooms = db.query(models.Classroom.room_name).all()
        room_counts = {r[0]: 0 for r in all_rooms}
        return {
            "total_bookings": 0,
            "underutilized": room_counts,
            "most_used": room_counts
        }
    
    # Filter active or completed bookings
    active_bookings = df[df['status'].isin(['Confirmed', 'Completed'])]
    total_bookings = len(active_bookings)
    
    # Group by room_name
    room_counts = active_bookings.groupby('room_name').size().to_dict()
    
    # Ensure all rooms in the database are included
    all_rooms = db.query(models.Classroom.room_name).all()
    for room in all_rooms:
        r_name = room[0]
        if r_name not in room_counts:
            room_counts[r_name] = 0
            
    # Cast count to int for json serialization safety
    room_counts = {str(k): int(v) for k, v in room_counts.items()}
    
    return {
        "total_bookings": total_bookings,
        "underutilized": room_counts,
        "most_used": room_counts
    }

def get_peak_hours(db: Session):
    df = load_bookings(db)
    if df.empty:
        return {"peak_hours": {}}
        
    df['start_time'] = pd.to_datetime(df['start_time'])
    df['hour'] = df['start_time'].dt.hour
    
    hour_counts = df.groupby('hour').size().to_dict()
    hour_counts = {int(k): int(v) for k, v in hour_counts.items()}
    
    return {"peak_hours": hour_counts}
