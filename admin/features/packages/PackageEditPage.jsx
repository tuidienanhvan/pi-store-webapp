import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { withDelay } from "@/_shared/api/api-client";
import {
  Alert,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
  Switch,
} from "@/_shared/components/ui";
import { ArrowLeft, Plus, X, ShieldCheck } from "lucide-react";

import {
  AdminPageHeader,
  AdminCard,
  FormField,
  FormSection,
} from "../../_shared/components";

import { AdminTableSkeleton } from "@/_shared/skeletons/AdminTableSkeleton";
import { packagesApi } from "./api";

const QUALITIES = ["fast", "balanced", "best"];

const EMPTY_FORM = {
  slug: "",
  display_name: "",
  description: "",
  price_cents_monthly: 0,
  price_cents_yearly: 0,
  token_quota_monthly: 0,
  allowed_qualities: ["fast"],
  routing_mode: "shared",
  allowed_tiers: ["free"],
  priority_boost: 0,
  dedicated_key_count: 0,
  features: [],
  sort_order: 100,
  is_active: true,
};

export function PackageEditPage() {
  const { slug: slugParam } = useParams();
  const navigate = useNavigate();
  const isNew = !slugParam;

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Load existing pkg if editing
  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await withDelay(packagesApi.list(), 400);
      const found = (res.items || []).find((p) => p.slug === slugParam);
      if (!found) {
        setErr(`Không tìm thấy gói "${slugParam}"`);
        return;
      }
      setForm({
        ...EMPTY_FORM,
        ...found,
        allowed_qualities: [...(found.allowed_qualities || ["fast"])],
        allowed_tiers: [...(found.allowed_tiers || ["free"])],
        features: [...(found.features || [])],
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [isNew, slugParam]);

  useEffect(() => { load(); }, [load]);

  const toggleQuality = (q) => {
    const cur = new Set(form.allowed_qualities);
    if (cur.has(q)) cur.delete(q); else cur.add(q);
    setForm({ ...form, allowed_qualities: Array.from(cur) });
  };
  const toggleTier = (t) => {
    const cur = new Set(form.allowed_tiers);
    if (cur.has(t)) cur.delete(t); else cur.add(t);
    setForm({ ...form, allowed_tiers: Array.from(cur) });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      if (isNew) {
        await packagesApi.create(form);
      } else {
        await packagesApi.update(form.slug, form);
      }
      navigate("/admin/packages");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminTableSkeleton />;

  return (
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader
        title={isNew ? "Tạo gói dịch vụ mới" : `Cấu hình gói: ${form.display_name || form.slug}`}
        tagline={isNew ? "Định nghĩa giá, hạn mức và chính sách định tuyến sản phẩm" : `Quản lý thông số kỹ thuật cho mã hệ thống: ${form.slug}`}
        actions={
          <Button as={Link} to="/admin/packages" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-xs">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Thông tin & Định giá */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Thông tin định danh" icon={ShieldCheck}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Mã hệ thống (Slug)" required hint="Định danh duy nhất, không dấu">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
                  placeholder="pro-tier"
                  disabled={!isNew}
                  required
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              <FormField label="Tên hiển thị" required hint="Tên gói trên bảng giá">
                <Input
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="Gói Chuyên Nghiệp"
                  required
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
            </div>
            <div className="mt-6">
              <FormField label="Mô tả sản phẩm">
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả chi tiết các quyền lợi của gói..."
                  className="bg-white/5 border-white/10 rounded-2xl p-4 focus:border-primary/50 transition-all"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Định giá & Hạn mức Token" icon={Zap}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Giá hàng tháng (¢)">
                <Input
                  type="number"
                  value={form.price_cents_monthly}
                  onChange={(e) => setForm({ ...form, price_cents_monthly: Number(e.target.value) })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              <FormField label="Giá hàng năm (¢)">
                <Input
                  type="number"
                  value={form.price_cents_yearly}
                  onChange={(e) => setForm({ ...form, price_cents_yearly: Number(e.target.value) })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              <FormField label="Hạn mức Token tháng" hint="0 = Không giới hạn">
                <Input
                  type="number"
                  value={form.token_quota_monthly}
                  onChange={(e) => setForm({ ...form, token_quota_monthly: Number(e.target.value) })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
              <FormField label="Ưu tiên định tuyến (0-100)" hint="Độ ưu tiên xử lý trong pool">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.priority_boost}
                  onChange={(e) => setForm({ ...form, priority_boost: Number(e.target.value) })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Tính năng & Chất lượng">
            <div className="flex flex-col gap-6">
              <FormField label="Chất lượng kết nối cho phép">
                <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  {QUALITIES.map((q) => (
                    <Checkbox
                      key={q}
                      label={q.charAt(0).toUpperCase() + q.slice(1)}
                      checked={form.allowed_qualities.includes(q)}
                      onChange={() => toggleQuality(q)}
                      className="accent-primary"
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Danh sách tính năng đi kèm" hint="Mỗi dòng là một tính năng">
                <div className="flex flex-col gap-3">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-3">
                      <Input
                        value={f}
                        onChange={(e) => {
                          const nf = [...form.features];
                          nf[i] = e.target.value;
                          setForm({ ...form, features: nf });
                        }}
                        className="flex-1 h-10 bg-white/5 border-white/10 rounded-xl"
                        placeholder="VD: Support 24/7"
                      />
                      <IconButton
                        icon={X}
                        label="Xoá"
                        size="sm"
                        onClick={() => {
                          const nf = [...form.features];
                          nf.splice(i, 1);
                          setForm({ ...form, features: nf });
                        }}
                        className="h-10 w-12 rounded-xl bg-danger/5 text-danger hover:bg-danger/10 border border-danger/10"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForm({ ...form, features: [...form.features, ""] })}
                    className="self-start h-10 px-4 rounded-xl border border-dashed border-white/10 text-xs font-semibold"
                  >
                    <Plus size={14} className="mr-2" /> Thêm tính năng mới
                  </Button>
                </div>
              </FormField>
            </div>
          </FormSection>
        </div>

        {/* Cột phụ: Gateway & Status */}
        <div className="flex flex-col gap-8">
          <FormSection title="Cấu hình Gateway" icon={ShieldCheck}>
            <div className="flex flex-col gap-6">
              <FormField label="Chế độ định tuyến">
                <div className="flex flex-col gap-3">
                  {[
                    { val: "shared", lab: "Bể chung (Shared)", desc: "Mọi gói dùng chung pool keys" },
                    { val: "dedicated", lab: "Khóa riêng (Dedicated)", desc: "Sử dụng key được cấp riêng" },
                    { val: "hybrid", lab: "Dự phòng (Hybrid)", desc: "Thử dedicated trước, fallback shared" },
                  ].map((m) => (
                    <label key={m.val} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${form.routing_mode === m.val ? "bg-primary/5 border-primary/20" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}>
                      <input
                        type="radio"
                        name="routing_mode"
                        value={m.val}
                        checked={form.routing_mode === m.val}
                        onChange={() => setForm({ ...form, routing_mode: m.val })}
                        className="mt-1 accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${form.routing_mode === m.val ? "text-primary" : "text-white"}`}>{m.lab}</span>
                        <span className="text-xs text-base-content/40 leading-snug mt-0.5">{m.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Cấp độ Provider">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Checkbox
                    label="Miễn phí"
                    checked={form.allowed_tiers.includes("free")}
                    onChange={() => toggleTier("free")}
                  />
                  <Checkbox
                    label="Trả phí"
                    checked={form.allowed_tiers.includes("paid")}
                    onChange={() => toggleTier("paid")}
                  />
                </div>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Vận hành">
            <div className="flex flex-col gap-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                 <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white">Trạng thái gói</span>
                    <span className="text-xs text-base-content/40">Cho phép người dùng mua</span>
                 </div>
                 <Switch
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                 />
              </div>

              <FormField label="Thứ tự hiển thị" hint="Số nhỏ sẽ đứng trước">
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                />
              </FormField>
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-xl shadow-primary/10"
             >
               {saving ? "ĐANG LƯU..." : isNew ? "XÁC NHẬN TẠO GÓI" : "LƯU THAY ĐỔI CẤU HÌNH"}
             </Button>
             
             <Button as={Link} to="/admin/packages" variant="ghost" className="h-10 w-full rounded-xl border border-white/5 text-xs font-semibold text-base-content/40">
               Hủy bỏ
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PackageEditPage;




