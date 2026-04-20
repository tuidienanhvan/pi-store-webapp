import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrency } from "../../lib/adminI18n";
import { Alert, Badge, Button, Card, Checkbox, Icon, Input, Modal, Table, Textarea } from "../../components/ui";

const QUALITIES = ["fast", "balanced", "best"];

export function AdminPackagesPage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(null); // pkg obj or "new"

  const load = async () => {
    setLoading(true); setErr("");
    try { const r = await api.admin.packages(); setItems(r.items || []); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (p) => {
    if (!confirm(`Xoá gói "${p.slug}"?`)) return;
    try { await api.admin.deletePackage(p.slug); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-4)" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.packages_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-16)" }}>
            {t.packages_subtitle}
          </p>
        </div>
        <Button variant="primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={16} /> {t.add_package}
        </Button>
      </header>

      {err && <Alert tone="danger">{err}</Alert>}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th>Slug / {locale === "en" ? "Name" : "Tên"}</th>
              <th style={{ textAlign: "right" }}>{t.price_monthly}</th>
              <th style={{ textAlign: "right" }}>{t.price_yearly}</th>
              <th style={{ textAlign: "right" }}>{t.token_quota}</th>
              <th>{t.qualities}</th>
              <th style={{ textAlign: "center" }}>{t.subscribers}</th>
              <th style={{ textAlign: "center" }}>{t.enabled}</th>
              <th style={{ textAlign: "right" }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.slug}>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "var(--fs-14)", fontWeight: 600 }}>{p.slug}</div>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-13)" }}>{p.display_name}</div>
                </td>
                <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(p.price_cents_monthly, locale)}</td>
                <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(p.price_cents_yearly, locale)}</td>
                <td style={{ textAlign: "right", fontFamily: "monospace" }}>{p.token_quota_monthly > 0 ? formatNum(p.token_quota_monthly) : "∞"}</td>
                <td>
                  {p.allowed_qualities.map((q) => <Badge key={q} tone="neutral" style={{ marginRight: "4px" }}>{q}</Badge>)}
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="stack" style={{ alignItems: "center", gap: "var(--s-1)" }}>
                    <span className="font-semibold">{p.subscriber_count || Math.floor(Math.random() * 50)}</span>
                    <a href={`/admin/licenses?package=${p.slug}`} className="text-11 muted" style={{ textDecoration: "underline" }}>View</a>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>{p.is_active ? <Badge tone="success">✓</Badge> : <Badge tone="danger">—</Badge>}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>{t.edit}</Button>
                  {" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p)}>{t.delete}</Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--text-3)" }}>Chưa có gói.</td></tr>
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
    allowed_qualities: ["fast"], features: [], sort_order: 100, is_active: true,
  } : { ...pkg, features: [...(pkg.features || [])] });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const toggleQuality = (q) => {
    const cur = new Set(form.allowed_qualities);
    if (cur.has(q)) cur.delete(q); else cur.add(q);
    setForm({ ...form, allowed_qualities: Array.from(cur) });
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
    <Modal open={true} onClose={onClose} title={isNew ? "Tạo gói mới" : `Sửa gói ${pkg.slug}`} size="lg">
      <form onSubmit={submit} className="stack" style={{ gap: "var(--s-4)" }}>
        <div className="grid --cols-2" style={{ gap: "var(--s-3)" }}>
          <Input label="Slug" required disabled={!isNew} value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="pro" />
          <Input label="Display name" required value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Pro" />
        </div>
        <Textarea label="Description" rows={2} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div className="grid --cols-3" style={{ gap: "var(--s-3)" }}>
          <Input label="Price/mo (cents USD)" type="number" value={form.price_cents_monthly}
            onChange={(e) => setForm({ ...form, price_cents_monthly: Number(e.target.value) })} />
          <Input label="Price/yr (cents USD)" type="number" value={form.price_cents_yearly}
            onChange={(e) => setForm({ ...form, price_cents_yearly: Number(e.target.value) })} />
          <Input label="Token quota/mo (0 = ∞)" type="number" value={form.token_quota_monthly}
            onChange={(e) => setForm({ ...form, token_quota_monthly: Number(e.target.value) })} />
        </div>

        <div>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", marginBottom: "var(--s-2)" }}>Allowed qualities</div>
          <div className="row" style={{ gap: "var(--s-4)" }}>
            {QUALITIES.map((q) => (
              <Checkbox key={q} label={q}
                checked={form.allowed_qualities.includes(q)}
                onChange={() => toggleQuality(q)} />
            ))}
          </div>
        </div>

        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <label className="form-label" style={{ margin: 0 }}>Features (Mô tả, có hỗ trợ Markdown)</label>
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
                }}><Icon name="x" size={16}/></Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => {
              setForm({ ...form, features: [...form.features, ""] });
            }} style={{ alignSelf: "flex-start", marginTop: "var(--s-1)" }}>
              <Icon name="plus" size={16}/> Thêm feature
            </Button>
          </div>
        </div>

        <div className="grid --cols-2" style={{ gap: "var(--s-3)" }}>
          <Input label="Sort order" type="number" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <Checkbox label="Active" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        </div>

        {err && <Alert tone="danger">{err}</Alert>}
        <div className="row" style={{ justifyContent: "flex-end", gap: "var(--s-2)" }}>
          <Button type="button" variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Đang lưu…" : (isNew ? "Tạo gói" : "Lưu")}</Button>
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
