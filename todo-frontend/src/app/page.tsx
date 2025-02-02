'use client';

import { useEffect, useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8000/todos')
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => {
        console.error('Error fetching todos:', err);
      });
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos([...todos, addedTodo]);
      } else {
        console.error('Failed to add todo:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleCompleted = async (id: number, currentStatus: boolean) => {
    // Use API endpoint to update completed status of todo
    try {
      const response = await fetch(
        `http://localhost:8000/todos/${id}/completed`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !currentStatus }),
        }
      );

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos
            .map((todo) => (todo.id === id ? updatedTodo : todo))
            .sort((a, b) => Number(a.completed) - Number(b.completed))
        );
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        console.error('Failed to delete todo:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEditStart = (id: number, text: string) => {
    setEditId(id);
    setEditValue(text);
  };

  const handleEditSave = async (id: number) => {
    if (
      !editValue.trim() ||
      editValue === todos.find((todo) => todo.id === id)?.text
    ) {
      setEditId(null);
      setEditValue('');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}/text`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editValue }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
        setEditId(null);
        setEditValue('');
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      setEditId(null);
      setEditValue('');
    }
  };

  const countPendingTodos = todos.filter((todo) => !todo.completed).length;
  const countCompletedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: 'var(--background)' }}
    >
      <header className="w-full max-w-3xl text-center py-4">
        <h1 className="text-4xl font-bold">What needs doing today?</h1>
        <p className="text-lg mt-2">Organise your tasks, feel good.</p>
      </header>

      <main className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mt-6">
        <section className="mb-6">
          <form className="flex mt-4" onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Enter your task"
              value={newTodo}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
            >
              Add
            </button>
          </form>
        </section>

        <section>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">TODOs</h2>
            <div className="font-semibold gap-1.5 flex">
              <span className="bg-white text-blue-500 px-3 py-1.5 rounded-full border border-gray-200">
                Pending: {countPendingTodos}
              </span>
              <span className="bg-white text-green-500 px-3 py-1.5 rounded-full border border-gray-200">
                Completed: {countCompletedTodos}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {todos.length > 0 ? (
              todos
                .filter((todo) => !todo.completed)
                .map((todo) => (
                  <li
                    key={todo.id}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-2"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 accent-gray-200"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleCompleted(todo.id, todo.completed)
                        }
                      />
                      {editId === todo.id ? (
                        <div className="flex space-x-2">
                          <input
                            autoFocus
                            type="text"
                            className="flex-1 border border-gray-300 px-2 py-1 rounded focus:outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, todo.id)}
                          />
                          <button
                            className="save-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            onClick={() => handleEditSave(todo.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`flex-1 ${
                              todo.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {todo.text}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              className={
                                'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition'
                              }
                              onClick={() =>
                                handleEditStart(todo.id, todo.text)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className={
                                'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition'
                              }
                              onClick={() => handleDeleteTodo(todo.id)}
                            >
                              ✖
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                ))
            ) : (
              <li className="text-gray-500 text-center">
                No tasks added yet! Add one above.
              </li>
            )}
          </ul>
          {countCompletedTodos > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-600 text-lg font-medium mb-2">
                Completed Tasks
              </h3>
              <ul className="space-y-2">
                {todos
                  .filter((todo) => todo.completed)
                  .map((todo) => (
                    <li
                      key={todo.id}
                      className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-2"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 accent-gray-400"
                          checked={todo.completed}
                          onChange={() =>
                            handleToggleCompleted(todo.id, todo.completed)
                          }
                        />
                        <span className="flex-1 line-through text-gray-500">
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          ✖
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
              <button
                className="bg-red-500 text-white w-full mt-2 px-4 py-2 shadow-lg rounded-lg hover:bg-red-400 transition"
                onClick={clearCompletedTodos}
              >
                Clear Completed
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
