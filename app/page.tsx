"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

const filters: Filter[] = ["all", "active", "completed"];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [entry, setEntry] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.done);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.done);
    }

    return todos;
  }, [filter, todos]);

  const remainingCount = todos.filter((todo) => !todo.done).length;
  const completedCount = todos.length - remainingCount;

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = entry.trim();

    if (!title) {
      return;
    }

    setTodos((currentTodos) => [
      {
        id: crypto.randomUUID(),
        title,
        done: false,
      },
      ...currentTodos,
    ]);
    setEntry("");
    setFilter("all");
  }

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.done));
  }

  return (
    <main className="page">
      <section className="todo-shell" aria-labelledby="todo-title">
        <div className="todo-header">
          <div>
            <p className="eyebrow">Tasks</p>
            <h1 id="todo-title">Todo list</h1>
          </div>
          <div className="todo-count" aria-label={`${remainingCount} tasks left`}>
            <strong>{remainingCount}</strong>
            <span>{remainingCount === 1 ? "task left" : "tasks left"}</span>
          </div>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="todo-entry">
            New task
          </label>
          <input
            id="todo-entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="Add a task"
            autoComplete="off"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="todo-toolbar" aria-label="Todo filters">
          <div className="filters">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? "active" : undefined}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="clear-button"
            disabled={completedCount === 0}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li key={todo.id} className={todo.done ? "completed" : undefined}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete ${todo.title}`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">
            {todos.length === 0
              ? "No tasks yet."
              : `No ${filter} tasks.`}
          </p>
        )}
      </section>
    </main>
  );
}
