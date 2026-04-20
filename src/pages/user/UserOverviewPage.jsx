import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api-client";
import { useAuth } from "../../context/AuthContext";
import { Alert, Badge, Button, Card, EmptyState, Icon, Skeleton } from "../../components/ui";

export function UserOverviewPage() {
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [usage, setUsage] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, u, s] = await Promise.all([
          api.cloud.myPackage().catch(() => null),
          api.cloud.myUsage(30).catch(() => null),
          api.license.stats().catch(() => null),
        ]);
        if (!mounted) return;
        setPkg(p); setUsage(u); setStats(s);
      } catch (e) {
        if (mounted) setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Chào {user?.name || user?.email}</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>
          Tổng quan Pi AI Cloud — tháng này bạn đã dùng bao nhiêu.
        </p>
      </header>

      {err && <Alert tone="danger">{err}</Alert>}

      {loading ? <SkeletonDashboard /> : !pkg ? <NoPackageState /> : (
        <>
          <QuotaCard pkg={pkg} />
          <div className="grid --cols-3" style={{ gap: "var(--s-4)" }}>
            <MiniStat label="Calls tháng này" value={pkg.current_period_requests} icon="bolt" />
            <MiniStat label="Lifetime tokens" value={formatNum(pkg.lifetime_tokens_used)} icon="zap" />
            <MiniStat label="License sites" value={`${stats?.activated_sites || 0} / ${stats?.max_sites || "—"}`} icon="layers" />
          </div>
          <UsageChart usage={usage} />
          <PluginBreakdown usage={usage} />
        </>
      )}

      <section className="stack" style={{ gap: "var(--s-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Truy cập nhanh</h2>
        <div className="grid --cols-3" style={{ gap: "var(--s-4)" }}>
          <QuickCard to="/app/licenses" icon="key" title="License keys" desc="Copy key dán vào plugin WordPress." />
          <QuickCard to="/pricing" icon="credit-card" title="Nâng cấp gói" desc="Mở thêm quota + chất lượng cao." />
          <QuickCard to="/catalog" icon="cart" title="Plugin marketplace" desc="Xem 7 plugin WordPress của Pi." />
        </div>
      </section>
    </div>
  );
}

function QuotaCard({ pkg }) {
  const limit = pkg.token_quota_monthly;
  const used = pkg.current_period_tokens_used;
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const pctColor = pct >= 90 ? "var(--danger)" : pct >= 70 ? "var(--warning)" : "var(--brand)";

  const daysLeft = useMemo(() => {
    const start = new Date(pkg.current_period_started_at);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    const ms = end - new Date();
    return Math.max(0, Math.ceil(ms / 86_400_000));
  }, [pkg.current_period_started_at]);

  return (
    <Card style={{ padding: "var(--s-6)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
        <div>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gói hiện tại</div>
          <div className="row" style={{ alignItems: "center", gap: "var(--s-2)", marginTop: "var(--s-1)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--fs-30)" }}>{pkg.package_name}</h2>
            <Badge tone={pkg.status === "active" ? "success" : "warning"}>{pkg.status}</Badge>
          </div>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)", marginTop: "var(--s-1)" }}>
            Còn {daysLeft} ngày trong chu kỳ này • {pkg.allowed_qualities.map((q) => <code key={q} style={{ marginRight: "6px" }}>{q}</code>)}
          </div>
        </div>
        <Button as={Link} to="/pricing" variant="ghost">Nâng cấp <Icon name="arrow-right" size={14} /></Button>
      </div>

      <div className="stack" style={{ gap: "var(--s-2)" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>Token đã dùng</div>
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
            <strong style={{ color: "var(--text-1)", fontSize: "var(--fs-16)" }}>{formatNum(used)}</strong>
            {limit > 0 ? <> / {formatNum(limit)} ({pct.toFixed(1)}%)</> : <> / ∞</>}
          </div>
        </div>
        <div style={{ height: "10px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pctColor, transition: "width 300ms" }} />
        </div>
        {limit > 0 && pct >= 90 && (
          <Alert tone="warning" style={{ marginTop: "var(--s-2)" }}>
            Sắp hết quota! Còn {formatNum(pkg.current_period_remaining)} tokens.
            <Link to="/pricing" style={{ marginLeft: "8px", color: "var(--brand)" }}>Nâng cấp gói →</Link>
          </Alert>
        )}
      </div>
    </Card>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <Card style={{ padding: "var(--s-5)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{label}</div>
          <div style={{ fontSize: "var(--fs-28)", fontWeight: 600, color: "var(--text-1)", marginTop: "var(--s-1)" }}>{value}</div>
        </div>
        <div style={{ color: "var(--text-3)" }}><Icon name={icon} size={22} /></div>
      </div>
    </Card>
  );
}

function UsageChart({ usage }) {
  const daily = usage?.daily || [];
  if (daily.length === 0) {
    return (
      <Card style={{ padding: "var(--s-6)" }}>
        <h3 style={{ margin: "0 0 var(--s-3)", fontSize: "var(--fs-18)" }}>Usage 30 ngày</h3>
        <EmptyState title="Chưa có dữ liệu" description="Hãy gọi API để thấy chart." />
      </Card>
    );
  }
  const max = Math.max(...daily.map((d) => d.tokens), 1);

  return (
    <Card style={{ padding: "var(--s-6)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Usage 30 ngày</h3>
        <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)" }}>
          Tổng: <strong style={{ color: "var(--text-1)" }}>{formatNum(daily.reduce((a, d) => a + d.tokens, 0))}</strong> tokens
        </div>
      </div>
      <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "120px", paddingBottom: "var(--s-2)", borderBottom: "1px solid var(--hairline)" }}>
        {daily.map((d) => {
          const h = Math.max(2, (d.tokens / max) * 100);
          return (
            <div key={d.date} style={{ flex: 1, position: "relative" }} title={`${d.date}: ${formatNum(d.tokens)} tokens • ${d.calls} calls`}>
              <div style={{
                height: `${h}%`,
                background: "var(--brand)",
                borderRadius: "2px 2px 0 0",
                opacity: 0.85,
                transition: "opacity 150ms",
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--s-2)", fontSize: "var(--fs-11)", color: "var(--text-3)" }}>
        <span>{daily[0]?.date?.slice(5) || ""}</span>
        <span>{daily[Math.floor(daily.length / 2)]?.date?.slice(5) || ""}</span>
        <span>{daily[daily.length - 1]?.date?.slice(5) || ""}</span>
      </div>
    </Card>
  );
}

function PluginBreakdown({ usage }) {
  const rows = usage?.by_plugin || [];
  if (rows.length === 0) return null;
  const total = rows.reduce((a, r) => a + r.tokens, 0);

  return (
    <Card style={{ padding: "var(--s-6)" }}>
      <h3 style={{ margin: "0 0 var(--s-4)", fontSize: "var(--fs-18)" }}>Phân bổ theo plugin (30 ngày)</h3>
      <div className="stack" style={{ gap: "var(--s-3)" }}>
        {rows.map((r) => {
          const pct = total > 0 ? (r.tokens / total) * 100 : 0;
          return (
            <div key={r.plugin} className="stack" style={{ gap: "var(--s-1)" }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "var(--fs-14)" }}>
                <span style={{ color: "var(--text-1)" }}>{r.plugin}</span>
                <span style={{ color: "var(--text-2)" }}>{formatNum(r.tokens)} tokens • {r.calls} calls • {pct.toFixed(1)}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function QuickCard({ to, icon, title, desc }) {
  return (
    <Card as={Link} to={to} className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)", padding: "var(--s-5)" }}>
      <div style={{ width: 40, height: 40, borderRadius: "var(--r-3)", background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
        <Icon name={icon} size={20} />
      </div>
      <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>{desc}</p>
    </Card>
  );
}

function SkeletonDashboard() {
  return (
    <>
      <Card style={{ padding: "var(--s-6)" }}><Skeleton style={{ height: 120 }} /></Card>
      <div className="grid --cols-3"><Skeleton style={{ height: 88 }} /><Skeleton style={{ height: 88 }} /><Skeleton style={{ height: 88 }} /></div>
    </>
  );
}

function NoPackageState() {
  return (
    <Card style={{ padding: "var(--s-8)", textAlign: "center" }}>
      <EmptyState
        title="Chưa có gói Pi AI Cloud"
        description="Liên hệ admin hoặc chọn gói phù hợp để bắt đầu dùng AI tokens."
        action={<Button as={Link} to="/pricing" variant="primary">Xem bảng giá</Button>}
      />
    </Card>
  );
}

function formatNum(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}
