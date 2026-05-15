import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Textarea } from "@/_shared/components/ui";
import { Info, ArrowLeft } from "lucide-react";
import { FormSection, AdminPageHeader } from "../../_shared/components";
import { keysApi } from "./api";
import { providersApi } from "../providers/api";

export function KeyBulkImportPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    providersApi.list().then(res => setProviders(res.items || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setResult(null);
    try {
      const rows = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [provider_slug, key_value, label = "", quota = "0"] = line.split(",").map((part) => part.trim());
          return {
            provider_slug,
            key_value,
            label,
            monthly_quota_tokens: Number(quota || 0),
          };
        })
        .filter((row) => row.provider_slug && row.key_value);

      if (!rows.length) throw new Error("Nhập ít nhất 1 dòng theo định dạng: provider_slug, key_value, label, quota");
      const res = await keysApi.bulkImport(rows);
      setResult(res);
      if (res.added > 0) {
        // Optional: navigate or show success
      }
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-7xl">
      <AdminPageHeader 
        title="Nhập khóa (Bulk Import)"
        tagline="Nhập danh sách khóa API số lượng lớn từ định dạng CSV"
        actions={
          <Button as={Link} to="/admin/keys" variant="ghost" size="sm">
            <ArrowLeft size={14} className="mr-1.5" /> Danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20 text-primary">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">ĐỊNH DẠNG CSV</span>
            <p className="text-xs font-medium leading-relaxed opacity-80">
              Quy tắc: <code>provider_slug, key_value, label, quota</code>
            </p>
          </div>
        </div>
        
        <FormSection title="Nhập liệu">
          <Textarea
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`groq-llama-70b-free, gsk_xxx, khóa-01, 1000000\nopenai-gpt4o-paid, sk_xxx, khóa-02, 0`}
            className="font-mono text-xs"
          />
        </FormSection>
        
        <FormSection title="Mã nhà cung cấp được hỗ trợ">
          <div className="flex flex-wrap gap-2">
            {providers.map(p => (
              <span key={p.slug} className="text-xs font-medium text-base-content/40 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                {p.slug}
              </span>
            ))}
          </div>
        </FormSection>

        {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
        {result && (
          <Alert tone={result.errors?.length ? "warning" : "success"}>
            Thành công: {result.added} khóa | Bỏ qua: {result.skipped}
          </Alert>
        )}

        <div className="flex items-center gap-3 pt-3 sticky bottom-0 bg-base-100 py-4 -mx-6 px-6 border-t border-white/5">
          <Button as={Link} to="/admin/keys" type="button" variant="ghost" className="flex-1">
            Đóng
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !text.trim()} className="flex-1">
            {saving ? "Đang xử lý..." : "Bắt đầu nhập dữ liệu"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default KeyBulkImportPage;




