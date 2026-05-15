import { Link } from "react-router-dom";

import { Button, Card } from "@/_shared/components/ui";
import { Check } from "lucide-react";



export function CheckoutSuccessPage() {

  return (

    <div className="stack" style={{ gap: "var(--s-6)", maxWidth: 760, margin: "0 auto", padding: "var(--s-10) var(--s-4)" }}>

      <Card className="stack" style={{ gap: "var(--s-5)", padding: "var(--s-8)", textAlign: "center" }}>

        <div style={{ margin: "0 auto", width: 64, height: 64, borderRadius: 18, background: "var(--success-soft)", color: "var(--success)", display: "grid", placeItems: "center" }}>

          <Check size={32} />

        </div>

        <div className="stack" style={{ gap: "var(--s-2)" }}>

          <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Subscription activated</h1>

          <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)" }}>

            Stripe d xc nh?n thanh ton. License key v dashboard URL s? du?c g?i qua email sau khi webhook d?ng b? tenant.

          </p>

        </div>

        <div className="row" style={{ justifyContent: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>

          <Button as={Link} to="/app/billing" variant="primary">M? billing</Button>

          <Button as="a" href="http://localhost:5173" target="_blank" variant="success">M? Pi Dashboard</Button>

          <Button as={Link} to="/docs" variant="ghost">Ci Pi Plugin</Button>

        </div>

      </Card>

    </div>

  );

}

