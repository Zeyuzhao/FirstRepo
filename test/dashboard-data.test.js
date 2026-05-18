const assert = require("node:assert/strict");
const test = require("node:test");

const {
  mapEmployeeRows,
  mapMetricRows,
  mapSeriesRows,
  numberOrNull
} = require("../src/dashboard-data");

test("numberOrNull converts finite database values", () => {
  assert.equal(numberOrNull("300024"), 300024);
  assert.equal(numberOrNull(42), 42);
  assert.equal(numberOrNull(null), null);
  assert.equal(numberOrNull("not numeric"), null);
});

test("mapSeriesRows normalises chart rows", () => {
  assert.deepEqual(
    mapSeriesRows([
      { label: "Development", value: "61386" },
      { label: "Finance", value: null }
    ]),
    [
      { label: "Development", value: 61386 },
      { label: "Finance", value: 0 }
    ]
  );
});

test("mapEmployeeRows shapes latest employee rows", () => {
  assert.deepEqual(
    mapEmployeeRows([
      {
        id: "463807",
        first_name: "Bikash",
        last_name: "Covnot",
        gender: "M",
        hire_date: "2000-01-28",
        department: "Unassigned"
      }
    ]),
    [
      {
        id: 463807,
        name: "Bikash Covnot",
        gender: "M",
        hireDate: "2000-01-28",
        department: "Unassigned"
      }
    ]
  );
});

test("mapMetricRows formats dashboard cards", () => {
  const metrics = mapMetricRows({
    total_employees: "300024",
    departments: "9",
    recent_hires: "90",
    average_current_salary: "72012",
    first_hire: "1985-01-01",
    latest_hire: "2000-01-28"
  });

  assert.equal(metrics.totalEmployees, 300024);
  assert.equal(metrics.departments, 9);
  assert.equal(metrics.recentHires, 90);
  assert.equal(metrics.averageCurrentSalary, 72012);
  assert.equal(metrics.cards[0].value, "300,024");
  assert.equal(metrics.cards[3].value, "$72,012");
});
