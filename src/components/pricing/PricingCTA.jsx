import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../ui";
import "./PricingCTA.css";

export function PricingCTA() {
  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 var(--s-4) var(--s-16)", textAlign: "center" }}>
      <Card style={{ padding: "var(--s-8)", textAlign: "center", background: "var(--brand-soft)", border: "1px solid var(--brand)" }}>
        <h2 style={{ margin: "0 0 var(--s-2)", fontSize: "var(--fs-30)" }}>Chưa chắc gói nào hợp?</h2>
        <p className="muted" style={{ margin: "0 0 var(--s-5)" }}>
          Bắt đầu với <strong>Starter $9</strong> — nâng cấp sau khi biết traffic thật.
        </p>
        <div className="row" style={{ justifyContent: "center", gap: "var(--s-2)", flexWrap: "wrap" }}>
          <Button as={Link} to="/signup" variant="primary" size="lg">Bắt đầu với Starter</Button>
          <Button as={Link} to="/contact" variant="ghost" size="lg">Liên hệ sales (Enterprise)</Button>
        </div>
      </Card>
    </section>
  );
}
