import React, { useState, useEffect, useCallback } from "react";
import { 
  Button, 
  Alert 
} from "@/_shared/components/ui";
import { Clock, RefreshCw, Play } from "lucide-react";
import { AdminTable, AdminBadge } from "../../../_shared/components";
import { settingsApi } from "../api";
import './CronCard.css';

/**
 * CronCard: Giám sát và điều khiển các tác vụ tự động chạy ngầm (Cron Jobs).
 */
export function CronCard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(null);
  const [msg, setMsg] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await settingsApi.cronStatus();
      setJobs(r.jobs || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const executeJob = async (slug) => {
    setRunning(slug); setMsg("");
    try {
      const r = await settingsApi.runCron(slug);
      setMsg(`Tác vụ ${slug}: Chạy ${r.status} (${r.duration_ms}ms)`);
      loadJobs();
    } catch (e) { setMsg(`Lỗi ${slug}: ${e.message}`); }
    finally { setRunning(null); setTimeout(() => setMsg(""), 5000); }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
         <Clock size={18} className="text-primary/60" />
         <h2 className="text-xs font-semibold tracking-wider text-base-content/40">Tác vụ tự động chạy ngầm (Cron)</h2>
      </div>
      
      {msg && <Alert tone="info" className="rounded-xl border-primary/20 bg-primary/5 text-primary font-semibold text-xs tracking-widest">{msg}</Alert>}
      
      <AdminTable>
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Tên tác vụ / Mô tả</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Lịch chạy</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Lần cuối</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Trạng thái</th>
            <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {!loading && jobs.map((j) => (
            <tr key={j.slug} className="group hover:bg-white/[0.01] transition-all">
              <td className="py-5 px-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-white tracking-tight">{j.name}</span>
                  <span className="text-xs font-bold text-base-content/30 tracking-wider">{j.description}</span>
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                 <code className="text-xs font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded">{j.schedule}</code>
              </td>
              <td className="py-5 px-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-base-content/60">{j.last_run_at ? new Date(j.last_run_at).toLocaleString("vi-VN") : "CHƯA TỪNG CHẠY"}</span>
                  {j.last_duration_ms > 0 && (
                    <span className="text-xs font-mono font-bold text-base-content/20 italic">{j.last_duration_ms}ms</span>
                  )}
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                <AdminBadge tone={j.last_status === "success" ? "success" : j.last_status === "failed" ? "danger" : "neutral"}>
                  {j.last_status || "Chờ chạy"}
                </AdminBadge>
              </td>
              <td className="py-5 px-6 text-right">
                <Button size="sm" variant="ghost" disabled={running === j.slug} onClick={() => executeJob(j.slug)} className="h-9 px-4 rounded-xl border border-white/5 text-xs font-semibold tracking-wider bg-white/[0.02] hover:bg-primary/10 hover:border-primary/20">
                  {running === j.slug ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </section>
  );
}





