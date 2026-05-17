import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Input } from "@/_shared/components/ui";
import { toast } from "sonner";
import { ArrowLeft, Building2, Save } from "lucide-react";

import {
  AdminPageHeader,
  AdminCard,
  FormField,
  FormSection,
} from "../../_shared/components";

import { tenantsApi } from "./api";

const TIERS = ["free", "pro", "max", "enterprise"];
const STATUSES = ["active", "suspended", "pending"];

export function TenantCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    license_key: "",
    domain: "",
    site_url: "",
    tier: "free",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.license_key.length < 8) {
      setErr("License key phải ≥ 8 ký tự.");
      return;
    }
    if (!form.domain.trim()) {
      setErr("Domain bắt buộc.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await tenantsApi.create(form);
      toast.success(`Đã tạo tenant cho ${created.domain}`);
      navigate(`/admin/tenants/${created.id}`);
    } catch (e2) {
      console.error("[tenant create] failed", e2);
      const msg = e2?.message || e2?.data?.detail || "Tạo tenant thất bại.";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pi-tenant-create flex flex-col gap-8">
      <AdminPageHeader
        icon={Building2}
        title="Thêm khách hàng mới"
        description="Tạo tenant SaaS — gắn license + domain + tier ban đầu. Ví specifies wallet sẽ tự khởi tạo với quota theo tier."
        actions={
          <Link to="/admin/tenants">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        }
      />

      <AdminCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
          {err && <Alert tone="error">{err}</Alert>}

          <FormSection title="Định danh" description="License key + domain định danh duy nhất của tenant.">
            <FormField label="License key" required>
              <Input
                placeholder="pi_xxxxxxxxxxxxxxxx"
                value={form.license_key}
                onChange={set("license_key")}
                disabled={submitting}
              />
              <p className="text-xs opacity-50 mt-1">Tự động uppercase. Tối thiểu 8 ký tự.</p>
            </FormField>

            <FormField label="Domain" required>
              <Input
                placeholder="customer-site.com"
                value={form.domain}
                onChange={set("domain")}
                disabled={submitting}
              />
              <p className="text-xs opacity-50 mt-1">Server tự lowercase + strip scheme.</p>
            </FormField>

            <FormField label="Site URL (optional)">
              <Input
                placeholder="https://customer-site.com"
                value={form.site_url}
                onChange={set("site_url")}
                disabled={submitting}
              />
            </FormField>
          </FormSection>

          <FormSection title="Tier & Trạng thái">
            <FormField label="Tier">
              <select
                className="h-11 px-4 rounded-xl bg-base-200/30 border border-base-content/10"
                value={form.tier}
                onChange={set("tier")}
                disabled={submitting}
              >
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <p className="text-xs opacity-50 mt-1">
                Features + monthly quota auto-applied từ tier (xem TIER-MATRIX.md).
              </p>
            </FormField>

            <FormField label="Status">
              <select
                className="h-11 px-4 rounded-xl bg-base-200/30 border border-base-content/10"
                value={form.status}
                onChange={set("status")}
                disabled={submitting}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </FormSection>

          <div className="flex items-center gap-3 pt-6 border-t border-base-content/5">
            <Button type="submit" variant="primary" disabled={submitting}>
              <Save className="w-4 h-4" />
              {submitting ? "Đang tạo..." : "Tạo tenant"}
            </Button>
            <Link to="/admin/tenants">
              <Button variant="ghost" disabled={submitting}>Hủy</Button>
            </Link>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

export default TenantCreatePage;
