'use client';

import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const {
    todos,
    addTodo,
    deleteTodo,
    updateTodoText,
    toggleTodoCompleted,
    clearCompleted,
  } = useTodos();

  const [newTodo, setNewTodo] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const resetFormField = () => {
    setNewTodo('');
    setEditId(null);
    setEditValue('');
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const result = await addTodo(newTodo);
    if (result.success) {
      toast.success('Todo added successfully!');
      resetFormField();
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const handleEditSave = async (id: number) => {
    if (
      !editValue.trim() ||
      editValue === todos.find((todo) => todo.id === id)?.text
    )
      return;

    const result = await updateTodoText(id, editValue);
    if (result.success) {
      resetFormField();
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      resetFormField();
    }
  };

  const countPendingTodos = todos.filter((todo) => !todo.completed).length;
  const countCompletedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <ToastContainer />
      <div
        className="min-h-screen flex flex-col items-center p-6"
        style={{ background: 'var(--background)' }}
      >
        <main className="w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow p-6 mt-6">
          <section className="mb-6">
            <header className="w-full max-w-3xl text-center py-4">
              <h1 className="text-4xl font-bold">What needs doing today?</h1>
              <p className="text-lg mt-2">Organise your tasks, feel good.</p>
            </header>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">TODOs</h2>
              <div className="flex gap-2 text-sm font-semibold">
                <span className="bg-white text-blue-500 px-2 py-1 rounded-full border border-gray-200">
                  Pending: {countPendingTodos}
                </span>
                <span className="bg-white text-green-500 px-2 py-1 rounded-full border border-gray-200">
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
                            toggleTodoCompleted(todo.id, todo.completed)
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
                                todo.completed
                                  ? 'line-through text-gray-500'
                                  : ''
                              }`}
                            >
                              {todo.text}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                className={
                                  'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition'
                                }
                                onClick={() => {
                                  setEditId(todo.id);
                                  setEditValue(todo.text);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className={
                                  'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition'
                                }
                                onClick={() => deleteTodo(todo.id)}
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
                              toggleTodoCompleted(todo.id, todo.completed)
                            }
                          />
                          <span className="flex-1 line-through text-gray-500">
                            {todo.text}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            ✖
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
                <button
                  className="bg-red-500 text-white w-full mt-2 px-4 py-2 shadow-lg rounded-lg hover:bg-red-400 transition"
                  onClick={clearCompleted}
                >
                  Clear Completed
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
