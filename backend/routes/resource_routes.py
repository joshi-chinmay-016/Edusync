from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.ResourceOut)
def create_resource(resource: schemas.ResourceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_admin)):
    new_resource = models.Resource(**resource.model_dump())
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

@router.get("/{classroom_id}", response_model=List[schemas.ResourceOut])
def get_classroom_resources(classroom_id: int, db: Session = Depends(get_db)):
    resources = db.query(models.Resource).filter(models.Resource.classroom_id == classroom_id).all()
    return resources
