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
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      <AdminPageHeader
        title={isNew ? "Tạo gói dịch vụ mới" : `Cấu hình gói: ${form.display_name || form.slug}`}
        tagline={isNew ? "Định nghĩa giá, hạn mức và chính sách định tuyến" : `Mã hệ thống: ${form.slug}`}
        actions={
          <Button as={Link} to="/admin/packages" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* Định danh */}
        <FormSection title="Định danh" description="Slug + tên hiển thị + mô tả gói">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Mã hệ thống (slug)" required hint="Chữ thường, không dấu, dùng làm khoá unique">
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
                placeholder="pro"
                disabled={!isNew}
                required
              />
            </FormField>
            <FormField label="Tên hiển thị" required>
              <Input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="Gói Chuyên nghiệp"
                required
              />
            </FormField>
          </div>
          <FormField label="Mô tả sản phẩm">
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Phù hợp cho freelancer hoặc team nhỏ. Bao gồm SEO + Chatbot..."
            />
          </FormField>
        </FormSection>

        {/* Định giá */}
        <FormSection title="Định giá & hạn mức">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Giá hàng tháng (¢)">
              <Input
                type="number"
                value={form.price_cents_monthly}
                onChange={(e) => setForm({ ...form, price_cents_monthly: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Giá hàng năm (¢)">
              <Input
                type="number"
                value={form.price_cents_yearly}
                onChange={(e) => setForm({ ...form, price_cents_yearly: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Hạn mức token tháng" hint="Nhập 0 = không giới hạn">
              <Input
                type="number"
                value={form.token_quota_monthly}
                onChange={(e) => setForm({ ...form, token_quota_monthly: Number(e.target.value) })}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Quality + features */}
        <FormSection title="Chất lượng & tính năng">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Chất lượng cho phép">
              <div className="flex flex-wrap gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                {QUALITIES.map((q) => (
                  <Checkbox
                    key={q}
                    label={q.charAt(0).toUpperCase() + q.slice(1)}
                    checked={form.allowed_qualities.includes(q)}
                    onChange={() => toggleQuality(q)}
                  />
                ))}
              </div>
            </FormField>

            <FormField label="Tính năng hệ thống" hint="Hiển thị trên pricing page">
              <div className="flex flex-col gap-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={f}
                      onChange={(e) => {
                        const nf = [...form.features];
                        nf[i] = e.target.value;
                        setForm({ ...form, features: nf });
                      }}
                      className="flex-1"
                      placeholder="VD: 50K token/tháng"
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
                      className="hover:text-danger"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setForm({ ...form, features: [...form.features, ""] })}
                  className="self-start"
                >
                  <Plus size={13} className="mr-1" /> Thêm tính năng
                </Button>
              </div>
            </FormField>
          </div>
        </FormSection>

        {/* Routing policy */}
        <FormSection
          title="Cấu hình điều phối Gateway"
          description="Chiến lược định tuyến + cấp độ provider"
          icon={ShieldCheck}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Chiến lược định tuyến">
              <div className="flex flex-col gap-2">
                {[
                  { val: "shared", lab: "Bể chung (Shared)", desc: "Mọi gói dùng chung pool" },
                  { val: "dedicated", lab: "Khoá riêng (Dedicated)", desc: "Cấp key riêng cho gói này" },
                  { val: "hybrid", lab: "Dự phòng (Hybrid)", desc: "Thử dedicated trước, fallback shared" },
                ].map((m) => (
                  <label key={m.val} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-white/[0.02] cursor-pointer">
                    <input
                      type="radio"
                      name="routing_mode"
                      value={m.val}
                      checked={form.routing_mode === m.val}
                      onChange={() => setForm({ ...form, routing_mode: m.val })}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${form.routing_mode === m.val ? "text-primary" : "text-base-content"}`}>{m.lab}</span>
                      <span className="text-xs text-base-content/50">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>

            <div className="flex flex-col gap-4">
              <FormField label="Cấp độ provider cho phép">
                <div className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
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
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Độ ưu tiên (0–100)">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form.priority_boost}
                    onChange={(e) => setForm({ ...form, priority_boost: Number(e.target.value) })}
                  />
                </FormField>
                <FormField label="Tự cấp khoá" hint="Số key cấp khi gán gói">
                  <Input
                    type="number"
                    min={0}
                    value={form.dedicated_key_count}
                    onChange={(e) => setForm({ ...form, dedicated_key_count: Number(e.target.value) })}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Display + status */}
        <FormSection title="Hiển thị & trạng thái">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField label="Thứ tự hiển thị" hint="Số nhỏ hơn hiển thị trước">
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </FormField>
            <div className="flex items-center gap-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
              <Switch
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Kích hoạt gói</span>
                <span className="text-xs text-base-content/50">Hiển thị trên trang Pricing</span>
              </div>
            </div>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to="/admin/packages" type="button" variant="ghost" className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="flex-1">
            {saving ? "Đang lưu..." : isNew ? "Tạo gói" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PackageEditPage;
