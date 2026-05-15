import React, { useState } from "react";
import { EyeOff, Eye, Check, Copy, Edit2, Slash, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { IconButton } from "@/_shared/components/ui";
import { copyToClipboard, maskKey } from "@/_shared/lib/format";
import { formatTokens } from "@/_shared/lib/translations";
import { AdminBadge } from "../../../_shared/components/AdminBadge";

/**
 * LicenseRow: Hiển thị một dòng dữ liệu giấy phép trong bảng.
 */
export function LicenseRow({ l, onOpen, onRevoke, onReactivate, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  const copy = async () => {
    if (await copyToClipboard(l.key)) {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    }
  };

  const statusTone = l.status === "active" ? "success" : l.status === "revoked" ? "danger" : "warning";
  const quotaPct = Math.min(100, l.quota_pct || 0);

  // Chuyển đổi trạng thái sang tiếng Việt
  const statusLabel = {
    active: "Hoạt động",
    revoked: "Đã thu hồi",
    expired: "Hết hạn"
  }[l.status] || l.status;

  return (
    <tr className="group hover:bg-white/[0.01] transition-all duration-300">
      <td className="py-6 px-6 font-mono text-[10px] text-base-content/40">#{l.id}</td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-3 py-2 w-fit group/key">
          <code className="text-xs font-mono font-bold text-primary/80">
            {showKey ? l.key : maskKey(l.key, 8, 4)}
          </code>
          <div className="flex items-center gap-1 opacity-60 group-hover/key:opacity-100 transition-opacity">
            <button onClick={() => setShowKey(!showKey)} className="p-1 hover:text-primary transition-colors">
              {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button onClick={copy} className={`p-1 transition-colors ${copied ?"text-success" : "hover:text-primary"}`}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </td>
      <td className="py-6 px-6">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">{l.email}</span>
          <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">{l.plugin}</span>
        </div>
      </td>
      <td className="py-6 px-6">
        {l.package_slug ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AdminBadge tone="brand">{l.package_name}</AdminBadge>
              <span className="text-[10px] font-mono font-bold text-base-content/60">
                {formatTokens(l.quota_used)}/{formatTokens(l.quota_limit)}
              </span>
            </div>
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${quotaPct > 90 ?'bg-danger' : quotaPct > 70 ? 'bg-warning' : 'bg-primary'}`} 
                 style={{ width: `${quotaPct}%` }} 
               />
            </div>
          </div>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/20 italic">Chưa gán gói</span>
        )}
      </td>
      <td className="py-6 px-6 text-center">
        <div className="flex flex-col items-center">
          <span className={`text-sm font-bold ${l.activated_sites >= l.max_sites ?"text-warning" : "text-base-content/80"}`}>
            {l.activated_sites}
          </span>
          <div className="w-8 h-[1px] bg-white/10 my-1" />
          <span className="text-[10px] font-bold text-base-content/30 uppercase">{l.max_sites} Lượt</span>
        </div>
      </td>
      <td className="py-6 px-6 text-center">
        <AdminBadge tone={statusTone}>{statusLabel}</AdminBadge>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                   <IconButton as={Link} to={`/admin/licenses/${l.id}`} icon={Edit2} label="Chỉnh sửa" size="sm" className="hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20" />

          {l.status === "active" ? (
             <IconButton icon={Slash} label="Thu hồi" size="sm" onClick={onRevoke} className="hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20" />
          ) : (
             <IconButton icon={Check} label="Kích hoạt" size="sm" onClick={onReactivate} className="hover:bg-success/10 hover:text-success border border-transparent hover:border-success/20" />
          )}
          <IconButton icon={Trash2} label="Xóa" size="sm" onClick={onDelete} className="hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20" />
        </div>
      </td>
    </tr>
  );
}
