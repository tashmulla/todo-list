from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, database, schemas

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/todos", response_model=list[schemas.Todo])
def get_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

@router.post("/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)

@router.patch("/todos/{todo_id}/text", response_model=schemas.Todo)
def update_todo_text(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    return crud.update_todo_text(db, todo_id, todo.text)

@router.patch("/todos/{todo_id}/completed", response_model=schemas.Todo)
def update_todo_completed(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    return crud.update_todo_completed(db, todo_id, todo.completed)

@router.delete("/todos/completed", response_model=int)
def delete_completed_todos(db: Session = Depends(get_db)):
    return crud.delete_completed_todos(db)

@router.delete("/todos/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    return crud.delete_todo(db, todo_id)
