import { SqlDashboard } from "@/components/sql-dashboard";
import { getDashboardSnapshot } from "@/lib/dashboard-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Home() {
  const initialSnapshot = getDashboardSnapshot();

  return <SqlDashboard initialSnapshot={initialSnapshot} />;
}
