import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, Trash2, X } from "lucide-react";

const ICON_BY_TONE = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const BTN_BY_TONE = {
  danger: "bg-error text-white",
  warning: "bg-warning text-black",
  info: "bg-primary text-primary-content",
  success: "bg-success text-black",
};

const BADGE_BY_TONE = {
  danger: "text-error border-error/40 bg-error/10",
  warning: "text-warning border-warning/40 bg-warning/10",
  info: "text-primary border-primary/40 bg-primary/10",
  success: "text-success border-success/40 bg-success/10",
};

export function AdminConfirmDialog({
  open = true,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  tone = "danger",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel?.();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel, loading]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setErrorText("");
    }
  }, [open]);

  const Icon = useMemo(() => ICON_BY_TONE[tone] || AlertTriangle, [tone]);
  if (!open) return null;

  const handleConfirm = async () => {
    if (loading || disabled) return;
    setLoading(true);
    setErrorText("");
    try {
      await Promise.resolve(onConfirm?.());
      onCancel?.();
    } catch (error) {
      setErrorText(error?.message || "Không thể hoàn tất thao tác.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onCancel?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-base-content/75 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="w-full max-w-md rounded-2xl border border-base-border bg-base-200 shadow-2xl overflow-hidden">
        <div className="h-14 px-5 border-b border-base-border flex items-center gap-3 bg-base-100/70">
          <span className={`w-8 h-8 rounded-lg border flex items-center justify-center ${BADGE_BY_TONE[tone] || BADGE_BY_TONE.danger}`}>
            <Icon size={16} />
          </span>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content">{title}</h2>
          <button type="button" onClick={handleClose} disabled={loading} className="ml-auto w-7 h-7 rounded-md border border-base-border bg-base-100/70 text-content-ghost hover:text-base-content flex items-center justify-center disabled:opacity-50">
            <X size={14} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm leading-relaxed text-content-dim">{message}</p>
          {errorText ? <p className="mt-3 text-xs font-bold text-error">{errorText}</p> : null}
        </div>

        <div className="h-14 px-5 border-t border-base-border bg-base-100/60 flex items-center gap-2">
          <button type="button" onClick={handleClose} disabled={loading} className="h-9 px-4 rounded-lg border border-base-border bg-base-100 text-xs font-semibold uppercase tracking-wider text-content-dim hover:text-base-content disabled:opacity-50">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || disabled}
            className={`ml-auto h-9 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-50 ${BTN_BY_TONE[tone] || BTN_BY_TONE.danger}`}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

