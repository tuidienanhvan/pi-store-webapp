import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { useAdminT } from "../../lib/adminI18n";
import { Card, Table, Badge, Button, Input, Select, Textarea, Modal, Icon, Alert } from "../../components/ui";

export function AdminReleasesPage() {
  const t = useAdminT();
  const [releases, setReleases] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [err, setErr] = useState("");

  const load = () =>
    api.admin.releases().then((res) => setReleases(res?.items || [])).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  // Optimistic toggle — will swap with real PATCH endpoint when backend is ready
  const handleToggleStable = async (r) => {
    const newVal = !r.is_stable;
    setReleases((prev) => prev.map((x) => x.id === r.id ? { ...x, is_stable: newVal } : x));
    // await api.admin.updateRelease(r.id, { is_stable: newVal });
  };

  const handleToggleYank = async (r) => {
    if (r.is_yanked && !confirm("Restore release này cho người dùng tải lại?")) return;
    if (!r.is_yanked && !confirm(`Yank release ${r.version}? Plugin clients sẽ không được download bản này nữa.`)) return;
    const newVal = !r.is_yanked;
    setReleases((prev) => prev.map((x) => x.id === r.id ? { ...x, is_yanked: newVal } : x));
    // await api.admin.updateRelease(r.id, { is_yanked: newVal });
  };

  return (
    <div className="stack gap-8">
      <header className="row justify-between items-start">
        <div className="stack gap-2">
          <h1 className="text-36 m-0">{t.releases_title}</h1>
          <p className="text-18 muted m-0">{t.releases_subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => setShowUpload(true)}>
          <Icon name="plus" size={16} style={{ marginRight: "8px" }} />
          {t.upload_release_btn}
        </Button>
      </header>

      {err && <Alert tone="danger">{err}</Alert>}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table>
          <thead>
            <tr>
              <th>{t.plugin}</th>
              <th>{t.version}</th>
              <th>{t.tier_required}</th>
              <th>{t.size}</th>
              <th>{t.uploaded}</th>
              <th style={{ textAlign: "center" }}>{t.stable}</th>
              <th style={{ textAlign: "center" }}>{t.yanked}</th>
              <th style={{ textAlign: "right" }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {releases.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)" }}>
                  {t.no_releases}
                </td>
              </tr>
            )}
            {releases.map((r) => (
              <tr key={r.id} style={{ opacity: r.is_yanked ? 0.6 : 1 }}>
                <td style={{ fontFamily: "monospace", fontSize: "var(--fs-14)", fontWeight: "600", color: "var(--text-1)" }}>{r.plugin_slug}</td>
                <td style={{ fontWeight: "600" }}>
                  {r.version}
                  {r.is_yanked && <Badge tone="danger" style={{ marginLeft: "8px", fontSize: "var(--fs-11)" }}>YANKED</Badge>}
                </td>
                <td>
                  <Badge tone={r.tier_required === "pro" ? "brand" : "neutral"}>{r.tier_required}</Badge>
                </td>
                <td className="text-center">{r.is_yanked ? <Icon name="x" size={16} className="text-danger" /> : "—"}</td>
                <td className="text-right">
                  <Button as="a" variant="ghost" size="sm" href={`/v1/updates/download/${r.plugin_slug}/${r.version}`}>
                    <Icon name="download" size={14} className="mr-2" /> {t.download}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <UploadReleaseModal open={showUpload} onClose={() => setShowUpload(false)} onUploaded={load} />
    </div>
  );
}

function UploadReleaseModal({ open, onClose, onUploaded }) {
  const [form, setForm] = useState({
    plugin_slug: "pi-seo",
    version: "",
    tier_required: "free",
    changelog: "",
  });
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Chọn file ZIP.");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("zip", file);
    await api.admin.uploadRelease(fd);
    onUploaded();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload plugin release" size="md">
        <form onSubmit={submit} className="stack gap-4">
          <Select
            label="Plugin"
            value={form.plugin_slug}
            onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
            options={[
              { label: "pi-seo", value: "pi-seo" },
              { label: "pi-chatbot", value: "pi-chatbot" },
              { label: "pi-leads", value: "pi-leads" },
              { label: "pi-analytics", value: "pi-analytics" },
              { label: "pi-performance", value: "pi-performance" },
              { label: "pi-dashboard", value: "pi-dashboard" },
              { label: "pi-ai-provider", value: "pi-ai-provider" },
              { label: "pi-ai-cloud", value: "pi-ai-cloud" },
            ]}
          />
          <div className="grid --cols-2 gap-4">
            <Input
              label="Version"
              type="text"
              required
              placeholder="1.3.0"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
            />
            <Select
              label="Tier"
              value={form.tier_required}
              onChange={(e) => setForm({ ...form, tier_required: e.target.value })}
              options={[
                { label: "Free (ai cũng tải được)", value: "free" },
                { label: "Pro license required", value: "pro" },
              ]}
            />
          </div>
          <Textarea
            label="Changelog (markdown)"
            rows={5}
            value={form.changelog}
            onChange={(e) => setForm({ ...form, changelog: e.target.value })}
          />
        <div className="form-group">
          <label className="form-label">ZIP file</label>
          <div className="p-2 bg-surface-2 overflow-hidden" style={{ border: "1px dashed var(--hairline)", borderRadius: "var(--r-2)" }}>
            <input type="file" accept=".zip" required onChange={(e) => setFile(e.target.files[0])} className="w-full" />
          </div>
        </div>
        <div className="row gap-3 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
}
