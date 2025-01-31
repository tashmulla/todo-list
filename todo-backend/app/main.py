from fastapi import FastAPI, Depends
from app.database import engine, Base
from app import routes

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(routes.router)