import { useSearchParams } from "react-router-dom";
import { Alert } from "../../components/ui";

export function BillingPage() {
  const [sp] = useSearchParams();
  const topup = sp.get("topup");

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Thanh toán</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>Lịch sử giao dịch Stripe + quản lý phương thức thanh toán.</p>
      </header>

      {topup === "success" && (
        <Alert tone="success" title="Thành công">
          Nạp tokens thành công! Số dư đã được cập nhật trong ví.
        </Alert>
      )}
      {topup === "cancel" && (
        <Alert tone="warning" title="Đã hủy">
          Bạn đã hủy giao dịch Stripe.
        </Alert>
      )}

      <section className="stack" style={{ gap: "var(--s-4)" }}>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-14)" }}>
          Chi tiết invoice + subscription sẽ hiển thị tại đây (Phase 2 — <code style={{ color: "var(--brand)" }}>GET /v1/billing/invoices</code>).
        </p>
      </section>
    </div>
  );
}
