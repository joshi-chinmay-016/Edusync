from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.ClassroomOut])
def get_classrooms(db: Session = Depends(get_db)):
    return db.query(models.Classroom).all()

@router.post("/", response_model=schemas.ClassroomOut)
def create_classroom(classroom: schemas.ClassroomCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_admin)):
    new_classroom = models.Classroom(**classroom.model_dump())
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    return new_classroom

@router.put("/{id}", response_model=schemas.ClassroomOut)
def update_classroom(id: int, classroom: schemas.ClassroomCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_admin)):
    db_query = db.query(models.Classroom).filter(models.Classroom.id == id)
    db_room = db_query.first()
    
    if db_room == None:
        raise HTTPException(status_code=404, detail="Classroom not found")
        
    db_query.update(classroom.model_dump(), synchronize_session=False)
    db.commit()
    return db_query.first()

@router.delete("/{id}")
def delete_classroom(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_admin)):
    db_query = db.query(models.Classroom).filter(models.Classroom.id == id)
    db_room = db_query.first()
    
    if db_room == None:
        raise HTTPException(status_code=404, detail="Classroom not found")
        
    db_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Classroom removed"}
