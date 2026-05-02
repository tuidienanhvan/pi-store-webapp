import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { Alert, Badge, Button, Card, Input, Icon } from "../../components/ui";

export function LicensesPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const licenseKey = localStorage.getItem("pi_license_key") || "";

  useEffect(() => {
    api.license.stats().then(setStats).catch((e) => setError(e.message));
  }, []);

  const copyKey = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className="stack gap-8">
      <header className="stack gap-2">
        <h1 className="m-0 text-32">My license</h1>
        <p className="m-0 text-18 muted">Manage your license key and activation stats.</p>
      </header>

      {error && <Alert tone="danger">{error}</Alert>}

      {stats ? (
        <>
          <Card className="p-0 overflow-hidden">
            <div className="grid --cols-3" style={{ background: "var(--surface-2)", gap: 1 }}>
              <Cell label="Plan"><Badge tone="brand">{String(stats.tier || "").toUpperCase()}</Badge></Cell>
              <Cell label="Status"><Badge tone={stats.status === "active" ? "success" : "warning"}>{stats.status}</Badge></Cell>
              <Cell label="Email"><strong>{stats.email}</strong></Cell>
              <Cell label="Activated sites"><span className="row gap-2"><Icon name="monitor" size={16} /> {stats.activated_sites} / {stats.max_sites}</span></Cell>
              <Cell label="Expires">{stats.expires_at ? new Date(stats.expires_at).toLocaleDateString() : "Never"}</Cell>
              <Cell label="Monthly usage">{stats.usage_this_month} / {stats.quota_this_month}</Cell>
            </div>
          </Card>

          <Card className="stack gap-4 p-5">
            <h2 className="m-0 text-24">License key</h2>
            {licenseKey ? (
              <div className="row justify-between items-center p-4 rounded-md border border-hairline bg-surface-2">
                <code className="text-18 font-semibold text-brand">{licenseKey}</code>
                <Button variant="ghost" onClick={copyKey}>{copied ? "Copied" : "Copy"}</Button>
              </div>
            ) : (
              <Alert tone="warning">No key found in browser storage.</Alert>
            )}
            <LicenseKeyEditor />
          </Card>
        </>
      ) : (
        !error && <div className="muted">Loading...</div>
      )}
    </div>
  );
}

function Cell({ label, children }) {
  return (
    <div className="p-5 bg-surface">
      <div className="text-14 muted mb-2">{label}</div>
      <div className="text-1">{children}</div>
    </div>
  );
}

function LicenseKeyEditor() {
  const [value, setValue] = useState(localStorage.getItem("pi_license_key") || "");
  const save = () => {
    const v = value.trim();
    if (v) localStorage.setItem("pi_license_key", v);
    else localStorage.removeItem("pi_license_key");
    window.location.reload();
  };
  return (
    <div className="row gap-3">
      <Input type="password" placeholder="pi_xxx" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1" />
      <Button onClick={save}>Save</Button>
    </div>
  );
}
