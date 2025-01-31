from pydantic import BaseModel, Field, field_validator

class TodoBase(BaseModel):
    text: str = Field(..., min_length=1, description="Text cannot be empty")
    
    @field_validator("text")
    @classmethod
    def no_only_whitespace(cls, value):
        if value.strip() == "":
            raise ValueError("Text cannot be only whitespace")
        return value

class TodoCreate(TodoBase):
    pass

class TodoUpdateText(TodoBase):
    text: str = Field(..., min_length=1, description="Text cannot be empty")

class TodoUpdateCompleted(BaseModel):
    completed: bool = Field(..., description="Completed status cannot be empty")

class Todo(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True