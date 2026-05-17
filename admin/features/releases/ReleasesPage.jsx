import React, { useEffect, useState, useCallback } from "react";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT } from "@/_shared/lib/translations";
import { 
  Button, 
  IconButton 
} from "@/_shared/components/ui";
import { 
  Plus, 
  X, 
  Download, 
  Edit2, 
  Package, 
  Terminal,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

import { 
  AdminPageHeader, 
  AdminBadge, 
  AdminTable, 
  AdminEmptyState
} from "../../_shared/components";

import { ReleasesPageSkeleton } from "./skeleton";
import { releasesApi } from "./api";
import './ReleasesPage.css';

/**
 * ReleasesPage: Quản lý các phiên bản ứng dụng và tệp thực thi hệ thống.
 */
export function ReleasesPage() {
  const t = useAdminT();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withDelay(releasesApi.list(), 600);
      setReleases(res?.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && releases.length === 0) return <ReleasesPageSkeleton />;

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title="Phiên bản ứng dụng"
        tagline="Kho lưu trữ tập trung cho các tệp thực thi và bản cập nhật phần mềm hệ thống"
        badge="Releases"
        actions={
          <Button as={Link} to="/admin/releases/new" variant="primary" className="h-10 px-6 rounded-xl font-semibold tracking-wider text-xs">
            <Plus size={16} className="mr-2" /> {t.upload_release_btn}
          </Button>
        }
      />

      <div className="flex items-center gap-3 px-2">
         <Activity size={14} className="text-primary/60" />
         <span className="text-xs font-semibold tracking-wider text-base-content/30">Danh mục tệp thực thi</span>
      </div>
  
      <AdminTable>
        <thead>
          <tr className="bg-base-content/[0.02]">
            <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Mã ứng dụng (Slug)</th>
            <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Phiên bản</th>
            <th className="py-4 px-6 text-left font-semibold tracking-wider text-xs opacity-40">Cấp độ yêu cầu</th>
            <th className="py-4 px-6 text-center font-semibold tracking-wider text-xs opacity-40">Độ ổn định</th>
            <th className="py-4 px-6 text-right font-semibold tracking-wider text-xs opacity-40">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {releases.length === 0 && !loading ? (
            <tr><td colSpan="5" className="py-32"><AdminEmptyState icon={Package} title="Không tìm thấy phiên bản nào" description="Kho lưu trữ tệp thực thi hiện đang trống." /></td></tr>
          ) : (
            releases.map((r) => (
              <tr 
                key={r.id} 
                className={`group transition-all hover:bg-base-content/[0.01] ${r.is_yanked ?"opacity-30 grayscale blur-[0.5px]" : ""}`}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-all">
                      <Terminal size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-base-content group-hover:text-primary transition-colors tracking-wider">
                      {r.plugin_slug}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-base-content bg-base-content/5 px-2 py-0.5 rounded border border-base-content/5 w-fit">v{r.version}</span>
                      <span className="text-xs font-bold text-base-content/10 tracking-wider mt-1">Build Stable</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <AdminBadge tone={r.tier_required === "pro" ? "brand" : r.tier_required === "max" ? "warning" : "neutral"}>
                    {r.tier_required}
                  </AdminBadge>
                </td>
                <td className="py-5 px-6 text-center">
                  {r.is_yanked ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/5 border border-danger/20 text-xs font-bold text-danger tracking-wider">
                       <X size={10} strokeWidth={4} /> ĐÃ THU HỒI
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/5 border border-success/20 text-xs font-bold text-success tracking-wider">
                       <div className="w-1.5 h-1.5 bg-success rounded-full" /> Ổn định
                    </div>
                  )}
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-300">
                    <IconButton 
                      icon={Download} 
                      label="Tải về ZIP" 
                      onClick={() => window.open(`/v1/updates/download/${r.plugin_slug}/${r.version}`, "_blank")}
                      className="hover:text-primary"
                    />
                    <IconButton 
                      icon={Edit2} 
                      label="Sửa thông tin" 
                      onClick={() => {}}
                      className="hover:text-primary"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

    </div>
  );
}


export default ReleasesPage;




