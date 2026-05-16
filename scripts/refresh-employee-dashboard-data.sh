#!/usr/bin/env bash
set -euo pipefail

echo "== Connector health =="
sql-query --health

echo
echo "== Tables =="
sql-query --tables

echo
echo "== Workforce summary =="
sql-query "SELECT COUNT(*)::bigint AS total_employees, COUNT(*) FILTER (WHERE gender::text = 'M')::bigint AS male_employees, COUNT(*) FILTER (WHERE gender::text = 'F')::bigint AS female_employees, MIN(hire_date) AS first_hire, MAX(hire_date) AS latest_hire, ROUND(AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, hire_date)))::numeric, 1) AS avg_tenure_years FROM employees.employee"

echo
echo "== Active employees =="
sql-query "SELECT COUNT(DISTINCT employee_id)::bigint AS active_employees FROM employees.department_employee WHERE to_date >= CURRENT_DATE"

echo
echo "== Active tenure bounds =="
sql-query "SELECT ROUND(AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, e.hire_date)))::numeric, 1) AS active_avg_tenure_years, MIN(e.hire_date) AS active_first_hire, MAX(e.hire_date) AS active_latest_hire FROM employees.employee e JOIN employees.department_employee de ON de.employee_id = e.id WHERE de.to_date >= CURRENT_DATE"

echo
echo "== Department metrics =="
sql-query "SELECT d.dept_name AS department, COUNT(DISTINCT e.id)::bigint AS headcount, ROUND(AVG(s.amount)::numeric, 0)::bigint AS avg_salary, ROUND(100.0 * COUNT(DISTINCT e.id) FILTER (WHERE e.gender::text = 'F') / COUNT(DISTINCT e.id), 1) AS pct_female, ROUND(AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, e.hire_date)))::numeric, 1) AS avg_tenure_years FROM employees.department d JOIN employees.department_employee de ON de.department_id = d.id JOIN employees.employee e ON e.id = de.employee_id JOIN employees.salary s ON s.employee_id = e.id AND s.to_date >= CURRENT_DATE WHERE de.to_date >= CURRENT_DATE GROUP BY d.dept_name ORDER BY headcount DESC, department"

echo
echo "== Current title mix =="
sql-query "SELECT title, COUNT(DISTINCT employee_id)::bigint AS headcount FROM employees.title WHERE to_date >= CURRENT_DATE GROUP BY title ORDER BY headcount DESC, title"

echo
echo "== Current salary summary =="
sql-query "SELECT ROUND(AVG(amount)::numeric, 0)::bigint AS avg_salary, MIN(amount)::bigint AS min_salary, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount)::bigint AS median_salary, MAX(amount)::bigint AS max_salary FROM employees.salary WHERE to_date >= CURRENT_DATE"

echo
echo "== Current salary bands =="
sql-query "SELECT CASE WHEN amount < 50000 THEN '<50k' WHEN amount < 70000 THEN '50k-69k' WHEN amount < 90000 THEN '70k-89k' WHEN amount < 110000 THEN '90k-109k' ELSE '110k+' END AS salary_band, COUNT(*)::bigint AS employees FROM employees.salary WHERE to_date >= CURRENT_DATE GROUP BY salary_band ORDER BY MIN(amount)"

echo
echo "== Active gender balance =="
sql-query "SELECT e.gender::text AS gender, COUNT(DISTINCT e.id)::bigint AS active_employees FROM employees.employee e JOIN employees.department_employee de ON de.employee_id = e.id WHERE de.to_date >= CURRENT_DATE GROUP BY e.gender::text ORDER BY gender"

echo
echo "== Annual hires =="
sql-query "SELECT EXTRACT(YEAR FROM hire_date)::int AS hire_year, COUNT(*)::bigint AS hires FROM employees.employee GROUP BY hire_year ORDER BY hire_year"
