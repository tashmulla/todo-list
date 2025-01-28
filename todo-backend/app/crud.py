from sqlalchemy.orm import Session
from app import models, schemas

# Add a new TODO
def create_todo(db: Session, todo: schemas.TodoCreate):
    new_todo = models.Todo(text=todo.text, completed=False)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

# Get all TODOs
def get_todos(db: Session):
    return db.query(models.Todo).all()

# Update a TODO's text
def update_todo_text(db: Session, todo_id: int, text: str):
    todo_to_update = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo_to_update and text is not None:
      todo_to_update.text = text
      db.commit()
      db.refresh(todo_to_update)
    return todo_to_update

# Update a TODO's completed status
def update_todo_completed(db: Session, todo_id: int, completed: bool):
    todo_to_update = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo_to_update and completed is not None:
      todo_to_update.completed = completed
      db.commit()
      db.refresh(todo_to_update)
    return todo_to_update

# Delete a TODO
def delete_todo(db: Session, todo_id: int):
    todo_to_delete = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    db.delete(todo_to_delete)
    db.commit()
    return todo_to_delete

# Clear completed TODOs
def delete_completed_todos(db: Session):
    completed_todos = db.query(models.Todo).filter(models.Todo.completed == True).all()
    for todo in completed_todos:
        db.delete(todo)
    db.commit()
    return len(completed_todos)