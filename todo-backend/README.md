# TODO List Backend - FastAPI & SQLAlchemy

A simple **Todo API** built with **FastAPI**, **SQLAlchemy**, and **SQLite**.

## 📚 CRUD Routes

The following CRUD routes are available in the API:

- **Get all todos**
  - **Endpoint:** `GET /todos`
  - **Description:** Retrieve a list of all todos.
  - **Response Model:** `List[schemas.Todo]`

- **Create a new todo**
  - **Endpoint:** `POST /todos`
  - **Description:** Create a new todo item.
  - **Request Model:** `schemas.TodoCreate`
  - **Response Model:** `schemas.Todo`

- **Update todo text**
  - **Endpoint:** `PATCH /todos/{todo_id}/text`
  - **Description:** Update the text of an existing todo item.
  - **Request Model:** `schemas.TodoUpdateText`
  - **Response Model:** `schemas.Todo`

- **Update todo completed status**
  - **Endpoint:** `PATCH /todos/{todo_id}/completed`
  - **Description:** Update the completed status of an existing todo item.
  - **Request Model:** `schemas.TodoUpdateCompleted`
  - **Response Model:** `schemas.Todo`

- **Delete completed todos**
  - **Endpoint:** `DELETE /todos/completed`
  - **Description:** Delete all completed todo items.
  - **Response Model:** `int` (number of deleted items)

- **Delete a todo by ID**
  - **Endpoint:** `DELETE /todos/{todo_id}`
  - **Description:** Delete a specific todo item by its ID.
  - **Response Model:** `schemas.Todo`

## 📌 Setup Instructions

### 1️⃣ Create a Virtual Environment (Recommended)

```
python -m venv venv
```

Activate it:

```
source venv/bin/activate
```

### 2️⃣ Install dependencies

```
pip install -r requirements.txt
```

### 3️⃣ Run the FastAPI server

```
uvicorn app.main:app --reload
```

### 4️⃣ Verify the API is running

Once the server is up, open your browser and visit `http://localhost:8000/docs` to access the Swagger documentation. You can test the different endpoints through the Swagger UI.

Alternatively, you can use Curl or Postman to hit the endpoints at `http://localhost:8000`.

## 🏢 Project Structure

```
todo-backend/
|-- app/
|   |-- crud.py       # CRUD operations
|   |-- database.py   # Database connection
|   |-- main.py       # FastAPI entry point
|   |-- models.py     # SQLAlchemy models
|   |-- routes.py     # FastAPI endpoints
|   |-- schemas.py    # Pydantic schemas
|-- venv/             # Virtual environment (ignored)
|-- .gitignore
|-- todo.db           # SQLite database (ignored)
|-- requirements.txt  # Python dependencies  
|-- tests/
|   |-- test_main.py  # Tests for main.py
```

## 🧪 Running Tests

1. Ensure dependencies are installed, if not, run:

```
pip install -r requirements.txt
```

2. Run all tests from the `todo-backend` directory:

```
PYTHONPATH=. pytest -vv
```

This will run all tests in verbose mode.