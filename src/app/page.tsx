import Image from "next/image";
import styles from "./page.module.css";

const stack = [
  { label: "Framework", value: "Next.js 16" },
  { label: "Runtime", value: "React 19" },
  { label: "Language", value: "TypeScript" },
  { label: "Quality", value: "ESLint 9" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.brandRow}>
          <Image src="/next.svg" alt="Next.js" width={106} height={22} priority />
          <span>App Router starter</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.copy}>
            <p className={styles.kicker}>FirstRepo</p>
            <h1 id="home-title">A clean Next.js foundation is ready.</h1>
            <p className={styles.summary}>
              This repository now has a typed App Router setup with modern
              React, project scripts, and linting wired in.
            </p>
          </div>
          <div className={styles.previewPanel} aria-label="Project status">
            <Image
              className={styles.previewIcon}
              src="/window.svg"
              alt=""
              width={48}
              height={48}
            />
            <div>
              <span className={styles.statusLabel}>Status</span>
              <strong>Ready for development</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stackGrid} aria-label="Application stack">
        {stack.map((item) => (
          <article className={styles.stackCard} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
