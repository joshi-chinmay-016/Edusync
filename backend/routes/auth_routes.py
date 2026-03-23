from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid Credentials")
        
    if not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=403, detail="Invalid Credentials")
        
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role.value})

    # Log login event
    log = models.AuthLog(user_id=user.id, action="LOGIN")
    db.add(log)
    db.commit()

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    log = models.AuthLog(user_id=current_user.id, action="LOGOUT")
    db.add(log)
    db.commit()
    return {"message": "Logged out"}


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
