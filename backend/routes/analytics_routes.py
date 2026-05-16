from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import auth
import models, schemas
from datetime import datetime

from ai_module import usage_analysis, prediction_model, recommendations

router = APIRouter()

@router.get("/usage")
def get_usage(db: Session = Depends(get_db), current_user = Depends(auth.get_current_active_admin)):
    return usage_analysis.get_usage_summary(db)

@router.get("/peak-hours")
def get_peak_hours(db: Session = Depends(get_db), current_user = Depends(auth.get_current_active_admin)):
    return usage_analysis.get_peak_hours(db)

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db), current_user = Depends(auth.get_current_active_admin)):
    return recommendations.generate_recommendations(db)

@router.get("/predict-demand")
def predict_demand(db: Session = Depends(get_db), current_user = Depends(auth.get_current_active_admin)):
    return prediction_model.train_and_predict(db)


@router.post("/log")
def log_event(event: schemas.EventLogCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user_optional)):
    # Determine which user this event belongs to
    user = current_user
    if not user and event.user_email:
        user = db.query(models.User).filter(models.User.email == event.user_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found for logging")

    action = (event.action or "").upper()

    if action in ["LOGIN", "LOGOUT"]:
        log = models.AuthLog(user_id=user.id, action=action)
        db.add(log)
        db.commit()
        return {"message": "Auth event logged"}

    # For booking / cancellation events set up classroom reference
    classroom = None
    if event.room_name:
        classroom = db.query(models.Classroom).filter(models.Classroom.room_name == event.room_name).first()

    if not classroom:
        raise HTTPException(status_code=400, detail="Classroom not found for logging")

    log = models.UsageLog(
        classroom_id=classroom.id,
        user_id=user.id,
        action=action,
        usage_date=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    return {"message": "Usage event logged"}
