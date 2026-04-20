import { useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { useAdminT, formatCurrencyUSD } from "../../lib/adminI18n";
import { Card, Badge, Button, Table, Icon } from "../../components/ui";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "T5/25", usd: 3200 }, { month: "T6/25", usd: 4100 }, { month: "T7/25", usd: 3800 },
  { month: "T8/25", usd: 5200 }, { month: "T9/25", usd: 6100 }, { month: "T10/25", usd: 7400 },
  { month: "T11/25", usd: 8200 }, { month: "T12/25", usd: 9100 }, { month: "T1/26", usd: 8700 },
  { month: "T2/26", usd: 10200 }, { month: "T3/26", usd: 11800 }, { month: "T4/26", usd: 12540 },
];

const PACKAGE_REVENUE = [
  { name: "Agency", usd: 5800, color: "#7c3aed" },
  { name: "Pro",    usd: 4200, color: "#2563eb" },
  { name: "Starter",usd: 2100, color: "#059669" },
  { name: "Enterprise", usd: 440, color: "#d97706" },
];

const FAILED_PAYMENTS = [
  { id: 1, email: "agency@fail.vn", amount: 299, reason: "card_declined", date: "2026-04-10" },
  { id: 2, email: "another@test.com", amount: 99, reason: "insufficient_funds", date: "2026-04-15" },
];

const INVOICES = [
  { id: "INV-001", email: "admin@saigon.vn", amount: 299, status: "paid", date: "2026-03-01" },
  { id: "INV-002", email: "agency_hn@gmail.com", amount: 99, status: "paid", date: "2026-04-01" },
  { id: "INV-003", email: "dev.test@outlook.com", amount: 99, status: "pending", date: "2026-04-15" },
];

const DAYS_OPTIONS = [7, 30, 90, 365];

export function AdminRevenuePage() {
  const { locale } = useLocale();
  const t = useAdminT();
  const [days, setDays] = useState(30);

  const totalPackageRevenue = PACKAGE_REVENUE.reduce((s, p) => s + p.usd, 0);
  const maxMonthly = Math.max(...MONTHLY_REVENUE.map(m => m.usd));

  // Build conic-gradient for pie chart
  let cumulativePct = 0;
  const pieSegments = PACKAGE_REVENUE.map(p => {
    const pct = (p.usd / totalPackageRevenue) * 100;
    const seg = { ...p, pct, start: cumulativePct, end: cumulativePct + pct };
    cumulativePct += pct;
    return seg;
  });
  const conicGradient = `conic-gradient(${pieSegments.map(s => `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`).join(", ")})`;

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>{t.revenue_title}</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>Thống kê tài chính toàn hệ thống.</p>
        </div>
        <div className="row gap-2">
          {DAYS_OPTIONS.map(d => (
            <Button key={d} size="sm" variant={days === d ? "primary" : "ghost"} onClick={() => setDays(d)}>
              {d === 365 ? "1 năm" : `${d} ngày`}
            </Button>
          ))}
        </div>
      </header>

      {/* ─── KPI Row ─── */}
      <div className="grid --cols-4">
        <Card className="stack gap-2 bg-brand text-on-brand p-5">
          <div style={{ fontSize: "var(--fs-14)", opacity: 0.9 }}>💰 {t.mrr}</div>
          <div style={{ fontSize: "var(--fs-32)", fontWeight: "bold" }}>$12,540</div>
          <div style={{ fontSize: "var(--fs-12)", opacity: 0.75 }}>Monthly Recurring Revenue</div>
        </Card>
        <Card className="stack gap-2 p-5">
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>📈 {t.arr}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>$150,480</div>
          <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>ARR = MRR × 12</div>
        </Card>
        <Card className="stack gap-2 p-5">
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>💎 {t.ltv} (avg)</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--text-1)" }}>$742</div>
          <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>ARPU / Churn rate</div>
        </Card>
        <Card className="stack gap-2 p-5">
          <div style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>📉 {t.churn_rate}</div>
          <div style={{ fontSize: "var(--fs-24)", fontWeight: "bold", color: "var(--danger)" }}>3.2%</div>
          <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>Licenses revoked (30d)</div>
        </Card>
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "var(--s-6)" }}>
        {/* 12-month Bar Chart */}
        <section className="stack gap-3">
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{t.revenue_by_month}</h2>
          <Card style={{ height: "280px", display: "flex", flexDirection: "column", padding: "var(--s-5)", gap: "var(--s-3)" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "4px" }}>
              {MONTHLY_REVENUE.map(m => {
                const heightPct = (m.usd / maxMonthly) * 100;
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: "4px" }} title={`${m.month}: $${m.usd.toLocaleString()}`}>
                    <div style={{ height: `${heightPct}%`, width: "100%", background: "var(--brand)", borderRadius: "3px 3px 0 0", minHeight: "4px" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {MONTHLY_REVENUE.map(m => (
                <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: "var(--fs-10)", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden" }}>{m.month}</div>
              ))}
            </div>
          </Card>
        </section>

        {/* Pie Chart by Package */}
        <section className="stack gap-3">
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>{t.revenue_by_package}</h2>
          <Card className="stack gap-4 p-5" style={{ height: "100%" }}>
            {/* Donut via conic-gradient */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "140px", height: "140px",
                borderRadius: "50%",
                background: conicGradient,
                boxShadow: "0 0 0 30px var(--surface-1) inset",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "var(--fs-18)", fontWeight: "bold", color: "var(--text-1)" }}>${totalPackageRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)" }}>~30 days</div>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="stack gap-2">
              {pieSegments.map(s => (
                <div key={s.name} className="row justify-between text-13">
                  <span className="row gap-2">
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: s.color, marginTop: 2 }} />
                    {s.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>${s.usd.toLocaleString()} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>({s.pct.toFixed(0)}%)</span></span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {/* ─── Failed Payments + Invoices ─── */}
      <div className="grid --cols-2" style={{ gap: "var(--s-6)" }}>
        <section className="stack gap-3">
          <div className="row justify-between">
            <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>⚠️ {t.failed_payments}</h2>
            <Badge tone="danger">{FAILED_PAYMENTS.length} pending</Badge>
          </div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead><tr><th>Email</th><th style={{ textAlign: "right" }}>Số tiền</th><th>Lý do</th><th>Ngày</th></tr></thead>
              <tbody>
                {FAILED_PAYMENTS.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontSize: "var(--fs-13)" }}>{f.email}</td>
                    <td style={{ textAlign: "right", color: "var(--danger)", fontWeight: 600 }}>${f.amount}</td>
                    <td><Badge tone="warning" style={{ fontSize: "var(--fs-11)" }}>{f.reason}</Badge></td>
                    <td style={{ fontSize: "var(--fs-13)", color: "var(--text-2)" }}>{f.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </section>

        <section className="stack gap-3">
          <h2 style={{ margin: 0, fontSize: "var(--fs-20)" }}>🧾 {t.invoices}</h2>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead><tr><th>Invoice</th><th>Email</th><th style={{ textAlign: "right" }}>Số tiền</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "var(--fs-13)", fontWeight: 600 }}>{inv.id}</td>
                    <td style={{ fontSize: "var(--fs-13)" }}>{inv.email}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>${inv.amount}</td>
                    <td><Badge tone={inv.status === "paid" ? "success" : "warning"}>{inv.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </section>
      </div>
    </div>
  );
}

