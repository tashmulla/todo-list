from pydantic import BaseModel
from typing import Optional

class TodoBase(BaseModel):
    text: str

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    text: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True