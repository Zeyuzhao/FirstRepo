# SQL Dashboard

A read-only Next.js dashboard backed by the configured Postgres database.

## Run locally

Set either `TEST_DATABASE_URL` or `DATABASE_URL`, then run:

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

The dashboard queries the `employees` schema server-side and never sends the database URL to the browser.
