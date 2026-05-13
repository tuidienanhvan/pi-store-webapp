import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Alert, Badge, Button, Card, Modal, Select, Input } from "@/components/ui";

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toIsoDate(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

export function AssignPackageModal({ license, packages: initialPackages = [], onClose, onChanged }) {
  const [packages, setPackages] = useState(initialPackages);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packageSlug, setPackageSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!license) return;
    setLoading(true);
    setErr("");
    Promise.all([
      initialPackages.length ? Promise.resolve({ items: initialPackages }) : api.admin.packages(),
      api.admin.getLicensePackage(license.id).catch(() => null),
    ])
      .then(([packageRes, current]) => {
        const items = packageRes.items || [];
        setPackages(items);
        setCurrentPackage(current);
        setPackageSlug(current?.package_slug || license.package_slug || items[0]?.slug || "");
        setExpiresAt(toDateInput(current?.expires_at || license.expires_at));
      })
      .catch((error) => setErr(error.message))
      .finally(() => setLoading(false));
  }, [license, initialPackages]);

  if (!license) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!packageSlug) return;
    setSaving(true);
    setErr("");
    try {
      await api.admin.assignPackage(license.id, {
        package_slug: packageSlug,
        expires_at: toIsoDate(expiresAt),
      });
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetPeriod = async () => {
    if (!confirm(`Reset current package period for license #${license.id}?`)) return;
    setSaving(true);
    setErr("");
    try {
      await api.admin.resetLicensePeriod(license.id);
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedPackage = packages.find((item) => item.slug === packageSlug);

  return (
    <Modal open={true} onClose={onClose} title="Assign package" size="lg">
      <form onSubmit={submit} className="stack gap-5">
        <Card className="p-4 bg-base-200/40">
          <div className="text-[11px] uppercase font-black tracking-widest opacity-50">License</div>
          <div className="mt-1 font-mono text-sm">#{license.id} - {license.email}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="neutral">{license.plugin}</Badge>
            <Badge tone={license.status === "active" ? "success" : "warning"}>{license.status}</Badge>
          </div>
        </Card>

        {loading ? (
          <div className="py-6 text-sm opacity-60">Loading package data...</div>
        ) : (
          <>
            <Select
              label="Package"
              value={packageSlug}
              onChange={(event) => setPackageSlug(event.target.value)}
              options={[
                { label: "Select package", value: "" },
                ...packages.map((item) => ({
                  value: item.slug,
                  label: `${item.display_name} (${item.slug})`,
                })),
              ]}
            />
            <Input
              label="Package expires at"
              type="date"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              hint="Leave blank for no explicit package expiry."
            />

            {selectedPackage && (
              <Card className="p-4 bg-base-200/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="uppercase font-black tracking-widest opacity-40">Quota</div>
                    <div className="mt-1 font-mono">{Number(selectedPackage.token_quota_monthly || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="uppercase font-black tracking-widest opacity-40">Routing</div>
                    <div className="mt-1 font-mono">{selectedPackage.routing_mode || "shared"}</div>
                  </div>
                  <div>
                    <div className="uppercase font-black tracking-widest opacity-40">Key target</div>
                    <div className="mt-1 font-mono">{selectedPackage.dedicated_key_count || 0}</div>
                  </div>
                  <div>
                    <div className="uppercase font-black tracking-widest opacity-40">Qualities</div>
                    <div className="mt-1 font-mono">{(selectedPackage.allowed_qualities || []).join(", ") || "-"}</div>
                  </div>
                </div>
              </Card>
            )}

            {currentPackage && (
              <Card className="p-4 bg-base-200/30">
                <div className="text-[11px] uppercase font-black tracking-widest opacity-50">Current period</div>
                <div className="mt-2 text-sm">
                  {Number(currentPackage.current_period_tokens_used || 0).toLocaleString()} /{" "}
                  {Number(currentPackage.token_quota_monthly || 0).toLocaleString()} tokens used
                </div>
                <div className="mt-1 text-xs opacity-60">
                  Allocated keys: {currentPackage.allocated_keys_count || 0}
                </div>
              </Card>
            )}
          </>
        )}

        {err && <Alert tone="danger">{err}</Alert>}

        <div className="modal-footer">
          {currentPackage && (
            <Button type="button" variant="ghost" onClick={resetPeriod} disabled={saving}>
              Reset period
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || loading || !packageSlug}>
            {saving ? "Saving" : "Assign package"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

