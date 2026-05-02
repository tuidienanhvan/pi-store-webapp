import { Link } from "react-router-dom";
import { Button, Card, Icon } from "../../components/ui";

export function CheckoutSuccessPage() {
  return (
    <div className="stack" style={{ gap: "var(--s-6)", maxWidth: 760, margin: "0 auto", padding: "var(--s-10) var(--s-4)" }}>
      <Card className="stack" style={{ gap: "var(--s-5)", padding: "var(--s-8)", textAlign: "center" }}>
        <div style={{ margin: "0 auto", width: 64, height: 64, borderRadius: 18, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center" }}>
          <Icon name="check" size={32} />
        </div>
        <div className="stack" style={{ gap: "var(--s-2)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Subscription activated</h1>
          <p style={{ margin: 0, color: "var(--text-2)" }}>
            Stripe đã xác nhận thanh toán. License key và dashboard URL sẽ được gửi qua email sau khi webhook đồng bộ tenant.
          </p>
        </div>
        <div className="row" style={{ justifyContent: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>
          <Button as={Link} to="/app/billing" variant="primary">Mở billing</Button>
          <Button as={Link} to="/docs" variant="ghost">Cài Pi Plugin</Button>
        </div>
      </Card>
    </div>
  );
}
