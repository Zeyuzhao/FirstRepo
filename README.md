# Employee Operations Dashboard

Static employee dashboard generated from read-only aggregate queries against the configured
Postgres connector.

## Run Locally

```bash
python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://127.0.0.1:3000`.

## Data Source

- Database driver: Postgres via `sql-query`
- Schema: `employees`
- Tables used: `employee`, `department`, `department_employee`, `salary`, `title`
- Active employee rule: `to_date >= CURRENT_DATE`
- Privacy guardrail: the dashboard embeds aggregate metrics only, not employee names or row-level records.

Run the query refresh script in an environment with the SQL connector configured:

```bash
bash scripts/refresh-employee-dashboard-data.sh
```
