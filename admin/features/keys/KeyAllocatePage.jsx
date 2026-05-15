import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Alert, Button, Input } from "@/_shared/components/ui";
import { Key, ArrowLeft } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import { keysApi } from "./api";
import './KeyAllocatePage.css';

export function KeyAllocatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [keyObj, setKeyObj] = useState(null);
  const [licenseId, setLicenseId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    keysApi.list().then(res => {
      const found = (res.items || []).find(k => String(k.id) === id);
      setKeyObj(found);
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await keysApi.allocate({
        license_id: Number(licenseId),
        key_ids: [Number(id)],
      });
      navigate("/admin/keys");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (!keyObj) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="pi-key-allocate-page flex flex-col gap-6 pb-12 max-w-7xl">
      <AdminPageHeader 
        title="Cấp phát khóa bảo mật"
        tagline="Gán khóa API cho một giấy phép cụ thể"
        actions={
          <Button as={Link} to="/admin/keys" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="pi-key-allocate-page__form flex flex-col gap-5">
        <FormSection title="Thông tin khóa">
          <div className="pi-key-allocate-page__key-card p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Key size={16} />
            </div>
            <div className="flex flex-col">
              <code className="text-sm font-mono font-bold text-base-content/60">{keyObj.key_masked}</code>
              <span className="text-xs font-medium text-base-content/20">{keyObj.provider_slug}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Thiết lập cấp phát">
          <FormField label="ID giấy phép mục tiêu" required hint="Nhập ID số của giấy phép muốn cấp khóa này.">
            <Input
              type="number"
              min="1"
              required
              value={licenseId}
              onChange={(e) => setLicenseId(e.target.value)}
              placeholder="Ví dụ: 20260514"
              className="font-mono"
            />
          </FormField>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        <div className="pi-key-allocate-page__footer flex items-center gap-3 pt-3 sticky py-4 -mx-6 px-6">
          <Button as={Link} to="/admin/keys" type="button" variant="ghost" className="flex-1">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !licenseId} className="flex-1">
            {saving ? "Đang cấp phát..." : "Xác nhận cấp phát"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default KeyAllocatePage;



