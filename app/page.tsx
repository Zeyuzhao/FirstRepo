import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "amber" | "rose";
};

const root = process.cwd();

async function countFiles(directory: string): Promise<number> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const counts = await Promise.all(
      entries.map((entry) => {
        const nextPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return countFiles(nextPath);
        }

        return Promise.resolve(entry.isFile() ? 1 : 0);
      }),
    );

    return counts.reduce((sum, count) => sum + count, 0);
  } catch {
    return 0;
  }
}

async function getPackage(): Promise<PackageJson> {
  const packagePath = path.join(root, "package.json");
  const contents = await readFile(packagePath, "utf8");

  return JSON.parse(contents) as PackageJson;
}

export default async function Home() {
  const packageJson = await getPackage();
  const appFileCount = await countFiles(path.join(root, "app"));
  const scriptEntries = Object.entries(packageJson.scripts ?? {});
  const dependencyCount = Object.keys(packageJson.dependencies ?? {}).length;
  const devDependencyCount = Object.keys(packageJson.devDependencies ?? {}).length;
  const totalDependencies = dependencyCount + devDependencyCount;

  const metrics: Metric[] = [
    {
      label: "Application files",
      value: appFileCount.toLocaleString(),
      detail: "Files under app/",
      tone: "green",
    },
    {
      label: "Runtime packages",
      value: dependencyCount.toLocaleString(),
      detail: "dependencies in package.json",
      tone: "blue",
    },
    {
      label: "Tooling packages",
      value: devDependencyCount.toLocaleString(),
      detail: "devDependencies in package.json",
      tone: "amber",
    },
    {
      label: "NPM scripts",
      value: scriptEntries.length.toLocaleString(),
      detail: "Runnable project commands",
      tone: "rose",
    },
  ];

  const dependencyBars = [
    { label: "Runtime", value: dependencyCount, tone: "blue" },
    { label: "Tooling", value: devDependencyCount, tone: "amber" },
  ];

  const maxDependencyValue = Math.max(...dependencyBars.map((bar) => bar.value), 1);

  return (
    <main className="dashboard-shell">
      <aside className="sidebar" aria-label="Project navigation">
        <div>
          <p className="brand-kicker">FirstRepo</p>
          <h1>Project dashboard</h1>
        </div>

        <nav className="nav-list" aria-label="Dashboard sections">
          <a className="nav-item active" href="#overview">
            Overview
          </a>
          <a className="nav-item" href="#scripts">
            Scripts
          </a>
          <a className="nav-item" href="#dependencies">
            Dependencies
          </a>
        </nav>

        <div className="data-source">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <p>Data: repository files</p>
            <span>Values are read from package.json and app/.</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar" id="overview">
          <div>
            <p className="section-label">Repository setup</p>
            <h2>{packageJson.name ?? "firstrepo"}</h2>
          </div>
          <div className="version-pill">v{packageJson.version ?? "0.0.0"}</div>
        </header>

        <section className="metric-grid" aria-label="Repository metrics">
          {metrics.map((metric) => (
            <article className={`metric-card ${metric.tone}`} key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel" id="dependencies">
            <div className="panel-heading">
              <div>
                <p className="section-label">Package footprint</p>
                <h3>{totalDependencies.toLocaleString()} total packages</h3>
              </div>
              <span className="panel-badge">package.json</span>
            </div>

            <div className="bar-list" aria-label="Dependency breakdown">
              {dependencyBars.map((bar) => (
                <div className="bar-row" key={bar.label}>
                  <div className="bar-meta">
                    <span>{bar.label}</span>
                    <strong>{bar.value.toLocaleString()}</strong>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <span
                      className={`bar-fill ${bar.tone}`}
                      style={{ width: `${Math.max((bar.value / maxDependencyValue) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="scripts">
            <div className="panel-heading">
              <div>
                <p className="section-label">Runbook</p>
                <h3>Available scripts</h3>
              </div>
              <span className="panel-badge">{scriptEntries.length} commands</span>
            </div>

            <div className="script-list">
              {scriptEntries.map(([name, command]) => (
                <div className="script-row" key={name}>
                  <span>{name}</span>
                  <code>{command}</code>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Setup status</p>
              <h3>Dashboard foundation</h3>
            </div>
            <span className="panel-badge">Ready</span>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <span />
              <div>
                <strong>Next.js application detected</strong>
                <p>The repository has an app router layout and page entrypoint.</p>
              </div>
            </div>
            <div className="timeline-item">
              <span />
              <div>
                <strong>Repository-backed dashboard installed</strong>
                <p>Metrics come from local project files instead of synthetic business data.</p>
              </div>
            </div>
            <div className="timeline-item muted">
              <span />
              <div>
                <strong>External data connector unavailable</strong>
                <p>No SQL source is configured, so no live business metrics are displayed.</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
