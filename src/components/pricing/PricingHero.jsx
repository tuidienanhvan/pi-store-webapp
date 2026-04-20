import React from "react";
import { Button, Badge } from "../ui";

export function PricingHero({ billing, setBilling }) {
  return (
    <header className="container stack" style={{ gap: "var(--s-12)", paddingTop: "var(--s-12)", paddingBottom: "var(--s-8)", textAlign: "center" }}>
      <div className="stack" style={{ gap: "var(--s-4)", maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-48)", letterSpacing: "var(--tracking-tight)" }}>
          Gói Pi AI Cloud
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: "var(--fs-20)" }}>
          Trả 1 giá, dùng chung AI tokens cho mọi Pi Pro plugin. Upgrade bất cứ lúc nào.
        </p>
      </div>

      <div className="row" style={{ justifyContent: "center", gap: "var(--s-2)" }}>
        <Button
          variant={billing === "monthly" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setBilling("monthly")}
        >
          Hàng tháng
        </Button>
        <Button
          variant={billing === "yearly" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setBilling("yearly")}
          style={{ position: "relative" }}
        >
          Hàng năm
          <Badge tone="success" style={{ marginLeft: "var(--s-2)" }}>-17%</Badge>
        </Button>
      </div>
    </header>
  );
}
