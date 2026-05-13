import { useEffect, useState, useCallback } from "react";
import { api, withDelay } from "@/lib/api-client";
import { useAdminT } from "@/lib/translations";
import { Card, Table, Badge, Button, Input, Select, Textarea, Modal, Alert, IconButton } from "@/components/ui";
import { Plus, Grid, Bolt, X, Download, Edit2 } from "lucide-react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import "./AdminReleasesPage.css";

export function AdminReleasesPage() {
  const t = useAdminT();
  const [releases, setReleases] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    withDelay(api.admin.releases(), 1000)
      .then((res) => {
        setReleases(res?.items || []);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
     
    load();
  }, [load]);

  if (loading && releases.length === 0) return <AdminTableSkeleton />;

  return (
    <div className="releases-page fade-in">
      <header className="releases-header stagger-1">
        <div className="flex flex-col gap-3">
          <h1 className="premium-title">{t.releases_title}</h1>
          <p className="text-base-content/60 opacity-60 font-medium tracking-wide">
            {t.releases_subtitle}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowUpload(true)} className="h-[48px] px-8 rounded-2xl shadow-brand/20 shadow-lg font-black uppercase tracking-widest text-xs">
          <Plus size={18} className="mr-2" />
          {t.upload_release_btn}
        </Button>
      </header>

      <Card className="releases-table-card stagger-2">
        <Table className="releases-table">
          <thead>
            <tr>
              <th>{t.plugin}</th>
              <th>{t.version}</th>
              <th>{t.tier_required}</th>
              <th className="text-center">{t.stable}</th>
              <th className="text-center">{t.yanked}</th>
              <th className="text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border-subtle">
            {releases.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Grid size={48} className="text-base-content/60" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.no_releases}</p>
                  </div>
                </td>
              </tr>
            ) : (
              releases.map((r) => (
                <tr 
                  key={r.id} 
                  className={`group transition-all hover:bg-base-content/[0.02] ${r.is_yanked ? "opacity-40 grayscale" : ""}`}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <Bolt size={18} className="text-primary shadow-brand/20 shadow-lg" />
                      </div>
                      <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors lowercase font-mono tracking-tight">
                        {r.plugin_slug}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-black text-base-content font-mono">v{r.version}</span>
                  </td>
                  <td>
                    <Badge tone={r.tier_required === "pro" ? "brand" : "neutral"} className="uppercase text-[9px] font-black tracking-widest px-2.5 py-1">
                      {r.tier_required}
                    </Badge>
                  </td>
                  <td className="text-center">
                    {!r.is_yanked ? (
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-success uppercase tracking-[0.15em] bg-success/10 px-2.5 py-1 rounded-full">
                        <div className="w-1 h-1 bg-success rounded-full animate-pulse shadow-success/40 shadow-lg" />
                        STABLE
                      </div>
                    ) : (
                      <span className="opacity-20 text-[10px] font-black"></span>
                    )}
                  </td>
                  <td className="text-center">
                    {r.is_yanked ? (
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-danger uppercase tracking-[0.15em] bg-danger/10 px-2.5 py-1 rounded-full">
                        <X size={10} className="text-danger" />
                        YANKED
                      </div>
                    ) : (
                      <span className="opacity-20 text-[10px] font-black"></span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => window.open(`/v1/updates/download/${r.plugin_slug}/${r.version}`, "_blank")}
                        className="h-9 w-9 rounded-xl border border-base-border hover:text-primary"
                      >
                        <Download size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {}}
                        className="h-9 w-9 rounded-xl border border-base-border hover:text-base-content"
                      >
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <UploadReleaseModal open={showUpload} onClose={() => setShowUpload(false)} onUploaded={load} />
    </div>
  );
}

function UploadReleaseModal({ open, onClose, onUploaded }) {
  const [form, setForm] = useState({
    plugin_slug: "pi-api",
    version: "",
    tier_required: "free",
    changelog: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Ch?n file ZIP.");
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("plugin_slug", form.plugin_slug);
      fd.append("version", form.version);
      fd.append("tier_required", form.tier_required);
      fd.append("changelog", form.changelog);

      await api.admin.uploadRelease(fd);
      onUploaded();
      onClose();
    } catch (e) {
      alert("Li upload: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="T?i ln b?n pht hnh mi" size="lg">
      <form onSubmit={submit} className="flex flex-col gap-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">Plugin</label>
            <Select 
              value={form.plugin_slug} 
              onChange={(e) => setForm({ ...form, plugin_slug: e.target.value })}
              options={[
                { label: "Pi API", value: "pi-api" },
              ]}
              className="h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">Phin b?n</label>
            <Input 
              placeholder="e.g. 1.2.0" 
              value={form.version} 
              onChange={(e) => setForm({ ...form, version: e.target.value })} 
              className="h-12 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">Gi yu c?u</label>
          <Select 
            value={form.tier_required} 
            onChange={(e) => setForm({ ...form, tier_required: e.target.value })}
            options={[
              { label: "Free (Tt c)", value: "free" },
              { label: "Pro (Ch? Pro tr? ln)", value: "pro" },
              { label: "Max (Ch? Max tr? ln)", value: "max" },
            ]}
            className="h-12"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">Changelog</label>
          <Textarea 
            rows={4} 
            placeholder="M t? cc thay d?i..." 
            value={form.changelog} 
            onChange={(e) => setForm({ ...form, changelog: e.target.value })} 
            className="p-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content/60 opacity-60 ml-1">File ZIP (.zip)</label>
          <div className="relative group">
            <input 
              type="file" 
              accept=".zip" 
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center justify-center gap-4 h-32 rounded-2xl border border-dashed border-base-border bg-base-content/[0.02] group-hover:bg-base-content/[0.05] group-hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-base-400/50 flex items-center justify-center border border-base-border group-hover:text-primary transition-colors">
                <Download size={24} className="transform rotate-180" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-base-content/80 group-hover:text-base-content transition-colors">
                  {file ? file.name : "Ko th? ho?c click d? ch?n file"}
                </span>
                <span className="text-[10px] font-medium text-base-content/60 opacity-50 uppercase tracking-widest">Supports .zip files only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-base-border-subtle">
          <Button variant="ghost" onClick={onClose} type="button" className="h-11 px-6 font-bold uppercase tracking-widest text-[11px]">H?y</Button>
          <Button variant="primary" type="submit" isLoading={loading} className="h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-brand/20 shadow-lg">Xc nh?n T?i ln</Button>
        </div>
      </form>
    </Modal>
  );
}


export default AdminReleasesPage;
