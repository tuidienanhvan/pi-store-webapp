import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { Card, Button, Alert, Icon, Table, Badge } from "../../components/ui";

export function ApiKeysPage() {
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.license.stats().then(setStats).catch(() => {});
  }, []);

  const key = localStorage.getItem("pi_license_key") || "";
  const copyKey = () => {
    if (!key) return;
    navigator.clipboard.writeText(key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>API Keys</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>Developer access — gọi Pi Backend API trực tiếp ngoài plugin WP.</p>
      </header>

      <div className="stack" style={{ gap: "var(--s-8)" }}>
        <Card className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>License key = API key</h2>
          <p style={{ margin: 0, color: "var(--text-2)" }}>Cùng 1 key dùng cho plugin + API calls. Gửi kèm header:</p>
          
          <pre style={{ margin: 0, background: "var(--surface-3)", color: "var(--text-1)", padding: "var(--s-4)", borderRadius: "var(--r-2)", fontSize: "var(--fs-14)", overflowX: "auto", border: "1px solid var(--border)" }}>
{`Authorization: Bearer \${key || "pi_your_key_here"}
X-Pi-Site: yoursite.com
Content-Type: application/json`}
          </pre>

          {key ? (
            <div className="row" style={{ alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", border: "1px dashed var(--border)", padding: "var(--s-4)", borderRadius: "var(--r-2)" }}>
              <code style={{ fontSize: "var(--fs-18)", fontWeight: "600", color: "var(--brand)" }}>{key}</code>
              <Button variant="secondary" onClick={copyKey}>
                <Icon name={copied ? "check" : "copy"} size={16} style={{ marginRight: "8px" }} />
                {copied ? "Đã copy!" : "Copy"}
              </Button>
            </div>
          ) : (
            <Alert tone="warning">Chưa lưu license key trong trình duyệt.</Alert>
          )}
        </Card>

        <section className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Endpoints chính</h2>
          <div className="stack" style={{ gap: "var(--s-2)" }}>
            <Endpoint method="POST" path="/v1/ai/complete" desc="AI completion — tiêu tokens" />
            <Endpoint method="GET"  path="/v1/ai/wallet" desc="Wallet balance" />
            <Endpoint method="POST" path="/v1/seo/bot/generate" desc="Generate SEO title + description" />
            <Endpoint method="POST" path="/v1/seo/audit/run" desc="100-point SEO audit" />
            <Endpoint method="GET"  path="/v1/seo/schema/templates" desc="Curated schema templates" />
            <Endpoint method="POST" path="/v1/license/verify" desc="Verify license (plugin heartbeat)" />
          </div>
          <div>
            <Button as="a" href="https://api.piwebagency.com/docs" target="_blank" rel="noreferrer" variant="ghost">
              Full API docs (Swagger) <Icon name="external-link" size={16} style={{ marginLeft: "4px" }} />
            </Button>
          </div>
        </section>

        <section className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Rate limits</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead><tr><th>Tier</th><th>Burst</th><th>Monthly</th></tr></thead>
              <tbody>
                <tr><td>Free</td><td>10 req/min</td><td>20 requests</td></tr>
                <tr><td>Pro</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>10 req/min</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>500 requests</td></tr>
                <tr><td>Agency</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>30 req/min</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>5,000 requests</td></tr>
              </tbody>
            </Table>
          </Card>
          {stats && (
            <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
              Usage tháng này: <strong style={{ color: "var(--text-1)" }}>{stats.usage_this_month}</strong> / {stats.quota_this_month}
            </p>
          )}
        </section>

        <section className="stack" style={{ gap: "var(--s-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Example — curl</h2>
          <pre style={{ margin: 0, background: "#111", color: "#eee", padding: "var(--s-5)", borderRadius: "var(--r-3)", fontSize: "var(--fs-14)", overflowX: "auto" }}>
{`curl -X POST https://api.piwebagency.com/v1/ai/complete \\
  -H "Authorization: Bearer \${key || "pi_xxx..."}" \\
  -H "X-Pi-Site: yoursite.com" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Tóm tắt bài viết này trong 50 từ"}
    ],
    "max_tokens": 200,
    "quality": "fast"
  }'`}
          </pre>
        </section>
      </div>
    </div>
  );
}

function Endpoint({ method, path, desc }) {
  const tone = {
    GET: "info",
    POST: "success",
    PATCH: "warning",
    DELETE: "danger",
  }[method] || "neutral";
  
  return (
    <Card className="row" style={{ padding: "var(--s-3) var(--s-4)", alignItems: "center", gap: "var(--s-4)", background: "var(--surface-2)" }}>
      <Badge tone={tone} style={{ minWidth: "60px", justifyContent: "center" }}>{method}</Badge>
      <code style={{ fontSize: "var(--fs-14)", fontFamily: "monospace", color: "var(--text-1)", fontWeight: "500", letterSpacing: "0.5px" }}>{path}</code>
      <span style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", flex: 1, textAlign: "right" }}>{desc}</span>
    </Card>
  );
}
