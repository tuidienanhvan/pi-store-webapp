import { Link } from "react-router-dom";
import { Card, Icon, Table, Badge } from "../../components/ui";

export function SupportPage() {
  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Hỗ trợ</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>Kênh nhanh nhất để được giúp.</p>
      </header>

      <div className="grid --cols-3">
        <Card as="a" href="mailto:support@piwebagency.com" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
            <Icon name="file-text" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Email</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>support@piwebagency.com — trả lời trong 24h.</p>
        </Card>
        
        <Card as="a" href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
            <Icon name="chat" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Zalo chat</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Priority cho Pro/Agency license. Giờ hành chính.</p>
        </Card>
        
        <Card as={Link} to="/docs" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
            <Icon name="book" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Documentation</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Tự tra cứu — cài đặt, API, troubleshooting.</p>
        </Card>

        <Card as={Link} to="/faq" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
            <Icon name="info" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>FAQ</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Câu hỏi thường gặp + giải đáp.</p>
        </Card>

        <Card as="a" href="https://github.com/piwebagency/issues" target="_blank" rel="noreferrer" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}>
            <Icon name="activity" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Bug tracker</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>GitHub Issues — public, community-tracked.</p>
        </Card>

        <Card as="a" href="https://status.piwebagency.com" target="_blank" rel="noreferrer" className="stack hover-lift" style={{ textDecoration: "none", color: "inherit", gap: "var(--s-3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--r-2)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)" }}>
            <Icon name="check" size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: "var(--fs-18)" }}>System status</h3>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>Live uptime + incidents log.</p>
        </Card>
      </div>

      <section className="stack" style={{ gap: "var(--s-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>Tickets của tôi</h2>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
          Ticket system đang xây dựng (Phase 4). Tạm thời dùng email / Zalo / GitHub issues.
        </p>
      </section>

      <section className="stack" style={{ gap: "var(--s-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>SLA</h2>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Table>
            <thead><tr><th>Tier</th><th>Kênh</th><th>Response time</th><th>Priority</th></tr></thead>
            <tbody>
              <tr><td>Free</td><td>Email, community Discord</td><td>3-5 ngày</td><td><Badge tone="neutral">Low</Badge></td></tr>
              <tr><td>Pro</td><td style={{ fontWeight: "500" }}>Email, Zalo</td><td style={{ fontWeight: "500" }}>24h</td><td><Badge tone="info">Medium</Badge></td></tr>
              <tr><td>Agency</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>Zalo direct, phone</td><td style={{ fontWeight: "500", color: "var(--brand)" }}>4h</td><td><Badge tone="warning">High</Badge></td></tr>
              <tr><td>Founder</td><td style={{ fontWeight: "500", color: "var(--success)" }}>Direct line to dev team</td><td style={{ fontWeight: "500", color: "var(--success)" }}>2h</td><td><Badge tone="danger">VIP</Badge></td></tr>
            </tbody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
