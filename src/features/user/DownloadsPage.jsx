import { useEffect, useState } from "react";
import { api } from "@/_shared/api/api-client";
import { Table, Badge, Button, Card } from "@/_shared/components/ui";
import { Zap, MessageCircle, FileText, BarChart3, Activity, Home, Cloud, Download, Box, Info } from "lucide-react";
import { DownloadsSkeleton } from "./skeleton";
import './DownloadsPage.css';

const CATALOG = [
  { slug: "pi-seo-v2",        label: "Pi SEO v2",        tier: "pro",    icon: Zap },
  { slug: "pi-chatbot-v2",    label: "Pi Chatbot v2",    tier: "pro",    icon: MessageCircle },
  { slug: "pi-leads-v2",      label: "Pi Leads v2",      tier: "pro",    icon: FileText },
  { slug: "pi-analytics-v2",  label: "Pi Analytics v2",  tier: "pro",    icon: BarChart3 },
  { slug: "pi-performance-v2",label: "Pi Performance v2",tier: "pro",    icon: Activity },
  { slug: "pi-dashboard-v2",  label: "Pi Dashboard v2",  tier: "free",   icon: Home },
  { slug: "pi-ai-cloud-v2",   label: "Pi AI Cloud v2",   tier: "free",   icon: Cloud },
];

export function DownloadsPage() {
  const [versions, setVersions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      CATALOG.map((p) =>
        api.updates
          .check(p.slug, "0.0.0")
          .then((res) => [p.slug, res])
          .catch(() => [p.slug, null])
      )
    ).then((results) => {
      const map = {};
      for (const [slug, res] of results) map[slug] = res;
      setVersions(map);
      setLoading(false);
    });
  }, []);

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>T?i plugin</h1>
        <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-18)" }}>Download ZIP cc plugin Pi v2 cho license c?a b?n.</p>
      </header>

      {loading ? (
        <DownloadsSkeleton />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Table>
            <thead>
              <tr>
                <th style={{ width: "2.5rem" }}></th>
                <th>Plugin</th>
                <th>Tier</th>
                <th>Version mi nh?t</th>
                <th>Requirement</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.map((p) => {
                const v = versions[p.slug];
                return (
                  <tr key={p.slug}>
                    <td><p.icon size={20} style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }} /></td>
                    <td>
                      <div style={{ fontWeight: "500", color: "var(--base-content)" }}>{p.label}</div>
                      <div style={{ fontSize: "var(--fs-12)", color: "color-mix(in srgb, var(--base-content) 60%, transparent)", fontFamily: "monospace" }}>{p.slug}</div>
                    </td>
                    <td><Badge tone={p.tier === "pro" ? "brand" : "neutral"}>{p.tier}</Badge></td>
                    <td style={{ fontWeight: "500" }}>{v?.latest_version || ""}</td>
                    <td style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-12)" }}>PHP {v?.min_php || "8.3"}+, WP {v?.min_wp || "6.0"}+</td>
                    <td style={{ textAlign: "right" }}>
                      {v?.download_url ? (
                        <Button as="a" href={v.download_url} target="_blank" rel="noreferrer" variant="primary" size="sm">
                          <Download size={14} style={{ marginRight: "4px" }} /> Download
                        </Button>
                      ) : (
                        <span style={{ color: "color-mix(in srgb, var(--base-content) 60%, transparent)", fontSize: "var(--fs-12)" }}>C?n Pro license</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      <Card className="stack" style={{ gap: "var(--s-4)", marginTop: "var(--s-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Box size={24} style={{ color: "var(--primary)" }} /> Hu?ng d?n ci
        </h2>
        <ol className="stack" style={{ gap: "var(--s-2)", margin: 0, paddingLeft: "var(--s-5)", color: "var(--base-content)" }}>
          <li>Download ZIP plugin c?n dng.</li>
          <li>Vo <code style={{ color: "var(--primary)", background: "var(--brand-soft)", padding: "2px 6px", borderRadius: "4px" }}>wp-admin ? Plugins ? Add New ? Upload Plugin</code>.</li>
          <li>Upload ZIP ? Activate.</li>
          <li>Vo <code style={{ color: "var(--primary)", background: "var(--brand-soft)", padding: "2px 6px", borderRadius: "4px" }}>Settings ? [Plugin Name] v2</code> ? paste license key c?a b?n.</li>
          <li>Refresh ? Pro features kch ho?t.</li>
        </ol>
        <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={16} /> C?n <code style={{ color: "var(--base-content)", background: "var(--base-300)", padding: "2px 6px", borderRadius: "4px" }}>plugins-v2/_shared/</code> cng thu m?c. N?u chua c, ZIP s? t? include.
        </p>
      </Card>
    </div>
  );
}
