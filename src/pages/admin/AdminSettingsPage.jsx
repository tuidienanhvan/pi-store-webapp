import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useAdminT } from "../../lib/adminI18n";
import { Card, Table, Button, Input, Alert } from "../../components/ui";

export function AdminSettingsPage() {
  const t = useAdminT();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = () => {
    setLoading(true);
    api.admin
      .getSettings()
      .then((res) => setSettings(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const saveBranding = async (branding) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ branding });
      setSettings(res);
      setOk("Đã lưu branding.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const savePacks = async (packs) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ token_packs: packs });
      setSettings(res);
      setOk("Đã lưu token packs.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const saveFlags = async (flags) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ feature_flags: flags });
      setSettings(res);
      setOk("Đã lưu feature flags.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải settings…</div>;
  if (!settings) return <div className="stack" style={{ gap: "var(--s-8)" }}><Alert tone="warning">{err || "Không load được settings"}</Alert></div>;

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.settings_title}</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>{t.settings_subtitle}</p>
      </header>

      {err && <Alert tone="danger">{err}</Alert>}
      {ok && <Alert tone="success">{ok}</Alert>}

      <BrandingCard branding={settings.branding} onSave={saveBranding} saving={saving} />
      <PacksCard packs={settings.token_packs} onSave={savePacks} saving={saving} />
      <FlagsCard flags={settings.feature_flags} onSave={saveFlags} saving={saving} />
      <CronCard />

      <section className="stack" style={{ gap: "var(--s-4)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Security (env-only)</h2>
          <p style={{ margin: "var(--s-2) 0 0", color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Các giá trị sau đọc từ env vars, đổi qua Railway/Docker — không lưu DB.</p>
        </div>
        <Card style={{ padding: "var(--s-5)" }}>
          <ul className="stack" style={{ gap: "var(--s-3)", margin: 0, paddingLeft: "1.5rem" }}>
            <li>JWT secret: <code style={{ color: "var(--text-1)" }}>JWT_SECRET</code></li>
            <li>JWT expire: <code style={{ color: "var(--text-1)" }}>JWT_EXPIRE_MINUTES</code></li>
            <li>Bcrypt rounds: <strong style={{ color: "var(--text-1)" }}>12</strong> (hardcoded)</li>
            <li>CORS origins: <code style={{ color: "var(--text-1)" }}>{import.meta.env.VITE_PI_API_URL || "http://localhost:8000"}</code></li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

function BrandingCard({ branding, onSave, saving }) {
  const [form, setForm] = useState(branding);
  useEffect(() => setForm(branding), [branding]);

  return (
    <section className="stack" style={{ gap: "var(--s-4)" }}>
      <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Branding</h2>
      <Card as="form" onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ padding: "var(--s-6)" }} className="stack">
        <div className="grid --cols-2" style={{ gap: "var(--s-4)" }}>
          <Input 
            label="Site name"
            required 
            value={form.site_name} 
            onChange={(e) => setForm({ ...form, site_name: e.target.value })} 
          />
          <Input 
            label="Logo URL"
            value={form.logo_url} 
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })} 
            placeholder="/logo.svg" 
          />
          <div className="form-group">
            <label className="form-label">Primary color</label>
            <div className="row" style={{ alignItems: "stretch", gap: "var(--s-2)" }}>
              <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} style={{ height: "40px", width: "60px", padding: "2px", border: "1px solid var(--border)", borderRadius: "var(--r-2)" }} />
              <Input style={{ flex: 1 }} value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} placeholder="#007d3d" />
            </div>
          </div>
          <Input 
            label="Support email"
            type="email" 
            value={form.support_email} 
            onChange={(e) => setForm({ ...form, support_email: e.target.value })} 
            placeholder="support@piwebagency.com" 
          />
        </div>
        <div style={{ textAlign: "right", marginTop: "var(--s-4)" }}>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu branding"}
          </Button>
        </div>
      </Card>
    </section>
  );
}

function PacksCard({ packs, onSave, saving }) {
  const [rows, setRows] = useState(packs);
  useEffect(() => setRows(packs), [packs]);

  const update = (idx, key, value) => setRows(rows.map((r, i) => i === idx ? { ...r, [key]: value } : r));
  const remove = (idx) => setRows(rows.filter((_, i) => i !== idx));
  const add = () => setRows([...rows, { slug: "new-pack", tokens: 10000, price_cents: 100, discount_pct: 0, label: "Pack mới" }]);

  return (
    <section className="stack" style={{ gap: "var(--s-4)" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Token Packs</h2>
        <p style={{ margin: "var(--s-2) 0 0", color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Customer top-up pack — hiện trên <code style={{ color: "var(--text-1)" }}>/billing</code>.</p>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Label</th>
              <th>Tokens</th>
              <th>Price (cents USD)</th>
              <th>Discount %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><input className="input" style={{ width: "120px", fontFamily: "monospace", fontSize: "var(--fs-14)" }} value={r.slug} onChange={(e) => update(i, "slug", e.target.value)} /></td>
                <td><input className="input" style={{ minWidth: "150px" }} value={r.label} onChange={(e) => update(i, "label", e.target.value)} /></td>
                <td><input className="input" type="number" style={{ width: "100px" }} value={r.tokens} onChange={(e) => update(i, "tokens", Number(e.target.value))} /></td>
                <td><input className="input" type="number" style={{ width: "100px" }} value={r.price_cents} onChange={(e) => update(i, "price_cents", Number(e.target.value))} /></td>
                <td><input className="input" type="number" style={{ width: "80px" }} value={r.discount_pct} onChange={(e) => update(i, "discount_pct", Number(e.target.value))} /></td>
                <td style={{ textAlign: "right" }}><Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} style={{ color: "var(--danger)" }}>Xoá</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div style={{ display: "flex", gap: "var(--s-2)", justifyContent: "space-between" }}>
        <Button type="button" variant="ghost" onClick={add}>+ Thêm pack</Button>
        <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(rows)}>
          {saving ? "Đang lưu…" : "Lưu packs"}
        </Button>
      </div>
    </section>
  );
}

function FlagsCard({ flags, onSave, saving }) {
  const [form, setForm] = useState(flags);
  useEffect(() => setForm(flags), [flags]);

  const toggle = (key) => setForm({ ...form, [key]: !form[key] });

  return (
    <section className="stack" style={{ gap: "var(--s-4)" }}>
      <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Feature flags</h2>
      <Card style={{ padding: "var(--s-6)" }} className="stack">
        <div className="grid --cols-2" style={{ gap: "var(--s-4)" }}>
          {[
            { key: "signup_enabled", label: "Cho phép đăng ký account mới" },
            { key: "billing_enabled", label: "Bật top-up (Stripe checkout)" },
            { key: "marketplace_enabled", label: "Bật marketplace /catalog" },
            { key: "maintenance_mode", label: "Maintenance mode (block /v1/ai/complete)", danger: true },
          ].map((f) => (
            <label key={f.key} style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", cursor: "pointer", color: f.danger && form[f.key] ? "var(--danger)" : "var(--text-1)" }}>
              <input type="checkbox" checked={!!form[f.key]} onChange={() => toggle(f.key)} style={{ width: "16px", height: "16px", accentColor: f.danger ? "var(--danger)" : "var(--brand)" }} />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: "var(--s-4)" }}>
          <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(form)}>
            {saving ? "Đang lưu…" : "Lưu flags"}
          </Button>
        </div>
      </Card>
    </section>
  );
}

function CronCard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    api.admin.cronStatus()
      .then((r) => setJobs(r.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const run = async (slug) => {
    if (!confirm(`Chạy job "${slug}" ngay bây giờ?`)) return;
    setRunning(slug); setMsg("");
    try {
      const r = await api.admin.runCron(slug);
      setMsg(`${slug}: ${r.status} in ${r.duration_ms}ms`);
      load();
    } catch (e) { setMsg(`${slug}: ${e.message}`); }
    finally { setRunning(null); setTimeout(() => setMsg(""), 4000); }
  };

  const formatTime = (iso) => iso ? new Date(iso).toLocaleString("vi-VN") : "—";

  return (
    <section className="stack" style={{ gap: "var(--s-4)" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Cron jobs</h2>
        <p style={{ margin: "var(--s-2) 0 0", color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
          Background tasks chạy theo lịch. Có thể trigger manual để test.
        </p>
      </div>
      {msg && <Alert tone="success">{msg}</Alert>}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Schedule</th>
              <th>Last run</th>
              <th>Status</th>
              <th>Next run</th>
              <th style={{ textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "var(--s-5)", color: "var(--text-3)" }}>Đang tải…</td></tr>
            )}
            {!loading && jobs.map((j) => (
              <tr key={j.slug}>
                <td>
                  <div style={{ fontWeight: 600 }}>{j.name}</div>
                  <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>{j.description}</div>
                </td>
                <td><code style={{ fontSize: "var(--fs-12)" }}>{j.schedule}</code></td>
                <td style={{ fontSize: "var(--fs-13)" }}>
                  {formatTime(j.last_run_at)}
                  {j.last_duration_ms > 0 && (
                    <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>{j.last_duration_ms}ms</div>
                  )}
                </td>
                <td>
                  {j.last_status === "success"
                    ? <span style={{ color: "var(--success)", fontSize: "var(--fs-13)" }}>success</span>
                    : j.last_status === "failed"
                      ? <span style={{ color: "var(--danger)", fontSize: "var(--fs-13)" }} title={j.last_error}>failed</span>
                      : <span style={{ color: "var(--text-3)", fontSize: "var(--fs-13)" }}>chưa chạy</span>}
                </td>
                <td style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{formatTime(j.next_run_estimated_at)}</td>
                <td style={{ textAlign: "right" }}>
                  <Button size="sm" variant="ghost" disabled={running === j.slug} onClick={() => run(j.slug)}>
                    {running === j.slug ? "Đang chạy…" : "Run now"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </section>
  );
}
