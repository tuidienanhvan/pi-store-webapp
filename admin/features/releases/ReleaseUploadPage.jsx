import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Input, Select, Textarea } from "@/_shared/components/ui";
import { UploadCloud, ArrowLeft, Zap, ShieldPlus, Info } from "lucide-react";
import { FormField, FormSection, AdminPageHeader } from "../../_shared/components";
import { releasesApi } from "./api";
import './ReleaseUploadPage.css';

export function ReleaseUploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plugin_slug: "pi-api",
    version: "",
    tier_required: "free",
    changelog: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setErr("Vui lòng chọn tệp ZIP."); return; }
    setLoading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("plugin_slug", form.plugin_slug);
      fd.append("version", form.version);
      fd.append("tier_required", form.tier_required);
      fd.append("changelog", form.changelog);
      await releasesApi.upload(fd);
      navigate("/admin/releases");
    } catch (e2) {
      setErr("Lỗi phát hành: " + e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      <AdminPageHeader
        title="Phát hành phiên bản mới"
        tagline="Tải lên tệp thực thi và định nghĩa lộ trình cập nhật"
        actions={
          <Button as={Link} to="/admin/releases" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* ─── Thông tin phiên bản ─── */}
        <FormSection title="Thông tin phiên bản" icon={UploadCloud}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Ứng dụng mục tiêu" required hint="Sản phẩm sẽ nhận bản cập nhật">
              <Select
                value={form.plugin_slug}
                onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
                options={[{ label: "Pi-API Core", value: "pi-api" }]}
              />
            </FormField>
            <FormField label="Mã phiên bản" required hint="Semantic versioning, VD: 1.2.0">
              <Input
                placeholder="1.2.0"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="font-mono"
                required
              />
            </FormField>
          </div>
        </FormSection>

        {/* ─── Tệp ZIP ─── */}
        <FormSection title="Tệp thực thi" icon={UploadCloud}>
          <FormField label="Tải lên file .zip">
            <label className="relative flex flex-col items-center justify-center gap-2 h-32 rounded-xl border border-dashed border-base-content/10 bg-base-content/[0.02] hover:bg-primary/[0.04] hover:border-primary/30 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={20} className="text-base-content/40" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium text-base-content/70">
                  {file ? file.name : "Kéo thả hoặc bấm chọn tệp .zip"}
                </span>
                <span className="text-xs text-base-content/40">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Tệp nén .zip thực thi"}
                </span>
              </div>
            </label>
          </FormField>
        </FormSection>

        {/* ─── Changelog ─── */}
        <FormSection title="Nhật ký thay đổi" icon={Zap}>
          <FormField label="Changelog" hint="Hỗ trợ Markdown. Hiển thị cho người dùng khi cập nhật.">
            <Textarea
              rows={5}
              placeholder="Mô tả tính năng mới, cải tiến, sửa lỗi..."
              value={form.changelog}
              onChange={(e) => setForm({ ...form, changelog: e.target.value })}
            />
          </FormField>
        </FormSection>

        {/* ─── Phân quyền ─── */}
        <FormSection title="Phân quyền truy cập" icon={ShieldPlus}>
          <FormField label="Cấp độ tối thiểu (Tier)" hint="Khách hàng từ tier này trở lên sẽ nhận update">
            <div className="grid grid-cols-3 gap-2">
              {["free", "pro", "max"].map((tier) => {
                const active = form.tier_required === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setForm({ ...form, tier_required: tier })}
                    className={`flex items-center justify-center gap-2 h-10 px-3 rounded-md border text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-base-content/[0.02] border-base-content/10 text-base-content/60 hover:bg-base-content/5 hover:text-base-content"
                    }`}
                  >
                    <span className="capitalize">{tier}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </FormField>

          <div className="flex items-start gap-2.5 p-3 rounded-md bg-base-content/5 border border-base-content/5">
            <Info size={14} className="text-base-content/50 mt-0.5 shrink-0" />
            <p className="text-xs text-base-content/60 leading-relaxed">
              Bản phát hành <strong className="text-base-content">kích hoạt ngay</strong> cho mọi khách hàng từ tier đã chọn trở lên.
            </p>
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}

        {/* Sticky footer */}
        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-3 border-t border-base-content/5">
          <Button as={Link} to="/admin/releases" type="button" variant="ghost" className="flex-1">
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !file}
            className="flex-1"
          >
            {loading ? "Đang tải lên..." : "Phát hành"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReleaseUploadPage;
