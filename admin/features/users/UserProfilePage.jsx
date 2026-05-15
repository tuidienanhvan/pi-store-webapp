import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import { useAdminT, formatDate, formatCurrencyUSD } from "@/_shared/lib/translations";
import { 
  Button, 
  Input, 
  IconButton, 
  Alert 
} from "@/_shared/components/ui";
import { 
  UserX, 
  ArrowLeft, 
  Clock, 
  LogIn, 
  Globe, 
  Key, 
  EyeOff, 
  Eye, 
  Copy, 
  ShieldCheck, 
  Save, 
  Lightbulb,
  Fingerprint,
  Box,
  Terminal,
  ChevronLeft,
  Mail,
  Zap,
  Shield
} from "lucide-react";

import { 
  AdminPageHeader, 
  AdminCard, 
  AdminBadge, 
  AdminStatCard
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { toast } from "sonner";
import { usersApi } from "./api";

/**
 * UserProfilePage: Hồ sơ chi tiết người dùng và cấu hình tích hợp hệ thống.
 */
export function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useAdminT();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [siteUrl, setSiteUrl] = useState("");
  const [appPassword, setAppPassword] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await withDelay(usersApi.get(id), 600);
        setUser(res);
        setSiteUrl(res.site_url || "");
        setAppPassword(res.application_password || "");
      } catch (err) {
        console.error(err);
        toast.error("Không thể kết nối với định danh người dùng.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await usersApi.updateProfile(id, {
        site_url: siteUrl,
        application_password: appPassword,
      });
      setUser(updated);
      toast.success("Cập nhật thông tin định danh thành công.");
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu thay đổi hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép mã xác thực.");
  };

  if (loading) return <AdminTableSkeleton />;
  
  if (!user) return (
    <div className="p-20 flex flex-col items-center justify-center text-center">
      <AdminCard className="p-16 flex flex-col items-center gap-6 max-w-md">
        <UserX size={64} className="text-danger opacity-40" />
        <div className="flex flex-col gap-2">
           <h2 className="text-xl font-semibold tracking-wider text-base-content">Không tìm thấy người dùng</h2>
           <p className="text-xs font-bold text-base-content/40">Định danh người dùng được yêu cầu không tồn tại trong hệ thống.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/admin/users")} className="h-10 px-8 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
           <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
        </Button>
      </AdminCard>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-8">
      <AdminPageHeader 
        title={user.name || "Người dùng chưa đặt tên"}
        tagline={`ID Người dùng: ${user.id} — Định danh: ${user.email}`}
        actions={
          <div className="flex items-center gap-3">
             <Link to="/admin/users">
                <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
                   <ChevronLeft size={14} className="mr-1" /> Danh sách
                </Button>
             </Link>
             <AdminBadge tone={user.is_admin ? "brand" : "neutral"} className="h-10 px-6">
                {user.is_admin ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG"}
             </AdminBadge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin tóm tắt */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AdminCard className="p-0 overflow-hidden">
             <div className="h-24 bg-gradient-to-br from-primary/10 to-brand/10 border-b border-white/5 relative">
                <div className="absolute top-4 right-4 text-xs font-medium text-primary/60">Đang hoạt động</div>
             </div>
             
             <div className="px-8 pb-10 -mt-12 relative flex flex-col items-center">
                <div className="relative group">
                  <img 
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                    alt={user.name}
                    className="relative w-24 h-24 rounded-2xl bg-base-200 object-cover border-4 border-[#121212] shadow-2xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-lg border-4 border-[#0a0a0a] flex items-center justify-center">
                     <Zap size={10} className="text-white" />
                  </div>
                </div>
                
                <h2 className="mt-4 text-lg font-bold text-white tracking-tight">{user.name || "CHƯA CÓ TÊN"}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-base-content/30 tracking-wider mt-1">
                   <Mail size={10} /> {user.email}
                </div>
                
                <div className="w-full h-px bg-white/5 my-8" />
                
                <div className="grid grid-cols-2 gap-4 w-full">
                   <AdminStatCard label="Giấy phép" value={user.license_count || 0} icon={Box} tone="primary" />
                   <AdminStatCard label="Số dư" value={formatCurrencyUSD(user.token_balance || 0, "vi")} icon={Zap} tone="success" />
                </div>
             </div>
          </AdminCard>

          <AdminCard className="p-6 flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary/60 border border-primary/10">
                   <Clock size={16} />
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-xs font-semibold text-base-content/30 tracking-widest">Ngày khởi tạo</span>
                   <span className="text-xs font-bold text-base-content/80">{formatDate(user.created_at, "vi")}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center text-brand/60 border border-brand/10">
                   <LogIn size={16} />
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-xs font-semibold text-base-content/30 tracking-widest">Lần cuối đăng nhập</span>
                   <span className="text-xs font-bold text-base-content/80 italic">{user.last_login_at ? formatDate(user.last_login_at, "vi") : "CHƯA CÓ DỮ LIỆU"}</span>
                </div>
             </div>
          </AdminCard>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
             <Fingerprint size={24} className="text-primary/40" />
             <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-base-content/30">Mã truy cập hệ thống</span>
                <code className="text-xs font-mono font-bold text-primary/60">PI-ID: {user.id.toString().padStart(8, '0')}</code>
             </div>
          </div>
        </div>

        {/* Cấu hình tích hợp */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AdminCard className="p-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold tracking-wider text-white m-0">Dữ liệu tích hợp hệ thống</h3>
                <p className="text-xs font-bold text-base-content/30 tracking-wide">Cấu hình các tham số kết nối REST API cho các điểm cuối của khách hàng.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-10">
              <div className="grid grid-cols-1 gap-8">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold tracking-wider text-primary/60 ml-1">
                    URL Trang web (Node Interface)
                  </label>
                  <Input 
                    placeholder="https://client-node.com"
                    leadingIcon={Globe}
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 font-bold text-sm"
                  />
                  <p className="text-xs font-bold text-base-content/20 tracking-wider ml-1 flex items-center gap-2">
                     <Terminal size={10} /> Trang WordPress đang chạy hệ thống Pi Plugin.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold tracking-wider text-primary/60 ml-1">
                    MÃ XÁC THỰC ỨNG DỤNG (AUTH TOKEN)
                  </label>
                  <div className="flex gap-3">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="xxxx xxxx xxxx xxxx"
                      leadingIcon={Key}
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                      className="flex-1 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 font-mono text-sm tracking-widest"
                    />
                    <div className="flex gap-2">
                      <IconButton 
                        icon={showPassword ? EyeOff : Eye} 
                        size="sm" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10"
                      />
                      <IconButton 
                        icon={Copy} 
                        size="sm" 
                        onClick={() => copyToClipboard(appPassword)}
                        className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10"
                      />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-base-content/20 tracking-wider ml-1 flex items-center gap-2">
                     <Shield size={10} /> Mật khẩu ứng dụng WordPress cho các hoạt động REST API.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-primary/40">
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={saving}
                  className="h-14 px-10 rounded-2xl font-semibold tracking-wider text-xs"
                >
                  <Save size={16} className="mr-3" />
                  Lưu cấu hình
                </Button>
              </div>
            </form>
          </AdminCard>

          {/* Hướng dẫn tích hợp */}
          <Alert tone="info" className="bg-primary/5 border-primary/10 rounded-3xl p-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <Lightbulb size={28} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold tracking-wider text-primary">Hướng dẫn tích hợp hệ thống</h4>
                <p className="text-xs font-bold text-primary/60 leading-relaxed tracking-tight">
                  Mật khẩu ứng dụng cho phép Pi AI Cloud thực hiện đồng bộ hóa tự động (Bài viết mới, Kiểm tra SEO, Kiểm tra hiệu suất) mà không cần quyền truy cập root đầy đủ. Đảm bảo trang WordPress đã bật REST API để kết nối thông suốt.
                </p>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;





