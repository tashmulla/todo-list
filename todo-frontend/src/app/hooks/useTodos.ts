import { useEffect, useState } from 'react';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const SERVER_URL = 'https://nm-todo-list-backend-110c7a63f605.herokuapp.com';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);  

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }

  const addTodo = async (text: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const newTodo: Todo = await res.json();
        setTodos((prev) => [...prev, newTodo]);
        return { success: true, todo: newTodo };
      } else if (res.status === 409) {
        return { success: false, message: 'Todo with same text already exists!' };
      } else {
        return { success: false, message: 'Failed to add todo.' };
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      return { success: false, message: 'An error occurred while adding todo.' };
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`${SERVER_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        console.error('Failed to delete todo:', res.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodoText = async (id: number, text: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/todos/${id}/text`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const updatedTodo: Todo = await res.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        return { success: true, todo: updatedTodo };
      } else if (res.status === 409) {
        return { success: false, message: 'Todo with same text already exists!' };
      } else {
        return { success: false, message: 'Failed to update todo.' };
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      return { success: false, message: 'An error occurred while updating todo.' };
    }
  };

  const toggleTodoCompleted = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${SERVER_URL}/todos/${id}/completed`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (res.ok) {
        const updatedTodo: Todo = await res.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      } else {
        console.error('Failed to toggle todo:', res.statusText);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const clearCompleted = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/todos/completed`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTodos((prev) => prev.filter((todo) => !todo.completed));
      } else {
        console.error('Failed to clear completed todos:', res.statusText);
      }
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    deleteTodo,
    updateTodoText,
    toggleTodoCompleted,
    clearCompleted,
  };
}