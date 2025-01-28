from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(routes.router)