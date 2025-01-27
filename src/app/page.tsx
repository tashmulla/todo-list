'use client';

import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Do the laundry', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const handleToggleCompleted = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditStart = (id: number, text: string) => {
    setEditId(id);
    setEditValue(text);
  };

  const handleEditSave = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editValue } : todo
      )
    );
    setEditId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      setEditId(null);
      setEditValue('');
    }
  };

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
          <h2 className="text-xl font-semibold">Enter New Task</h2>
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
          <h2 className="text-xl font-semibold">TODOs</h2>
          <ul className="mt-4 space-y-2">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-2"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(todo.id)}
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
                            className={`px-4 py-2 rounded ${
                              todo.completed
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600 transition'
                            }`}
                            onClick={() => handleEditStart(todo.id, todo.text)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            Delete
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
        </section>
      </main>
    </div>
  );
}
