FirstRepo
=========

Employee data dashboard backed by the configured PostgreSQL database.

## Run

```bash
npm install
HOST=0.0.0.0 PORT=3000 npm run dev
```

The server reads the database connection from `TEST_DATABASE_URL` first, then
`DATABASE_URL`. Dashboard queries are read-only and return aggregate employee
metrics only.
