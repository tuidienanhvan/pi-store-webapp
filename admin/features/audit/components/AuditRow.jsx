import React from "react";
import { ChevronRight, Plus, Edit2, Trash2, Shield, Check, Layers, Key, User, Info } from "lucide-react";
import { AdminCard, AdminBadge } from "../../../_shared/components";
import { formatDateTime, formatRelative } from "@/_shared/lib/translations";

const SEVERITY_TONES = { info: "neutral", warning: "warning", critical: "danger" };
const ACTION_ICONS = { create: Plus, update: Edit2, delete: Trash2, revoke: Shield, reactivate: Check, allocate: Layers, assign: Key, login: User };

const SEVERITY_LABELS = { info: "THÔNG TIN", warning: "CẢNH BÁO", critical: "NGHIÊM TRỌNG" };

/**
 * AuditRow: Hiển thị một dòng nhật ký với khả năng mở rộng xem chi tiết diff.
 */
export function AuditRow({ entry, locale, expanded, onToggle }) {
  const ActionIcon = ACTION_ICONS[entry.action] || Info;
  const severityTone = SEVERITY_TONES[entry.severity] || "neutral";
  const hasDiff = Boolean(entry.before || entry.after);

  return (
    <>
      <tr className={`group transition-all duration-300 ${hasDiff ?"cursor-pointer hover:bg-white/[0.02]" : ""} ${expanded ? "bg-primary/[0.03]" : ""}`} 
        onClick={hasDiff ? onToggle : undefined}>
        <td className="py-5 px-4 text-center">
          {hasDiff ? (
            <div className={`transition-transform duration-300 ${expanded ?"rotate-90 text-primary" : "text-white/10 group-hover:text-white/30"}`}>
               <ChevronRight size={14} />
            </div>
          ) : null}
        </td>
        <td className="py-5 px-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-base-content/80 tracking-tight">{formatRelative(entry.created_at, locale)}</span>
            <span className="text-xs font-mono font-bold text-base-content/20 tracking-tighter">{formatDateTime(entry.created_at, locale)}</span>
          </div>
        </td>
        <td className="py-5 px-6 max-w-[200px]">
          <div className="flex flex-col gap-0.5">
             <span className="text-xs font-bold text-primary/80 truncate tracking-tight">{entry.actor_email || "HỆ THỐNG"}</span>
             {entry.ip_address && <span className="text-xs font-mono font-bold text-base-content/20">@{entry.ip_address}</span>}
          </div>
        </td>
        <td className="py-5 px-6">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 w-fit">
            <ActionIcon size={12} className="text-primary/60" />
            <span className="text-xs font-semibold tracking-wider text-base-content/80">{entry.action}</span>
          </div>
        </td>
        <td className="py-5 px-6">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-base-content/60">{entry.resource_type}</span>
            {entry.resource_id && <span className="text-xs font-mono font-bold text-white/10">ID: #{entry.resource_id}</span>}
          </div>
        </td>
        <td className="py-5 px-6 min-w-[250px]">
          <p className="text-xs font-bold text-base-content/60 leading-relaxed group-hover:text-base-content transition-colors">{entry.message}</p>
        </td>
        <td className="py-5 px-6 text-center">
          <AdminBadge tone={severityTone}>{SEVERITY_LABELS[entry.severity] || entry.severity}</AdminBadge>
        </td>
      </tr>

      {expanded && hasDiff && (
        <tr className="bg-black/40">
          <td colSpan="7" className="p-8">
            <AdminCard className="p-8 border-primary/10">
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {entry.before && (
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-danger rounded-full" />
                          <span className="text-xs font-semibold tracking-wider text-danger/60">Trạng thái cũ</span>
                       </div>
                       <pre className="p-5 rounded-xl bg-danger/5 border border-danger/10 text-xs font-mono text-danger/80 overflow-auto max-h-60 custom-scrollbar">
                          {JSON.stringify(entry.before, null, 2)}
                       </pre>
                    </div>
                  )}
                  {entry.after && (
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-success rounded-full" />
                          <span className="text-xs font-semibold tracking-wider text-success/60">Trạng thái mới</span>
                       </div>
                       <pre className="p-5 rounded-xl bg-success/5 border border-success/10 text-xs font-mono text-success/80 overflow-auto max-h-60 custom-scrollbar">
                          {JSON.stringify(entry.after, null, 2)}
                       </pre>
                    </div>
                  )}
               </div>
            </AdminCard>
          </td>
        </tr>
      )}
    </>
  );
}




