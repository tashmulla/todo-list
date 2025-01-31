# Todo Backend - FastAPI & SQLAlchemy

A simple **Todo API** built with **FastAPI**, **SQLAlchemy**, and **SQLite**.

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

### 4️⃣ Test the API is running

Once the server is running, open your browser and visit:
- Docs: http://127.0.0.1:8000/docs

Try out the different endpoints through the Swagger UI.

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

2. From the `todo-backend` directory, run:

```
PYTHONPATH=. pytest -vv
```

This will run the tests in extra verbose mode.