import React, { useState } from "react";
import { EyeOff, Eye, Check, Copy } from "lucide-react";
import { keysApi } from "../api";

/**
 * KeyCell: Hiển thị giá trị API Key với tính năng ẩn/hiện và sao chép.
 */
export function KeyCell({ k }) {
  const [fullKey, setFullKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  const toggle = async () => {
    setErr("");
    if (fullKey) {
      setFullKey(null);
      return;
    }
    setLoading(true);
    try {
      const res = await keysApi.reveal(k.id);
      setFullKey(res.key_value || "");
    } catch (e) {
      setErr(e.message || "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    const text = fullKey || k.key_masked || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[11px] font-bold text-base-content/80 group-hover:text-primary transition-colors truncate max-w-[150px]">
        {k.label || <span className="opacity-10 italic">CHƯA ĐẶT TÊN</span>}
      </div>
      <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 w-fit group/key">
        <code className={`text-[10px] font-mono font-bold transition-all ${fullKey ?"text-primary" : "text-base-content/40"}`}>
          {fullKey || k.key_masked}
        </code>
        <div className="flex items-center gap-1 opacity-0 group-hover/key:opacity-100 transition-opacity">
          <button type="button" onClick={toggle} disabled={loading} className="p-1 hover:text-primary transition-colors">
            {fullKey ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
          <button type="button" onClick={copy} className={`p-1 transition-colors ${copied ?"text-success" : "hover:text-primary"}`}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        </div>
      </div>
      {err && <div className="text-[9px] text-danger font-bold uppercase mt-1">{err}</div>}
    </div>
  );
}
