import { useCartStore } from "../store/useCartStore";
import { useLocale } from "../context/LocaleContext";
import { Drawer, Button, IconButton, EmptyState } from "./ui";

export function CartDrawer() {
  const { isOpen, items, closeCart, removeItem, getCartTotal, clearCart } = useCartStore();
  const { dict } = useLocale();

  const total = getCartTotal();

  const handleMockCheckout = () => {
    // Stage 2: Create external payload
    const payload = btoa(JSON.stringify({ 
      items, 
      total, 
      timestamp: Date.now() 
    }));
    
    // In the future this redirects to payment.piecosystem.com
    alert(`Đang chuyển hướng sang Cổng thanh toán riêng...\nPayload: ${payload.substring(0, 50)}...`);
    clearCart();
    closeCart();
  };

  return (
    <Drawer open={isOpen} onClose={closeCart} side="right" title={`Giỏ hàng (${items.length})`}>
      <div className="stack" style={{ height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "var(--s-2)" }}>
          {items.length === 0 ? (
            <EmptyState icon="cart" title={dict?.common?.empty || "Giỏ hàng trống."} />
          ) : (
            <ul className="stack" style={{ listStyle: "none", padding: 0 }}>
              {items.map((item) => (
                <li key={item.id} className="row" style={{ alignItems: "flex-start", borderBottom: "1px solid var(--hairline)", paddingBottom: "var(--s-4)", marginBottom: "var(--s-4)" }}>
                  {item.cover && (
                    <img src={item.cover} alt={item.name} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "var(--r-2)" }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", color: "var(--text-1)" }}>{item.name}</div>
                    <div style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>{item.billingCycle === "yearly" ? "Gói năm" : "Gói tháng"}</div>
                    <div style={{ marginTop: "var(--s-1)", fontWeight: "500", color: "var(--text-2)" }}>${item.price} {item.currency} x{item.quantity}</div>
                  </div>
                  <IconButton icon="trash" label="Xóa" onClick={() => removeItem(item.id)} size="sm" variant="ghost" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="stack" style={{ paddingTop: "var(--s-4)", borderTop: "1px solid var(--hairline)", marginTop: "auto" }}>
            <div className="row" style={{ justifyContent: "space-between", fontSize: "var(--fs-18)" }}>
              <span style={{ color: "var(--text-2)" }}>Tổng thanh toán:</span>
              <strong style={{ color: "var(--text-1)" }}>${total}</strong>
            </div>
            <Button variant="primary" size="lg" onClick={handleMockCheckout}>
              Tiến hành thanh toán
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
