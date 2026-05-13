import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api-client";
import { Alert, Badge, Button, Card, Input, Modal, Select, Table, Tabs, Textarea } from "@/components/ui";

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

function formatNum(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

export function LicenseDetailModal({
  license,
  packages = [],
  onClose,
  onChanged,
  onAdjustTokens,
  onAssignPackage,
}) {
  const [form, setForm] = useState({
    tier: license?.tier || "pro",
    status: license?.status || "active",
    max_sites: license?.max_sites || 1,
    expires_at: toDateInput(license?.expires_at),
    notes: "",
  });
  const [packageInfo, setPackageInfo] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!license) return;
    setForm({
      tier: license.tier || "pro",
      status: license.status || "active",
      max_sites: license.max_sites || 1,
      expires_at: toDateInput(license.expires_at),
      notes: "",
    });
    setLoading(true);
    setErr("");
    Promise.all([
      api.admin.getLicensePackage(license.id).catch(() => null),
      api.admin.keys({ license_id: license.id, limit: 50 }).catch(() => ({ items: [] })),
      api.admin.usage({ days: 30, plugin: license.plugin }).catch(() => null),
    ])
      .then(([pkg, keyRes, usageRes]) => {
        setPackageInfo(pkg);
        setKeys(keyRes.items || []);
        setUsage(usageRes);
      })
      .catch((error) => setErr(error.message))
      .finally(() => setLoading(false));
  }, [license]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.slug === (packageInfo?.package_slug || license?.package_slug)),
    [packages, packageInfo, license],
  );

  if (!license) return null;

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveGeneral = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await api.admin.updateLicense(license.id, {
        tier: form.tier,
        status: form.status,
        max_sites: Number(form.max_sites || 1),
        expires_at: toIsoDate(form.expires_at),
        notes: form.notes.trim() || undefined,
      });
      await onChanged?.();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  const generalTab = (
    <form onSubmit={saveGeneral} className="stack gap-5">
      <Card className="p-4 bg-base-200/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[10px] uppercase font-black tracking-widest opacity-40">Customer</div>
            <div className="mt-1 font-bold">{license.email}</div>
            {license.name && <div className="text-xs opacity-60">{license.name}</div>}
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-widest opacity-40">License key</div>
            <code className="mt-1 block text-xs break-all opacity-80">{license.key}</code>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tier"
          value={form.tier}
          onChange={(event) => setField("tier", event.target.value)}
          options={[
            { label: "free", value: "free" },
            { label: "pro", value: "pro" },
            { label: "max", value: "max" },
          ]}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => setField("status", event.target.value)}
          options={[
            { label: "active", value: "active" },
            { label: "revoked", value: "revoked" },
            { label: "expired", value: "expired" },
          ]}
        />
        <Input
          label="Max sites"
          type="number"
          min="1"
          value={form.max_sites}
          onChange={(event) => setField("max_sites", event.target.value)}
        />
        <Input
          label="Expires at"
          type="date"
          value={form.expires_at}
          onChange={(event) => setField("expires_at", event.target.value)}
        />
      </div>

      <Textarea
        label="Patch note"
        rows={3}
        value={form.notes}
        onChange={(event) => setField("notes", event.target.value)}
        placeholder="Optional internal note"
      />

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => onAdjustTokens?.(license)}>
          Adjust tokens
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving" : "Save license"}
        </Button>
      </div>
    </form>
  );

  const packageTab = (
    <div className="stack gap-4">
      {packageInfo || license.package_slug ? (
        <Card className="p-4 bg-base-200/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest opacity-40">Package</div>
              <div className="mt-1 text-lg font-black">{packageInfo?.package_name || license.package_name || license.package_slug}</div>
              <div className="text-xs opacity-60">{packageInfo?.package_slug || license.package_slug}</div>
            </div>
            <Badge tone={packageInfo?.status === "active" ? "success" : "neutral"}>
              {packageInfo?.status || "assigned"}
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="uppercase font-black tracking-widest opacity-40">Used</div>
              <div className="mt-1 font-mono">{formatNum(packageInfo?.current_period_tokens_used ?? license.quota_used)}</div>
            </div>
            <div>
              <div className="uppercase font-black tracking-widest opacity-40">Quota</div>
              <div className="mt-1 font-mono">{formatNum(packageInfo?.token_quota_monthly ?? license.quota_limit)}</div>
            </div>
            <div>
              <div className="uppercase font-black tracking-widest opacity-40">Keys</div>
              <div className="mt-1 font-mono">{packageInfo?.allocated_keys_count ?? license.allocated_keys_count ?? 0}</div>
            </div>
            <div>
              <div className="uppercase font-black tracking-widest opacity-40">Routing</div>
              <div className="mt-1 font-mono">{selectedPackage?.routing_mode || license.routing_mode || "shared"}</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-sm opacity-70">No package assigned.</Card>
      )}

      <div className="flex justify-end">
        <Button type="button" variant="primary" onClick={() => onAssignPackage?.(license)}>
          Change package
        </Button>
      </div>
    </div>
  );

  const keysTab = (
    <div className="stack gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-70">Allocated provider keys: {keys.length}</div>
        <a href={`/admin/keys?license_id=${license.id}`} className="text-primary text-xs font-black uppercase tracking-widest">
          Open key pool
        </a>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Key</th>
              <th>Status</th>
              <th>Quota</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id}>
                <td>{key.provider_slug}</td>
                <td><code>{key.key_masked}</code></td>
                <td><Badge tone={key.status === "allocated" ? "brand" : "neutral"}>{key.status}</Badge></td>
                <td>{formatNum(key.monthly_used_tokens)} / {formatNum(key.monthly_quota_tokens)}</td>
              </tr>
            ))}
            {keys.length === 0 && (
              <tr>
                <td colSpan="4" className="py-10 text-center opacity-50">No dedicated keys allocated.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );

  const usageTab = (
    <div className="stack gap-4">
      <Card className="p-4 bg-base-200/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="uppercase font-black tracking-widest opacity-40">Calls</div>
            <div className="mt-1 text-xl font-black">{formatNum(usage?.total_calls)}</div>
          </div>
          <div>
            <div className="uppercase font-black tracking-widest opacity-40">Tokens</div>
            <div className="mt-1 text-xl font-black">{formatNum(usage?.tokens_spent)}</div>
          </div>
          <div>
            <div className="uppercase font-black tracking-widest opacity-40">Latency</div>
            <div className="mt-1 text-xl font-black">{formatNum(usage?.avg_latency_ms)}ms</div>
          </div>
          <div>
            <div className="uppercase font-black tracking-widest opacity-40">Plugin</div>
            <div className="mt-1 text-xl font-black">{license.plugin}</div>
          </div>
        </div>
      </Card>
      <Alert tone="info">
        Usage endpoint is plugin-scoped today; this view filters by the license plugin and shows package/key data above for the selected license.
      </Alert>
    </div>
  );

  return (
    <Modal open={true} onClose={onClose} title={`License #${license.id}`} size="lg">
      <div className="stack gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={license.status === "active" ? "success" : license.status === "revoked" ? "danger" : "warning"}>
            {license.status}
          </Badge>
          <Badge tone="neutral">{license.plugin}</Badge>
          <Badge tone="brand">{license.tier}</Badge>
          {loading && <span className="text-xs opacity-50">Loading related data...</span>}
        </div>

        {err && <Alert tone="danger">{err}</Alert>}

        <Tabs
          items={[
            { id: "general", label: "General", content: generalTab },
            { id: "package", label: "Package", content: packageTab },
            { id: "keys", label: "Keys", content: keysTab },
            { id: "usage", label: "Usage", content: usageTab },
          ]}
        />
      </div>
    </Modal>
  );
}

