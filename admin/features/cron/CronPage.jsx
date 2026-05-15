import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { 
  Alert, 
  Button 
} from "@/_shared/components/ui";
import { 
  Activity, 
  Play, 
  RefreshCw, 
  AlertCircle, 
  Terminal, 
  Layers,
  Zap,
  Timer
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState,
  AdminStatCard
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { cronApi } from "./api";
import './CronPage.css';

function formatDate(value) {
  if (!value) return "CHƯA TỪNG";
  return new Date(value).toLocaleString("vi-VN", {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * CronPage: Trung tâm điều khiển và giám sát các tác vụ tự động chạy ngầm.
 */
export function CronPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningSlug, setRunningSlug] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await withDelay(cronApi.status(), 600);
      setJobs(res.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => ({
    total: jobs.length,
    failed: jobs.filter((job) => job.last_status === "failed").length,
    neverRun: jobs.filter((job) => job.last_status === "never_run" || !job.last_status).length,
  }), [jobs]);

  const runJob = async (job) => {
    setRunningSlug(job.slug);
    setError("");
    setLastResult(null);
    try {
      const res = await cronApi.run(job.slug);
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
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Tác vụ tự động (Cron)"
        tagline="Quản lý các tác vụ tự động chạy ngầm của hệ thống"
        actions={
          <Button variant="ghost" onClick={load} disabled={loading} className="h-10 px-6 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
            <RefreshCw size={14} className={`mr-2 ${loading ?"animate-spin" : ""}`} />
            Đồng bộ dữ liệu
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard label="Tổng tác vụ" value={summary.total} icon={Layers} trend="Live" />
        <AdminStatCard label="Đang chờ / Chưa chạy" value={summary.neverRun} icon={Timer} tone="neutral" />
        <AdminStatCard label="Lỗi nghiêm trọng" value={summary.failed} icon={AlertCircle} tone={summary.failed > 0 ? "danger" : "success"} />
      </div>

      {error && <Alert tone="danger" onDismiss={() => setError("")}>{error}</Alert>}
      
      {lastResult && (
        <Alert tone={lastResult.status === "success" ? "success" : "warning"} onDismiss={() => setLastResult(null)}>
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wider">
             <Zap size={14} className="text-primary" />
             <span>Thực thi hoàn tất: {lastResult.slug} — {lastResult.status === 'success' ? 'THÀNH CÔNG' : 'CÓ LỖI'} ({lastResult.duration_ms}ms)</span>
          </div>
        </Alert>
      )}

      <div className="flex items-center gap-3 px-2">
         <Terminal size={14} className="text-primary/60" />
         <span className="text-xs font-semibold tracking-wider text-base-content/30">Danh sách tác vụ tự động</span>
      </div>

      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Tác vụ / Mô tả</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Lịch chạy</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Trạng thái</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Lần cuối chạy</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Dự kiến lần tới</th>
            <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Điều khiển</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {jobs.map((job) => (
            <tr key={job.slug} className="group hover:bg-white/[0.01] transition-all">
              <td className="py-5 px-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-all">
                    <Activity size={18} className="text-primary/60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">{job.name}</span>
                    <span className="text-xs font-bold text-base-content/30 tracking-wider max-w-xs">{job.description}</span>
                    {job.last_error && (
                      <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-danger/5 border border-danger/10 w-fit">
                         <AlertCircle size={8} className="text-danger" />
                         <span className="text-xs font-bold text-danger/80">{job.last_error}</span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                 <code className="text-xs font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">{job.schedule}</code>
              </td>
              <td className="py-5 px-6 text-center">
                <AdminBadge tone={job.last_status === "success" ? "success" : job.last_status === "failed" ? "danger" : "neutral"}>
                  {job.last_status === 'success' ? 'THÀNH CÔNG' : job.last_status === 'failed' ? 'THẤT BẠI' : 'CHỜ CHẠY'}
                </AdminBadge>
              </td>
              <td className="py-5 px-6 text-center">
                <div className="flex flex-col items-center">
                   <span className="text-xs font-bold text-base-content/60">{formatDate(job.last_run_at)}</span>
                   {job.last_duration_ms > 0 && <span className="text-xs font-mono font-bold text-base-content/20">{job.last_duration_ms}ms</span>}
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                <span className="text-xs font-bold text-white/20">{formatDate(job.next_run_estimated_at)}</span>
              </td>
              <td className="py-5 px-6 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => runJob(job)}
                  disabled={runningSlug === job.slug}
                  className="h-9 px-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-semibold tracking-wider hover:bg-primary/10 hover:border-primary/20 transition-all"
                >
                  {runningSlug === job.slug ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} className="mr-1.5" />}
                  {runningSlug === job.slug ? "ĐANG CHẠY" : "KÍCH HOẠT"}
                </Button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && !loading && (
            <tr><td colSpan="6" className="py-32"><AdminEmptyState icon={Terminal} title="Không tìm thấy tác vụ" description="Hệ thống tự động hóa hiện chưa có tác vụ nào được đăng ký." /></td></tr>
          )}
        </tbody>
      </AdminTable>
    </div>
  );
}

export default CronPage;




