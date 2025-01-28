## Setup Instructions

1. Create a Virtual Environment (Recommended)

```
python -m venv venv
```

Activate it:

```
source venv/bin/activate
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. Run the FastAPI server

```
uvicorn app.main:app --reload
```

4. Test the API

Once the server is running, open your browser and visit:
- Docs: http://127.0.0.1:8000/docs
- Home: http://127.0.0.1:8000

5. Project structure

```
todo-backend/
|-- app/
|   |-- crud.py       # CRUD operations
|   |-- database.py   # Database connection
|   |-- main.py       # FastAPI entry point
|   |-- models.py     # SQLAlchemy models
|   |-- schemas.py    # Pydantic schemas
|-- venv/             # Virtual environment (ignored)
|-- .gitignore
|-- todo.db           # SQLite database (ignored)
|-- requirements.txt  # Python dependencies  