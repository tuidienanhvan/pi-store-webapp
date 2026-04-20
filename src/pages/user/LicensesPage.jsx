import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { Card, Alert, Badge, Button, Input, Icon } from "../../components/ui";

export function LicensesPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.license
      .stats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  const licenseKey = localStorage.getItem("pi_license_key") || "";

  const copyKey = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>License của tôi</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>License key gán vào plugin WordPress để kích hoạt Pro.</p>
      </header>

      {error && <Alert tone="danger">{error}</Alert>}

      {stats ? (
        <div className="stack" style={{ gap: "var(--s-8)" }}>
          <section className="stack" style={{ gap: "var(--s-4)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Thông tin license</h2>
            <Card className="stack" style={{ padding: 0, overflow: "hidden" }}>
              <div className="grid --cols-3" style={{ background: "var(--surface-2)", gap: "1px" }}>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Plan</div>
                  <div><Badge tone="brand">{stats.tier?.toUpperCase()}</Badge></div>
                </div>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Trạng thái</div>
                  <div><Badge tone={stats.status === "active" ? "success" : "warning"}>{stats.status}</Badge></div>
                </div>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Email</div>
                  <div style={{ fontWeight: "500", color: "var(--text-1)" }}>{stats.email}</div>
                </div>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Sites đã kích hoạt</div>
                  <div style={{ fontWeight: "500", color: "var(--text-1)", display: "flex", gap: "8px", alignItems: "center" }}>
                    <Icon name="monitor" size={16} style={{ color: "var(--text-3)" }} /> 
                    {stats.activated_sites} / {stats.max_sites}
                  </div>
                </div>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Hết hạn</div>
                  <div style={{ fontWeight: "500", color: "var(--text-1)", display: "flex", gap: "8px", alignItems: "center" }}>
                    <Icon name="file-text" size={16} style={{ color: "var(--text-3)" }} /> 
                    {stats.expires_at ? new Date(stats.expires_at).toLocaleDateString("vi-VN") : "Không hết hạn"}
                  </div>
                </div>
                <div style={{ background: "var(--surface)", padding: "var(--s-5)" }}>
                  <div style={{ color: "var(--text-2)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Usage tháng này</div>
                  <div style={{ fontWeight: "500", color: "var(--text-1)", display: "flex", gap: "8px", alignItems: "center" }}>
                    <Icon name="zap" size={16} style={{ color: "var(--text-3)" }} /> 
                    {stats.usage_this_month} / {stats.quota_this_month} requests
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section className="stack" style={{ gap: "var(--s-4)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>License Key</h2>
            
            {licenseKey ? (
              <Card className="row" style={{ alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", border: "1px dashed var(--border)" }}>
                <code style={{ fontSize: "var(--fs-18)", fontWeight: "600", color: "var(--brand)" }}>{licenseKey}</code>
                <Button variant="secondary" onClick={copyKey}>
                  <Icon name={copied ? "check" : "copy"} size={16} style={{ marginRight: "8px" }} />
                  {copied ? "Đã copy!" : "Copy"}
                </Button>
              </Card>
            ) : (
              <Alert tone="warning" title="Chưa có license key">
                License key chưa được lưu trong trình duyệt. Dán key vào settings bên dưới.
              </Alert>
            )}

            <Card className="stack" style={{ gap: "var(--s-4)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Cập nhật storage</h3>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
                Cập nhật license key để xem thông tin plan. Lưu ý: key này chỉ lưu trên trình duyệt (localStorage).
              </p>
              <LicenseKeyEditor />
            </Card>
          </section>
        </div>
      ) : (
        !error && <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải…</div>
      )}
    </div>
  );
}

function LicenseKeyEditor() {
  const [value, setValue] = useState(localStorage.getItem("pi_license_key") || "");

  const save = () => {
    if (value.trim()) {
      localStorage.setItem("pi_license_key", value.trim());
    } else {
      localStorage.removeItem("pi_license_key");
    }
    window.location.reload();
  };

  return (
    <div className="row" style={{ gap: "var(--s-3)" }}>
      <Input
        type="password"
        placeholder="pi_xxxxxxxxxxxxxxxx"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ flex: 1 }}
      />
      <Button variant="primary" onClick={save}>
        Lưu
      </Button>
    </div>
  );
}
