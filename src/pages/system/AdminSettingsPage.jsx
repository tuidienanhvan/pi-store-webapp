import { useCallback, useEffect, useState } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useAdminT } from "@/lib/translations";
import { Card, Table, Button, Input, Alert, Badge, IconButton, Checkbox } from "@/components/ui";
import { Trash2, Plus } from "lucide-react";
import { AdminSettingsSkeleton } from "@/components/skeletons/AdminSettingsSkeleton";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import "./AdminSettingsPage.css";

export function AdminSettingsPage() {
  const t = useAdminT();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    withDelay(api.admin.getSettings(), 1000)
      .then((res) => setSettings(res))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveBranding = async (branding) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ branding });
      setSettings(res);
      setOk(" lu branding.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const savePacks = async (packs) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ token_packs: packs });
      setSettings(res);
      setOk(" lu token packs.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const saveFlags = async (flags) => {
    setSaving(true); setErr(""); setOk("");
    try {
      const res = await api.admin.updateSettings({ feature_flags: flags });
      setSettings(res);
      setOk(" lu feature flags.");
      setTimeout(() => setOk(""), 2500);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminSettingsSkeleton />;
  if (!settings) return <div className="settings-page"><Alert tone="warning" className="mx-4 lg:mx-0">{err || "Khng load c settings"}</Alert></div>;

  return (
    <div className="settings-page fade-in">
      <header className="settings-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.settings_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">{t.settings_subtitle}</p>
        </div>
      </header>

      {err && <Alert tone="danger" className="mx-4 lg:mx-0 stagger-1">{err}</Alert>}
      {ok && <Alert tone="success" className="mx-4 lg:mx-0 stagger-1">{ok}</Alert>}

      <div className="flex flex-col gap-12">
        <BrandingCard branding={settings.branding} onSave={saveBranding} saving={saving} className="stagger-2" />
        <PacksCard packs={settings.token_packs} onSave={savePacks} saving={saving} className="stagger-3" />
        <FlagsCard flags={settings.feature_flags} onSave={saveFlags} saving={saving} className="stagger-4" />
        <CronCard className="stagger-5" />

        <section className="settings-section stagger-5">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="section-title">Security (env-only)</h2>
            <p className="text-xs text-base-content/60 opacity-60">Cc gi tr sau c t env vars, i qua Railway/Docker v khng lu DB.</p>
          </div>
          <Card className="settings-card p-8">
            <ul className="flex flex-col gap-4">
              <li className="flex items-center justify-between py-2 border-b border-base-border-subtle">
                <span className="text-[13px] font-bold text-base-content/80">JWT secret</span>
                <code className="text-xs font-black text-primary tracking-widest bg-primary/5 px-2 py-1 rounded">JWT_SECRET</code>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-base-border-subtle">
                <span className="text-[13px] font-bold text-base-content/80">JWT expire</span>
                <code className="text-xs font-black text-primary tracking-widest bg-primary/5 px-2 py-1 rounded">JWT_EXPIRE_MINUTES</code>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-base-border-subtle">
                <span className="text-[13px] font-bold text-base-content/80">Bcrypt rounds</span>
                <strong className="text-xs font-black text-base-content tracking-widest">12</strong>
              </li>
              <li className="flex items-center justify-between py-2">
                <span className="text-[13px] font-bold text-base-content/80">CORS origins</span>
                <code className="text-xs font-mono text-primary truncate max-w-[200px]">{import.meta.env.VITE_PI_API_URL || "http://localhost:8000"}</code>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}

function BrandingCard({ branding, onSave, saving, className }) {
  const [form, setForm] = useState(branding);
  useEffect(() => setForm(branding), [branding]);

  return (
    <section className={`settings-section ${className}`}>
      <h2 className="section-title">Branding</h2>
      <Card as="form" onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="settings-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">Primary color</label>
            <div className="flex gap-2">
              <input type="color" value={form.primary_color} 
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })} 
                className="h-12 w-16 p-1 bg-base-300 border border-base-border rounded-xl cursor-pointer" />
              <Input className="flex-1" value={form.primary_color} 
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })} 
                placeholder="var(--brand)" />
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
        <div className="flex justify-end mt-8 pt-6 border-t border-base-border-subtle">
          <Button type="submit" variant="primary" disabled={saving} className="h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-brand/20 shadow-lg">
            {saving ? "ang lu..." : "Lu branding"}
          </Button>
        </div>
      </Card>
    </section>
  );
}

function PacksCard({ packs, onSave, saving, className }) {
  const [rows, setRows] = useState(packs);
  useEffect(() => setRows(packs), [packs]);

  const update = (idx, key, value) => setRows(rows.map((r, i) => i === idx ? { ...r, [key]: value } : r));
  const remove = (idx) => setRows(rows.filter((_, i) => i !== idx));
  const add = () => setRows([...rows, { slug: "new-pack", tokens: 10000, price_cents: 100, discount_pct: 0, label: "Pack mi" }]);

  return (
    <section className={`settings-section ${className}`}>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="section-title">Token Packs</h2>
        <p className="text-xs text-base-content/60 opacity-60">Customer top-up pack s hin trn <code>/billing</code>.</p>
      </div>

      <Card className="settings-table-card mb-6">
        <Table className="settings-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Label</th>
              <th>Tokens</th>
              <th>Price (cents)</th>
              <th>Discount %</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-base-content/[0.01]">
                <td><input className="settings-inline-input font-mono lowercase" value={r.slug} onChange={(e) => update(i, "slug", e.target.value)} /></td>
                <td><input className="settings-inline-input" value={r.label} onChange={(e) => update(i, "label", e.target.value)} /></td>
                <td><input className="settings-inline-input font-mono" type="number" value={r.tokens} onChange={(e) => update(i, "tokens", Number(e.target.value))} /></td>
                <td><input className="settings-inline-input font-mono" type="number" value={r.price_cents} onChange={(e) => update(i, "price_cents", Number(e.target.value))} /></td>
                <td><input className="settings-inline-input font-mono" type="number" value={r.discount_pct} onChange={(e) => update(i, "discount_pct", Number(e.target.value))} /></td>
                <td className="text-right">
                  <IconButton icon={Trash2} label="Xa" onClick={() => remove(i)} className="hover:text-danger" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="flex items-center justify-between px-4 lg:px-0">
        <Button type="button" variant="ghost" onClick={add} className="h-10 px-6 rounded-xl border border-dashed border-base-border-subtle hover:border-primary-soft font-bold uppercase tracking-widest text-[10px]">
          <Plus size={14} className="mr-2" /> Thm pack
        </Button>
        <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(rows)} className="h-10 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-brand/20 shadow-lg">
          {saving ? "ang lu..." : "Lu packs"}
        </Button>
      </div>
    </section>
  );
}

function FlagsCard({ flags, onSave, saving, className }) {
  const [form, setForm] = useState(flags);
  useEffect(() => setForm(flags), [flags]);
  const toggle = (key) => setForm({ ...form, [key]: !form[key] });

  return (
    <section className={`settings-section ${className}`}>
      <h2 className="section-title">Feature flags</h2>
      <Card className="settings-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { key: "signup_enabled", label: "Cho php ng k account mi" },
            { key: "billing_enabled", label: "Bt top-up (Stripe checkout)" },
            { key: "marketplace_enabled", label: "Bt marketplace / catalog" },
            { key: "maintenance_mode", label: "Maintenance mode (block AI calls)", danger: true },
          ].map((f) => (
            <div key={f.key} onClick={() => toggle(f.key)} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${form[f.key] ? (f.danger ? "bg-danger/5 border-danger/20" : "bg-primary/5 border-primary/20") : "bg-base-content/[0.02] border-base-border"}`}>
              <div className="flex flex-col gap-1">
                <span className={`text-[13px] font-bold ${form[f.key] && f.danger ? "text-danger" : "text-base-content"}`}>{f.label}</span>
                <span className="text-[10px] font-mono opacity-40 lowercase tracking-wider">{f.key}</span>
              </div>
              <Checkbox checked={!!form[f.key]} onChange={() => {}} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8 pt-6 border-t border-base-border-subtle">
          <Button type="button" variant="primary" disabled={saving} onClick={() => onSave(form)} className="h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-brand/20 shadow-lg">
            {saving ? "ang lu..." : "Lu flags"}
          </Button>
        </div>
      </Card>
    </section>
  );
}

function CronCard({ className }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api.admin.cronStatus()
      .then((r) => setJobs(r.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (slug) => {
    if (!confirm(`Chy job "${slug}" ngay by gi?`)) return;
    setRunning(slug); setMsg("");
    try {
      const r = await api.admin.runCron(slug);
      setMsg(`${slug}: ${r.status} in ${r.duration_ms}ms`);
      load();
    } catch (e) { setMsg(`${slug}: ${e.message}`); }
    finally { setRunning(null); setTimeout(() => setMsg(""), 4000); }
  };

  const formatTime = (iso) => iso ? new Date(iso).toLocaleString("vi-VN") : "";

  return (
    <section className={`settings-section ${className}`}>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="section-title">Cron jobs</h2>
        <p className="text-xs text-base-content/60 opacity-60">Background tasks chy theo lch. C th trigger manual  test.</p>
      </div>
      {msg && <Alert tone="success" className="mb-6">{msg}</Alert>}
      <Card className="settings-table-card">
        <Table className="settings-table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Schedule</th>
              <th>Last run</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {!loading && jobs.map((j) => (
              <tr key={j.slug} className="group hover:bg-base-content/[0.01]">
                <td>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-base-content">{j.name}</span>
                    <span className="text-[11px] text-base-content/60 opacity-50">{j.description}</span>
                  </div>
                </td>
                <td><code className="text-[11px] bg-base-content/[0.05] px-2 py-1 rounded font-mono text-base-content/80">{j.schedule}</code></td>
                <td>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-base-content/80">{formatTime(j.last_run_at)}</span>
                    {j.last_duration_ms > 0 && (
                      <span className="text-[10px] text-base-content/60 opacity-40 font-mono">{j.last_duration_ms}ms</span>
                    )}
                  </div>
                </td>
                <td>
                  <Badge tone={j.last_status === "success" ? "success" : j.last_status === "failed" ? "danger" : "neutral"} className="uppercase text-[8px] font-black tracking-widest px-1.5 py-0.5">
                    {j.last_status || "idle"}
                  </Badge>
                </td>
                <td className="text-right">
                  <Button size="sm" variant="ghost" disabled={running === j.slug} onClick={() => run(j.slug)} className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest border border-base-border-subtle hover:bg-primary-soft">
                    {running === j.slug ? "Running..." : "Run now"}
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
export default AdminSettingsPage;
