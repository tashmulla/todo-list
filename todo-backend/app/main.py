from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import routes

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(routes.router)
# allow CORS for origin http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)