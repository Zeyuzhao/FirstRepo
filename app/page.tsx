"use client";

import { FormEvent, useState } from "react";
import type { CSSProperties } from "react";

type Status = "Backlog" | "In progress" | "Done";

type Task = {
  id: number;
  title: string;
  owner: string;
  status: Status;
};

const columns: Status[] = ["Backlog", "In progress", "Done"];

const initialTasks: Task[] = [
  { id: 1, title: "Review onboarding handoff", owner: "MK", status: "Backlog" },
  { id: 2, title: "Finalize customer QBR notes", owner: "SL", status: "Backlog" },
  { id: 3, title: "Publish launch checklist", owner: "AC", status: "In progress" },
  { id: 4, title: "Triage priority feedback", owner: "JR", status: "In progress" },
  { id: 5, title: "Confirm support coverage", owner: "TN", status: "Done" },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), title, owner: "You", status: "Backlog" },
    ]);
    setTaskTitle("");
  }

  function moveTask(id: number, direction: -1 | 1) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task;
        const nextIndex = columns.indexOf(task.status) + direction;
        return nextIndex < 0 || nextIndex >= columns.length
          ? task
          : { ...task, status: columns[nextIndex] };
      }),
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <nav className="top-nav" aria-label="Dashboard navigation">
          <a className="brand" href="#overview">Signalboard</a>
          <div className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#board">Kanban</a>
            <a href="#activity">Activity</a>
          </div>
          <a className="nav-action" href="#new-task">Add task</a>
        </nav>

        <header className="hero" id="overview">
          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>Track the signals that move the business.</h1>
            <p className="summary">
              A compact command center for revenue, users, conversion, and
              execution health.
            </p>
            <p className="data-label">Sample data — not current business records</p>
          </div>
          <a className="primary-action" href="#board">Open board</a>
        </header>

        <section className="metric-grid" aria-label="Sample dashboard metrics">
          {[
            { label: "Revenue", value: "$128.4K", change: "+12.5%" },
            { label: "Active users", value: "24,892", change: "+8.2%" },
            { label: "Conversion", value: "7.4%", change: "+1.1%" },
            { label: "Open tasks", value: "36", change: "-4 today" },
          ].map((metric) => (
            <article className="metric-card" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.change}</span>
            </article>
          ))}
        </section>

        <section className="kanban-section" id="board" aria-labelledby="board-title">
          <div className="board-heading">
            <div>
              <p className="eyebrow">Work queue</p>
              <h2 id="board-title">Kanban board</h2>
            </div>
            <span className="sample-badge">Sample tasks</span>
          </div>

          <form className="task-form" id="new-task" onSubmit={addTask}>
            <label htmlFor="task-title">Add a task</label>
            <div className="task-input-row">
              <input
                id="task-title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="What needs to happen?"
              />
              <button type="submit">Add to backlog</button>
            </div>
          </form>

          <div className="kanban-board">
            {columns.map((column, columnIndex) => {
              const columnTasks = tasks.filter((task) => task.status === column);
              return (
                <section className="kanban-column" key={column} aria-label={`${column} tasks`}>
                  <div className="column-heading">
                    <h3>{column}</h3>
                    <span>{columnTasks.length}</span>
                  </div>
                  <div className="task-stack">
                    {columnTasks.map((task) => (
                      <article className="task-card" key={task.id}>
                        <p>{task.title}</p>
                        <footer>
                          <span className="task-owner" aria-label={`Owner: ${task.owner}`}>{task.owner}</span>
                          <div className="task-controls">
                            <button
                              aria-label={`Move ${task.title} left`}
                              disabled={columnIndex === 0}
                              onClick={() => moveTask(task.id, -1)}
                              type="button"
                            >
                              ←
                            </button>
                            <button
                              aria-label={`Move ${task.title} right`}
                              disabled={columnIndex === columns.length - 1}
                              onClick={() => moveTask(task.id, 1)}
                              type="button"
                            >
                              →
                            </button>
                          </div>
                        </footer>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="eyebrow">Performance</p>
              <h2>Weekly momentum</h2>
            </div>
            <div className="bar-chart" aria-label="Sample weekly momentum chart">
              {[54, 68, 61, 82, 76, 90, 88].map((height, index) => (
                <span
                  aria-label={`Day ${index + 1}: ${height}%`}
                  className="bar"
                  key={height + index}
                  style={{ "--height": `${height}%` } as CSSProperties}
                />
              ))}
            </div>
          </article>

          <article className="panel" id="activity">
            <div className="panel-heading">
              <p className="eyebrow">Sample activity</p>
              <h2>Recent activity</h2>
            </div>
            <ul className="activity-list">
              {[
                "North America pipeline crossed 82% of quarterly target.",
                "Enterprise onboarding queue is down 18% week over week.",
                "Support response SLA held at 94% for priority tickets.",
              ].map((activity) => <li key={activity}>{activity}</li>)}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
