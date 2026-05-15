import { useEffect, useState } from "react";

import { api } from "@/_shared/api/api-client";

import { Card, Button, Alert, Table, Badge } from "@/_shared/components/ui";
import { Check, Copy, ExternalLink } from "lucide-react";



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

        <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-18)" }}>Developer access  g?i Pi Backend API tr?c ti?p ngoi plugin WP.</p>

      </header>



      <div className="stack" style={{ gap: "var(--s-8)" }}>

        <Card className="stack" style={{ gap: "var(--s-4)" }}>

          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>License key = API key</h2>

          <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>Cng 1 key dng cho plugin + API calls. G?i km header:</p>

          

          <pre style={{ margin: 0, background: "var(--base-300)", color: "var(--base-content)", padding: "var(--s-4)", borderRadius: "var(--r-2)", fontSize: "var(--fs-14)", overflowX: "auto", border: "1px solid var(--base-border)" }}>

{`Authorization: Bearer \${key || "pi_your_key_here"}

X-Pi-Site: yoursite.com

Content-Type: application/json`}

          </pre>



          {key ? (

            <div className="row" style={{ alignItems: "center", justifyContent: "space-between", background: "var(--base-300)", border: "1px dashed var(--base-border)", padding: "var(--s-4)", borderRadius: "var(--r-2)" }}>

              <code style={{ fontSize: "var(--fs-18)", fontWeight: "600", color: "var(--primary)" }}>{key}</code>

              <Button variant="secondary" onClick={copyKey}>

                {copied ? <Check size={16} style={{ marginRight: "8px" }} /> : <Copy size={16} style={{ marginRight: "8px" }} />}
                {copied ? " copy!" : "Copy"}

              </Button>

            </div>

          ) : (

            <Alert tone="warning">Chua luu license key trong trnh duy?t.</Alert>

          )}

        </Card>



        <section className="stack" style={{ gap: "var(--s-4)" }}>

          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Endpoints chnh</h2>

          <div className="stack" style={{ gap: "var(--s-2)" }}>

            <Endpoint method="POST" path="/v1/ai/complete" desc="AI completion  tiu tokens" />

            <Endpoint method="GET"  path="/v1/ai/wallet" desc="Wallet balance" />

            <Endpoint method="POST" path="/v1/seo/bot/generate" desc="Generate SEO title + description" />

            <Endpoint method="POST" path="/v1/seo/audit/run" desc="100-point SEO audit" />

            <Endpoint method="GET"  path="/v1/seo/schema/templates" desc="Curated schema templates" />

            <Endpoint method="POST" path="/v1/license/verify" desc="Verify license (plugin heartbeat)" />

          </div>

          <div>

            <Button as="a" href="https://api.piwebagency.com/docs" target="_blank" rel="noreferrer" variant="ghost">

              Full API docs (Swagger) <ExternalLink size={16} style={{ marginLeft: "4px" }} />

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

                <tr><td>Pro</td><td style={{ fontWeight: "500", color: "var(--primary)" }}>10 req/min</td><td style={{ fontWeight: "500", color: "var(--primary)" }}>500 requests</td></tr>

          <tr><td>Max</td><td style={{ fontWeight: "500", color: "var(--primary)" }}>30 req/min</td><td style={{ fontWeight: "500", color: "var(--primary)" }}>500,000 requests</td></tr>

              </tbody>

            </Table>

          </Card>

          {stats && (

            <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)" }}>

              Usage thng ny: <strong style={{ color: "var(--base-content)" }}>{stats.usage_this_month}</strong> / {stats.quota_this_month}

            </p>

          )}

        </section>



        <section className="stack" style={{ gap: "var(--s-4)" }}>

          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Example  curl</h2>

          <pre style={{ margin: 0, background: "var(--base-300)", color: "var(--base-content)", padding: "var(--s-5)", borderRadius: "var(--r-3)", fontSize: "var(--fs-14)", overflowX: "auto", border: "1px solid var(--base-border)" }}>

{`curl -X POST https://api.piwebagency.com/v1/ai/complete \\

  -H "Authorization: Bearer \${key || "pi_xxx..."}" \\

  -H "X-Pi-Site: yoursite.com" \\

  -H "Content-Type: application/json" \\

  -d '{

    "messages": [

      {"role": "user", "content": "Tm t?t bi vi?t ny trong 50 t?"}

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

    <Card className="row" style={{ padding: "var(--s-3) var(--s-4)", alignItems: "center", gap: "var(--s-4)", background: "var(--base-300)" }}>

      <Badge tone={tone} style={{ minWidth: "60px", justifyContent: "center" }}>{method}</Badge>

      <code style={{ fontSize: "var(--fs-14)", fontFamily: "monospace", color: "var(--base-content)", fontWeight: "500", letterSpacing: "0.5px" }}>{path}</code>

      <span style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)", flex: 1, textAlign: "right" }}>{desc}</span>

    </Card>

  );

}

