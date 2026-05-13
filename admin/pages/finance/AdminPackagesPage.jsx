import { useCallback, useEffect, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useLocale } from "@/context/LocaleContext";
import { useAdminT, formatCurrency } from "@/lib/translations";
import { Alert, Badge, Button, Card, Checkbox, Input, Modal, Table, Textarea } from "@/components/ui";
import { Plus, X } from "lucide-react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import "./AdminPackagesPage.css";

const QUALITIES = ["fast", "balanced", "best"];

export function AdminPackagesPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(null); // pkg obj or "new"

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    withDelay(api.admin.packages(), 1000)
      .then((r) => setItems(r.items || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && items.length === 0) return <AdminTableSkeleton />;

  const handleDelete = async (p) => {
    if (!confirm(`Xo gi "${p.slug}"?`)) return;
    try { await api.admin.deletePackage(p.slug); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <div className="packages-page fade-in">
      <header className="packages-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.packages_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            {t.packages_subtitle}
          </p>
        </div>
        <Button variant="primary" onClick={() => setEditing("new")} className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
          <Plus size={18} className="mr-2" /> {t.add_package}
        </Button>
      </header>

      {err && <Alert tone="danger" className="stagger-1 mx-4 lg:mx-0">{err}</Alert>}

      <Card className="packages-table-card stagger-2">
        <Table className="packages-table">
          <thead>
            <tr>
              <th>Slug / {locale === "en" ? "Name" : "Tn"}</th>
              <th className="text-right">{t.price_monthly}</th>
              <th className="text-right">{t.price_yearly}</th>
              <th className="text-right">{t.token_quota}</th>
              <th>{t.qualities}</th>
              <th className="text-center">{t.subscribers}</th>
              <th className="text-center">{t.enabled}</th>
              <th className="text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {items.map((p) => (
              <tr key={p.slug} className="group hover:bg-base-content/[0.02]">
                <td>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-primary lowercase tracking-tight mb-0.5">{p.slug}</span>
                    <span className="text-sm font-bold text-base-content">{p.display_name}</span>
                  </div>
                </td>
                <td className="text-right font-mono text-xs font-bold text-base-content/80">{formatCurrency(p.price_cents_monthly, locale)}</td>
                <td className="text-right font-mono text-xs font-bold text-base-content/80">{formatCurrency(p.price_cents_yearly, locale)}</td>
                <td className="text-right font-mono text-xs font-bold text-base-content/60">{p.token_quota_monthly > 0 ? formatNum(p.token_quota_monthly) : "8"}</td>
                <td>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                      {p.allowed_qualities.map((q) => (
                        <Badge key={q} tone="neutral" className="uppercase text-[8px] font-black tracking-widest px-1.5 py-0.5">
                          {q}
                        </Badge>
                      ))}
                    </div>
                    {p.routing_mode && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <Badge tone={p.routing_mode === "dedicated" ? "primary" : p.routing_mode === "hybrid" ? "warning" : "neutral"}
                          className="uppercase text-[8px] font-black tracking-widest px-1.5 py-0.5">
                          {p.routing_mode}
                        </Badge>
                        {(p.allowed_tiers || []).map((t) => (
                          <span key={t} className="text-[9px] font-mono opacity-60">{t}</span>
                        ))}
                        {p.dedicated_key_count > 0 && (
                          <span className="text-[9px] font-mono opacity-60">·{p.dedicated_key_count}k</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-black text-base-content">{p.subscriber_count || 0}</span>
                    <a href={`/admin/licenses?package=${p.slug}`} className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity underline decoration-dotted">
                      View
                    </a>
                  </div>
                </td>
                <td className="text-center">
                  {p.is_active ? (
                    <div className="w-2 h-2 rounded-full bg-success mx-auto shadow-lg shadow-success/40" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-danger/20 mx-auto" />
                  )}
                </td>
                <td className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {t.edit}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p)} className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg hover:text-danger">
                      {t.delete}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="8" className="py-20 text-center opacity-30 uppercase font-black tracking-[0.2em] text-[10px]">Chua c gi.</td></tr>
            )}
          </tbody>
        </Table>
      </Card>

      {editing !== null && (
        <PackageModal pkg={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function PackageModal({ pkg, onClose, onSaved }) {
  const isNew = pkg === null;
  const [form, setForm] = useState(() => isNew ? {
    slug: "", display_name: "", description: "",
    price_cents_monthly: 0, price_cents_yearly: 0,
    token_quota_monthly: 0,
    allowed_qualities: ["fast"],
    // Routing policy (T-20260513-001)
    routing_mode: "shared",
    allowed_tiers: ["free"],
    priority_boost: 0,
    dedicated_key_count: 0,
    features: [], sort_order: 100, is_active: true,
  } : {
    ...pkg,
    routing_mode: pkg.routing_mode || "shared",
    allowed_tiers: [...(pkg.allowed_tiers || ["free"])],
    priority_boost: pkg.priority_boost || 0,
    dedicated_key_count: pkg.dedicated_key_count || 0,
    features: [...(pkg.features || [])],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

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
    e.preventDefault(); setSaving(true); setErr("");
    try {
      if (isNew) await api.admin.createPackage(form);
      else await api.admin.updatePackage(pkg.slug, form);
      onSaved();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={true} onClose={onClose} title={isNew ? "To gi mi" : `Sa gi ${pkg.slug}`} size="lg">
      <form onSubmit={submit} className="flex flex-col gap-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Slug" required disabled={!isNew} value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="pro" />
          <Input label="Display name" required value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Pro" />
        </div>
        <Textarea label="Description" rows={2} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div className="grid grid-cols-3" style={{ gap: "var(--s-3)" }}>
          <Input label="Price/mo (cents USD)" type="number" value={form.price_cents_monthly}
            onChange={(e) => setForm({ ...form, price_cents_monthly: Number(e.target.value) })} />
          <Input label="Price/yr (cents USD)" type="number" value={form.price_cents_yearly}
            onChange={(e) => setForm({ ...form, price_cents_yearly: Number(e.target.value) })} />
          <Input label="Token quota/mo (0 = 8)" type="number" value={form.token_quota_monthly}
            onChange={(e) => setForm({ ...form, token_quota_monthly: Number(e.target.value) })} />
        </div>

        <div>
          <div style={{ fontSize: "var(--fs-13)", color: "color-mix(in srgb, var(--base-content) 80%, transparent)", marginBottom: "var(--s-2)" }}>Allowed qualities</div>
          <div className="row" style={{ gap: "var(--s-4)" }}>
            {QUALITIES.map((q) => (
              <Checkbox key={q} label={q}
                checked={form.allowed_qualities.includes(q)}
                onChange={() => toggleQuality(q)} />
            ))}
          </div>
        </div>

        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <label className="form-label" style={{ margin: 0 }}>Features (M t?, c h? tr? Markdown)</label>
          <div className="stack" style={{ gap: "var(--s-2)" }}>
            {form.features.map((f, i) => (
              <div key={i} className="row" style={{ gap: "var(--s-2)" }}>
                <Input value={f} style={{ flex: 1 }} onChange={(e) => {
                  const nf = [...form.features]; nf[i] = e.target.value;
                  setForm({ ...form, features: nf });
                }} />
                <Button type="button" variant="ghost" onClick={() => {
                  const nf = [...form.features]; nf.splice(i, 1);
                  setForm({ ...form, features: nf });
                }}><X size={16}/></Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => {
              setForm({ ...form, features: [...form.features, ""] });
            }} style={{ alignSelf: "flex-start", marginTop: "var(--s-1)" }}>
              <Plus size={16}/> Thm feature
            </Button>
          </div>
        </div>

        {/* ── Routing Policy (T-20260513-001) ────────────────── */}
        <div className="stack" style={{ gap: "var(--s-3)", padding: "var(--s-3)", border: "1px solid var(--border-default)", borderRadius: "var(--radius)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--fs-14)" }}>🚦 Routing Policy</div>

          <div>
            <div style={{ fontSize: "var(--fs-13)", color: "color-mix(in srgb, var(--base-content) 80%, transparent)", marginBottom: "var(--s-2)" }}>
              Routing mode
            </div>
            <div className="row" style={{ gap: "var(--s-4)" }}>
              {["shared", "dedicated", "hybrid"].map((m) => (
                <label key={m} className="row" style={{ gap: "var(--s-1)", cursor: "pointer" }}>
                  <input type="radio" name="routing_mode" value={m}
                    checked={form.routing_mode === m}
                    onChange={() => setForm({ ...form, routing_mode: m })} />
                  <span style={{ fontSize: "var(--fs-13)" }}>{m}</span>
                </label>
              ))}
            </div>
            <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)", marginTop: "var(--s-1)" }}>
              shared = shared pool only · dedicated = allocated keys only · hybrid = dedicated then shared fallback
            </div>
          </div>

          <div>
            <div style={{ fontSize: "var(--fs-13)", color: "color-mix(in srgb, var(--base-content) 80%, transparent)", marginBottom: "var(--s-2)" }}>
              Allowed provider tiers
            </div>
            <div className="row" style={{ gap: "var(--s-4)" }}>
              {["free", "paid"].map((t) => (
                <Checkbox key={t} label={t}
                  checked={form.allowed_tiers.includes(t)}
                  onChange={() => toggleTier(t)} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: "var(--s-3)" }}>
            <Input label="Priority boost (0–100)" type="number" min={0} max={100} value={form.priority_boost}
              onChange={(e) => setForm({ ...form, priority_boost: Number(e.target.value) })} />
            <Input label="Dedicated key count (auto-allocate on assign)" type="number" min={0} value={form.dedicated_key_count}
              onChange={(e) => setForm({ ...form, dedicated_key_count: Number(e.target.value) })} />
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "var(--s-3)" }}>
          <Input label="Sort order" type="number" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <Checkbox label="Active" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        </div>

        {err && <Alert tone="danger">{err}</Alert>}
        <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Hu?</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "ang luu" : (isNew ? "To gi" : "Luu")}</Button>
        </div>
      </form>
    </Modal>
  );
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default AdminPackagesPage;
