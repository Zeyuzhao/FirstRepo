"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "Backlog" | "In progress" | "Review" | "Done";
type Priority = "High" | "Medium" | "Low";
type Area = "Product" | "Design" | "Engineering" | "Growth";

type Task = {
  id: number;
  title: string;
  owner: string;
  status: Status;
  priority: Priority;
  area: Area;
  due: string;
  estimate: number;
  notes: string;
};

const statuses: Status[] = ["Backlog", "In progress", "Review", "Done"];
const priorities: Priority[] = ["High", "Medium", "Low"];
const areas: Area[] = ["Product", "Design", "Engineering", "Growth"];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Map onboarding checkpoints",
    owner: "Nina",
    status: "In progress",
    priority: "High",
    area: "Product",
    due: "Jun 04",
    estimate: 5,
    notes: "Reduce first-session setup time and remove duplicate questions.",
  },
  {
    id: 2,
    title: "Ship dashboard empty states",
    owner: "Owen",
    status: "Review",
    priority: "Medium",
    area: "Design",
    due: "Jun 06",
    estimate: 3,
    notes: "Cover no data, no results, and blocked integration states.",
  },
  {
    id: 3,
    title: "Add usage event schema",
    owner: "Maya",
    status: "Backlog",
    priority: "High",
    area: "Engineering",
    due: "Jun 08",
    estimate: 8,
    notes: "Keep the event contract stable before analytics rollout.",
  },
  {
    id: 4,
    title: "Draft launch email variants",
    owner: "Leo",
    status: "Done",
    priority: "Low",
    area: "Growth",
    due: "Jun 02",
    estimate: 2,
    notes: "Prepare three subject lines and a short activation CTA.",
  },
  {
    id: 5,
    title: "Review billing upgrade flow",
    owner: "Ari",
    status: "In progress",
    priority: "Medium",
    area: "Product",
    due: "Jun 10",
    estimate: 6,
    notes: "Confirm plan copy, tax messaging, and confirmation state.",
  },
];

const blankTask = {
  title: "",
  owner: "",
  area: "Product" as Area,
  priority: "Medium" as Priority,
  estimate: 3,
};

function getNextStatus(status: Status): Status {
  const currentIndex = statuses.indexOf(status);
  return statuses[(currentIndex + 1) % statuses.length];
}

function getDueLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const [activeArea, setActiveArea] = useState<Area | "All">("All");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(blankTask);

  const summary = useMemo(() => {
    const totalEstimate = tasks.reduce((sum, task) => sum + task.estimate, 0);
    const doneTasks = tasks.filter((task) => task.status === "Done").length;
    const highPriority = tasks.filter((task) => task.priority === "High").length;

    return {
      doneTasks,
      highPriority,
      totalEstimate,
      progress: Math.round((doneTasks / tasks.length) * 100),
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus =
        activeStatus === "All" || task.status === activeStatus;
      const matchesArea = activeArea === "All" || task.area === activeArea;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [task.title, task.owner, task.area, task.notes]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesArea && matchesQuery;
    });
  }, [activeArea, activeStatus, query, tasks]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.owner.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: draft.title.trim(),
      owner: draft.owner.trim(),
      status: "Backlog",
      priority: draft.priority,
      area: draft.area,
      due: getDueLabel(),
      estimate: draft.estimate,
      notes: "New work item added to this sprint.",
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setDraft(blankTask);
    setActiveStatus("All");
  }

  function cycleStatus(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: getNextStatus(task.status),
            }
          : task,
      ),
    );
  }

  function updatePriority(taskId: number, priority: Priority) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority,
            }
          : task,
      ),
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sprint workspace</p>
          <h1>Flowboard</h1>
        </div>
        <div className="topbar-actions" aria-label="Sprint summary">
          <span>{tasks.length} tasks</span>
          <span>{summary.totalEstimate} points</span>
          <span>{summary.progress}% done</span>
        </div>
      </header>

      <section className="status-strip" aria-label="Project progress">
        <article>
          <span className="metric-label">Done</span>
          <strong>{summary.doneTasks}</strong>
        </article>
        <article>
          <span className="metric-label">High priority</span>
          <strong>{summary.highPriority}</strong>
        </article>
        <article>
          <span className="metric-label">Estimate</span>
          <strong>{summary.totalEstimate} pts</strong>
        </article>
        <article>
          <span className="metric-label">Completion</span>
          <div className="progress-wrap">
            <div
              className="progress-bar"
              style={{ width: `${summary.progress}%` }}
            />
          </div>
        </article>
      </section>

      <div className="workspace">
        <aside className="sidebar" aria-label="Task controls">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="section-heading">
              <p className="eyebrow">Create task</p>
              <h2>Add work</h2>
            </div>

            <label>
              Task
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    title: event.target.value,
                  }))
                }
                placeholder="Write release notes"
              />
            </label>

            <label>
              Owner
              <input
                value={draft.owner}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    owner: event.target.value,
                  }))
                }
                placeholder="Sam"
              />
            </label>

            <div className="form-row">
              <label>
                Area
                <select
                  value={draft.area}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      area: event.target.value as Area,
                    }))
                  }
                >
                  {areas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={draft.priority}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      priority: event.target.value as Priority,
                    }))
                  }
                >
                  {priorities.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Estimate: {draft.estimate} pts
              <input
                type="range"
                min="1"
                max="13"
                value={draft.estimate}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    estimate: Number(event.target.value),
                  }))
                }
              />
            </label>

            <button type="submit">Add task</button>
          </form>

          <div className="filter-panel">
            <div className="section-heading">
              <p className="eyebrow">Focus</p>
              <h2>Filters</h2>
            </div>

            <label>
              Search
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Owner, note, area"
              />
            </label>

            <div>
              <span className="control-label">Status</span>
              <div className="segmented" role="group" aria-label="Status">
                {(["All", ...statuses] as const).map((status) => (
                  <button
                    key={status}
                    className={activeStatus === status ? "active" : ""}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <label>
              Area
              <select
                value={activeArea}
                onChange={(event) =>
                  setActiveArea(event.target.value as Area | "All")
                }
              >
                <option>All</option>
                {areas.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <section className="task-board" aria-label="Sprint tasks">
          <div className="board-heading">
            <div>
              <p className="eyebrow">Board</p>
              <h2>{visibleTasks.length} visible tasks</h2>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setActiveStatus("All");
                setActiveArea("All");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          </div>

          <div className="tasks-grid">
            {visibleTasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-card-header">
                  <span className={`priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  <span>{task.due}</span>
                </div>

                <h3>{task.title}</h3>
                <p>{task.notes}</p>

                <dl className="task-meta">
                  <div>
                    <dt>Owner</dt>
                    <dd>{task.owner}</dd>
                  </div>
                  <div>
                    <dt>Area</dt>
                    <dd>{task.area}</dd>
                  </div>
                  <div>
                    <dt>Estimate</dt>
                    <dd>{task.estimate} pts</dd>
                  </div>
                </dl>

                <div className="task-actions">
                  <button type="button" onClick={() => cycleStatus(task.id)}>
                    {task.status}
                  </button>
                  <select
                    aria-label={`Priority for ${task.title}`}
                    value={task.priority}
                    onChange={(event) =>
                      updatePriority(task.id, event.target.value as Priority)
                    }
                  >
                    {priorities.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>

          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks match the current filters.</h3>
              <p>Clear filters or add work that matches this focus area.</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
