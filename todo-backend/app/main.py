from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}

@app.get("/todos")
def get_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).all()