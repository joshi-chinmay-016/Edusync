import pandas as pd
from sqlalchemy.orm import Session
import models

def load_usage_logs(db: Session) -> pd.DataFrame:
    query = db.query(
        models.UsageLog.classroom_id,
        models.UsageLog.action,
        models.UsageLog.usage_date,
        models.Classroom.room_name
    ).join(models.Classroom, models.UsageLog.classroom_id == models.Classroom.id).statement
    
    df = pd.read_sql(query, db.bind)
    return df

def load_bookings(db: Session) -> pd.DataFrame:
    query = db.query(
        models.Booking.classroom_id,
        models.Booking.start_time,
        models.Booking.end_time,
        models.Booking.status,
        models.Classroom.room_name
    ).join(models.Classroom, models.Booking.classroom_id == models.Classroom.id).statement
    
    df = pd.read_sql(query, db.bind)
    return df
