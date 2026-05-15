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
    <div className="flex flex-col gap-10 pb-20">
      <AdminPageHeader 
        title="Nhập khóa (Bulk Import)"
        tagline="Nhập danh sách khóa API số lượng lớn từ định dạng CSV"
        actions={
          <Button as={Link} to="/admin/keys" variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 font-semibold tracking-wider text-[11px]">
            <ArrowLeft size={14} className="mr-2" /> Quay lại danh sách
          </Button>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Khu vực nhập liệu */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormSection title="Dữ liệu CSV đầu vào">
            <Textarea
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`groq-llama-70b-free, gsk_xxx, khóa-01, 1000000\nopenai-gpt4o-paid, sk_xxx, khóa-02, 0`}
              className="font-mono text-sm bg-white/5 border-white/10 rounded-2xl p-6 focus:border-primary/50 transition-all resize-none w-full leading-relaxed"
            />
          </FormSection>
        </div>

        {/* Cột phụ: Hướng dẫn & Thông tin */}
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Info size={18} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold tracking-wider uppercase">Định dạng CSV chuẩn</span>
              <p className="text-[11px] font-medium leading-relaxed opacity-80 mt-1">
                Nhập từng dòng theo cấu trúc sau (phân tách bằng dấu phẩy):
              </p>
              <code className="text-[10px] bg-black/20 p-2 rounded-lg mt-1 font-mono">
                provider_slug, key_value, label, quota
              </code>
            </div>
          </div>
          
          <FormSection title="Mã Nhà Cung Cấp Hỗ Trợ" description="Sử dụng các ID này trong cột provider_slug">
            <div className="flex flex-wrap gap-2 mt-2">
              {providers.map(p => (
                <span key={p.slug} className="text-[10px] font-bold tracking-wider uppercase text-base-content/60 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  {p.slug}
                </span>
              ))}
              {providers.length === 0 && (
                <span className="text-xs text-base-content/40 italic">Chưa có nhà cung cấp nào</span>
              )}
            </div>
          </FormSection>

          <div className="flex flex-col gap-3">
             {err && <Alert tone="danger" onDismiss={() => setErr("")}>{err}</Alert>}
             {result && (
               <Alert tone={result.errors?.length ? "warning" : "success"} className="rounded-xl">
                 <div className="font-bold text-sm mb-1">Kết quả xử lý</div>
                 <div>Thành công: {result.added} khóa</div>
                 <div>Bỏ qua: {result.skipped} khóa</div>
               </Alert>
             )}
             
             <Button 
               type="submit" 
               variant="primary" 
               disabled={saving || !text.trim()} 
               className="h-14 w-full rounded-2xl font-bold tracking-wider text-xs shadow-xl shadow-primary/10 mt-4"
             >
               {saving ? "ĐANG XỬ LÝ DỮ LIỆU..." : "BẮT ĐẦU NHẬP DỮ LIỆU"}
             </Button>
             
             <Button as={Link} to="/admin/keys" variant="ghost" className="h-12 w-full rounded-xl border border-white/5 text-[11px] font-semibold text-base-content/40">
               Đóng
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default KeyBulkImportPage;




