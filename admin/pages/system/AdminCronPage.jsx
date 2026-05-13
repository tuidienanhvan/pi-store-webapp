import { useCallback, useEffect, useMemo, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { Alert, Badge, Button, Card, Table } from "@/components/ui";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import { Activity, Play, RefreshCw } from "lucide-react";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
}

function statusTone(status) {
  if (status === "success") return "success";
  if (status === "failed") return "danger";
  return "neutral";
}

export function AdminCronPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningSlug, setRunningSlug] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    withDelay(api.admin.cronStatus(), 600)
      .then((res) => setJobs(res.jobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => ({
    total: jobs.length,
    failed: jobs.filter((job) => job.last_status === "failed").length,
    neverRun: jobs.filter((job) => job.last_status === "never_run").length,
  }), [jobs]);

  const runJob = async (job) => {
    if (!confirm(`Run cron job "${job.slug}" now?`)) return;
    setRunningSlug(job.slug);
    setError("");
    setLastResult(null);
    try {
      const res = await api.admin.runCron(job.slug);
      setLastResult(res);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRunningSlug("");
    }
  };

  if (loading && jobs.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="cron-page fade-in stack gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4 stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">Cron jobs</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            Manual triggers and last-run status for backend maintenance jobs.
          </p>
        </div>
        <Button variant="ghost" onClick={load} disabled={loading} className="h-[48px] px-6 rounded-2xl border border-base-border-subtle font-black uppercase tracking-widest text-[10px]">
          <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-2">
        <Card className="p-6">
          <div className="text-[11px] uppercase font-black tracking-widest opacity-40">Jobs</div>
          <div className="mt-2 text-3xl font-black">{summary.total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-[11px] uppercase font-black tracking-widest opacity-40">Never run</div>
          <div className="mt-2 text-3xl font-black">{summary.neverRun}</div>
        </Card>
        <Card className="p-6">
          <div className="text-[11px] uppercase font-black tracking-widest opacity-40">Failed</div>
          <div className="mt-2 text-3xl font-black text-danger">{summary.failed}</div>
        </Card>
      </div>

      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}
      {lastResult && (
        <Alert tone={lastResult.status === "success" ? "success" : "warning"}>
          {lastResult.slug} finished with {lastResult.status} in {lastResult.duration_ms}ms.
          {lastResult.error ? ` ${lastResult.error}` : ""}
        </Alert>
      )}

      <Card className="p-0 overflow-hidden stagger-3">
        <Table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Last run</th>
              <th>Next run</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.slug}>
                <td>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="font-black text-base-content">{job.name}</div>
                      <div className="text-xs opacity-60 max-w-[520px]">{job.description}</div>
                      {job.last_error && <div className="mt-1 text-xs text-danger">{job.last_error}</div>}
                    </div>
                  </div>
                </td>
                <td className="font-mono text-xs opacity-70">{job.schedule}</td>
                <td>
                  <Badge tone={statusTone(job.last_status)}>{job.last_status}</Badge>
                </td>
                <td className="text-xs opacity-70">{formatDate(job.last_run_at)}</td>
                <td className="text-xs opacity-70">{formatDate(job.next_run_estimated_at)}</td>
                <td className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runJob(job)}
                    disabled={runningSlug === job.slug}
                    className="rounded-lg border border-base-border-subtle font-black uppercase tracking-widest text-[10px]"
                  >
                    <Play size={13} className="mr-1.5" />
                    {runningSlug === job.slug ? "Running" : "Run now"}
                  </Button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="py-20 text-center opacity-50">No cron jobs returned.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default AdminCronPage;

