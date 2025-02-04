from sqlalchemy import Column, Integer, String, Boolean
from .database import Base
import os
from dotenv import load_dotenv

load_dotenv()

class Todo(Base):
    __tablename__ = os.getenv("TABLE_NAME")

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False)