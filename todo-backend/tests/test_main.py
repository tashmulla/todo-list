import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, get_db, SessionLocal
from app.models import Todo

os.environ["TESTING"] = "1"

@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)  # Clear test DB
    Base.metadata.create_all(bind=engine)  # Recreate schema

def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def setup_todos():
    db = SessionLocal()
    try:
        db.add_all([
            Todo(text="Todo 1", completed=False),
            Todo(text="Todo 2", completed=False),
            Todo(text="Todo 3", completed=True)
        ])
        db.commit()
    finally:
        db.close()

@pytest.fixture(scope="function")
def setup_only_incomplete_todos():
    db = SessionLocal()
    try:
        db.add_all([
            Todo(text="Todo 1", completed=False),
            Todo(text="Todo 2", completed=False),
            Todo(text="Todo 3", completed=False)
        ])
        db.commit()
    finally:
        db.close()

def test_get_todos(setup_todos):
    response = client.get("/todos")
    assert response.status_code == 200
    assert response.json() == [
        {"id": 1, "text": "Todo 1", "completed": False},
        {"id": 2, "text": "Todo 2", "completed": False},
        {"id": 3, "text": "Todo 3", "completed": True}
    ]

def test_create_todo(setup_todos):
    response = client.post("/todos", json={"text": "Todo 4"})
    assert response.status_code == 200
    assert response.json() == {"id": 4, "text": "Todo 4", "completed": False}

def test_create_todo_empty_text(setup_todos):
    response = client.post("/todos", json={"text": ""})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "type": "string_too_short",
                "loc": ["body", "text"],
                "msg": "String should have at least 1 character",
                "input": "",
                "ctx": {"min_length": 1}
            }
        ]
    }

def test_create_todo_missing_text(setup_todos):
    response = client.post("/todos", json={})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "loc": ["body", "text"],
                "msg": "Field required",
                "type": "missing",
                "input": {}
            }
        ]
    }

def test_create_todo_whitespace_text(setup_todos):
    response = client.post("/todos", json={"text": "   "})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "ctx": {
                    "error": {},
                },
                "input": "   ",
                "loc": ["body", "text"],
                "msg": "Value error, Text cannot be only whitespace",
                "type": "value_error"
            }
        ]
    }
    
def test_create_duplicate_todo_text(setup_todos):
    response = client.post("/todos", json={"text": "Todo 1"})
    assert response.status_code == 409
    assert response.json() == {"detail": "TODO already exists"}

def test_update_todo_text(setup_todos):
    response = client.patch("/todos/1/text", json={"text": "Updated Todo 1"})
    assert response.status_code == 200
    assert response.json() == {"id": 1, "text": "Updated Todo 1", "completed": False}

def test_update_todo_text_empty_text(setup_todos):
    response = client.patch("/todos/1/text", json={"text": ""})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "type": "string_too_short",
                "loc": ["body", "text"],
                "msg": "String should have at least 1 character",
                "input": "",
                "ctx": {"min_length": 1}
            }
        ]
    }

def test_update_todo_text_missing_text(setup_todos):
    response = client.patch("/todos/1/text", json={})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "loc": ["body", "text"],
                "msg": "Field required",
                "type": "missing",
                "input": {}
            }
        ]
    }

def test_update_todo_text_no_change(setup_todos):
    response = client.patch("/todos/1/text", json={"text": "Todo 1"})
    assert response.status_code == 204

def test_update_todo_text_invalid_id(setup_todos):
    response = client.patch("/todos/999/text", json={"text": "Updated Todo 1"})
    assert response.status_code == 404
    assert response.json() == {"detail": "TODO not found"}
    
def test_update_todo_text_whitespace_text(setup_todos):
    response = client.patch("/todos/1/text", json={"text": "   "})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "ctx": {
                    "error": {},
                },
                "input": "   ",
                "loc": ["body", "text"],
                "msg": "Value error, Text cannot be only whitespace",
                "type": "value_error"
            }
        ]
    }

def test_update_todo_completed(setup_todos):
    response = client.patch("/todos/1/completed", json={"completed": True})
    assert response.status_code == 200
    assert response.json() == {"id": 1, "text": "Todo 1", "completed": True}

def test_update_todo_completed_no_change(setup_todos):
    response = client.patch("/todos/1/completed", json={"completed": False})
    assert response.status_code == 204

def test_update_todo_completed_missing_completed(setup_todos):
    response = client.patch("/todos/1/completed", json={})
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "loc": ["body", "completed"],
                "msg": "Field required",
                "type": "missing",
                "input": {}
            }
        ]
    }

def test_update_todo_completed_invalid_id(setup_todos):
    response = client.patch("/todos/999/completed", json={"completed": True})
    assert response.status_code == 404
    assert response.json() == {"detail": "TODO not found"}

def test_delete_todo(setup_todos):
    response = client.delete("/todos/1")
    assert response.status_code == 200
    assert response.json() == {"id": 1, "text": "Todo 1", "completed": False}

def test_delete_todo_invalid_id(setup_todos):
    response = client.delete("/todos/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "TODO not found"}

def test_delete_completed_todos(setup_todos):
    response = client.delete("/todos/completed")
    assert response.status_code == 200
    assert response.json() == 1

def test_delete_completed_todos_no_completed_todos(setup_only_incomplete_todos):
    response = client.delete("/todos/completed")
    assert response.status_code == 200
    assert response.json() == 0