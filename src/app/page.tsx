import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Code2,
  GitBranch,
  LayoutDashboard,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UsersRound,
} from "lucide-react";

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
};

type Task = {
  title: string;
  owner: string;
  status: string;
};

const metrics: Metric[] = [
  {
    label: "Release Health",
    value: "96%",
    detail: "+8 pts this week",
    icon: ShieldCheck,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  {
    label: "Open Pull Requests",
    value: "12",
    detail: "4 ready for review",
    icon: GitBranch,
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  {
    label: "Deploy Window",
    value: "2h",
    detail: "staging freeze at 16:00",
    icon: Rocket,
    tone: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    label: "Incident Risk",
    value: "Low",
    detail: "no active escalations",
    icon: Activity,
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
  },
];

const taskColumns: { name: string; count: number; tasks: Task[] }[] = [
  {
    name: "Design",
    count: 3,
    tasks: [
      {
        title: "Account switcher states",
        owner: "Maya",
        status: "Review",
      },
      {
        title: "Usage chart empty view",
        owner: "Noah",
        status: "Draft",
      },
    ],
  },
  {
    name: "Build",
    count: 5,
    tasks: [
      {
        title: "Billing webhook retry flow",
        owner: "Iris",
        status: "In flight",
      },
      {
        title: "Audit log pagination",
        owner: "Lee",
        status: "Blocked",
      },
    ],
  },
  {
    name: "Ship",
    count: 4,
    tasks: [
      {
        title: "Analytics export polish",
        owner: "Sam",
        status: "QA",
      },
      {
        title: "Workspace invite cleanup",
        owner: "Ari",
        status: "Ready",
      },
    ],
  },
];

const deployments = [
  {
    name: "frontend",
    version: "v1.8.2",
    state: "Preview live",
    accent: "bg-emerald-500",
  },
  {
    name: "api",
    version: "v1.8.1",
    state: "Canary 30%",
    accent: "bg-sky-500",
  },
  {
    name: "worker",
    version: "v1.7.9",
    state: "Queued",
    accent: "bg-amber-500",
  },
];

const schedule = [
  "09:30 Product triage",
  "11:00 Design review",
  "14:15 Staging signoff",
  "16:00 Release freeze",
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Branches", icon: GitBranch, active: false },
  { label: "Activity", icon: Activity, active: false },
  { label: "Team", icon: UsersRound, active: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#20231f]">
      <header className="border-b border-[#dfe3d7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#25342c] text-sm font-semibold text-white">
              FR
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#687161]">Workspace</p>
              <h1 className="text-lg font-semibold leading-tight text-[#20231f] sm:text-xl">
                FirstRepo Launchpad
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search workspace"
              className="flex size-10 items-center justify-center rounded-md border border-[#dfe3d7] bg-white text-[#4d554a] transition hover:border-[#bfc8b7] hover:text-[#20231f]"
            >
              <Search className="size-4" />
            </button>
            <button
              aria-label="View notifications"
              className="flex size-10 items-center justify-center rounded-md border border-[#dfe3d7] bg-white text-[#4d554a] transition hover:border-[#bfc8b7] hover:text-[#20231f]"
            >
              <Bell className="size-4" />
            </button>
            <button className="hidden h-10 items-center gap-2 rounded-md bg-[#25342c] px-4 text-sm font-medium text-white transition hover:bg-[#1d2923] sm:flex">
              <Rocket className="size-4" />
              New Release
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-[#25342c] text-white"
                      : "text-[#596254] hover:bg-white hover:text-[#20231f]"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-[#dfe3d7] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7b8474]">
              Environment
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#4d554a]">
              <div className="flex items-center justify-between">
                <span>Production</span>
                <span className="flex items-center gap-2 font-medium text-emerald-700">
                  <CircleDot className="size-3 fill-current" />
                  Stable
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Staging</span>
                <span className="font-medium text-amber-700">Frozen</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className="rounded-lg border border-[#dfe3d7] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#687161]">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-normal text-[#20231f]">
                        {metric.value}
                      </p>
                    </div>
                    <div
                      className={`flex size-10 items-center justify-center rounded-md ring-1 ${metric.tone}`}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#596254]">{metric.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
            <div className="rounded-lg border border-[#dfe3d7] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#e7eadf] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#687161]">
                    Delivery Board
                  </p>
                  <h2 className="text-lg font-semibold text-[#20231f]">
                    Sprint 12
                  </h2>
                </div>
                <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#dfe3d7] bg-white px-3 text-sm font-medium text-[#25342c] transition hover:border-[#bfc8b7] sm:w-auto">
                  <Code2 className="size-4" />
                  Open Backlog
                </button>
              </div>

              <div className="grid divide-y divide-[#e7eadf] md:grid-cols-3 md:divide-x md:divide-y-0">
                {taskColumns.map((column) => (
                  <div key={column.name} className="min-w-0 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-[#20231f]">
                        {column.name}
                      </h3>
                      <span className="rounded-md bg-[#eef1e8] px-2 py-1 text-xs font-semibold text-[#596254]">
                        {column.count}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="rounded-md border border-[#e2e6da] bg-[#fbfcf8] p-3"
                        >
                          <p className="text-sm font-medium leading-6 text-[#20231f]">
                            {task.title}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#687161]">
                            <span>{task.owner}</span>
                            <span className="font-semibold text-[#25342c]">
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-lg border border-[#dfe3d7] bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-[#e7eadf] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#687161]">
                      Deployment Queue
                    </p>
                    <h2 className="text-lg font-semibold text-[#20231f]">
                      Today
                    </h2>
                  </div>
                  <TerminalSquare className="size-5 text-[#596254]" />
                </div>
                <div className="divide-y divide-[#e7eadf]">
                  {deployments.map((deployment) => (
                    <div
                      key={deployment.name}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`size-2.5 shrink-0 rounded-full ${deployment.accent}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#20231f]">
                            {deployment.name}
                          </p>
                          <p className="text-xs text-[#687161]">
                            {deployment.version}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-[#25342c]">
                        {deployment.state}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[#dfe3d7] bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-[#e7eadf] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#687161]">
                      Team Rhythm
                    </p>
                    <h2 className="text-lg font-semibold text-[#20231f]">
                      Tuesday
                    </h2>
                  </div>
                  <CalendarDays className="size-5 text-[#596254]" />
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {schedule.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm text-[#4d554a]"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#eef1e8] px-3 text-sm font-medium text-[#25342c] transition hover:bg-[#e2e6da]">
                    <Sparkles className="size-4" />
                    Refresh Plan
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
