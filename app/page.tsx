"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: number;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });
      const todo = await res.json();
      setTodos([todo, ...todos]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function handleToggleTodo(id: number) {
    try {
      await fetch(`/api/todos/${id}`, { method: "PATCH" });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: todo.completed ? 0 : 1 } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function handleDeleteTodo(id: number) {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          📝 Todo List
        </h1>

        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No todos yet. Add one above!
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600 group"
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-slate-400 hover:border-green-500"
                  }`}
                >
                  {todo.completed ? "✓" : ""}
                </button>
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "text-slate-400 line-through"
                      : "text-white"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          {todos.length} todo{todos.length !== 1 ? "s" : ""} •{" "}
          {todos.filter((t) => t.completed).length} completed
        </div>
      </div>
    </div>
  );
}
