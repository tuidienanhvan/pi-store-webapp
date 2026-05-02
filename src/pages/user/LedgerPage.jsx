import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import { Table, Button, Card } from "../../components/ui";

export function LedgerPage() {
  const [entries, setEntries] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.ai
      .ledger(50, 0)
      .then((res) => {
        setEntries(res.entries || []);
        setHasMore(res.has_more);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    const next = offset + 50;
    const res = await api.ai.ledger(50, next);
    setEntries((prev) => [...prev, ...(res.entries || [])]);
    setHasMore(res.has_more);
    setOffset(next);
  };

  const opLabel = (op) => {
    switch (op) {
      case "topup": return " Nạp tokens";
      case "spend": return " Sử dụng";
      case "refund": return " Hoàn";
      case "bonus": return " Bonus";
      case "admin_adjust": return " Admin điều chỉnh";
      default: return op;
    }
  };

  return (
    <div className="stack" style={{ gap: "var(--s-8)" }}>
      <header className="stack" style={{ gap: "var(--s-2)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>Lịch sử giao dịch</h1>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "var(--fs-18)" }}>Mọi thay đổi số dư được log bất biến (immutable ledger).</p>
      </header>

      {loading ? (
        <div style={{ padding: "var(--s-8)", color: "var(--text-3)", textAlign: "center" }}>Đang tải…</div>
      ) : (
        <div className="stack" style={{ gap: "var(--s-4)" }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Loại</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: "right" }}>Thay đổi</th>
                  <th style={{ textAlign: "right" }}>Số dư sau</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)" }}>
                      Chưa có giao dịch nào.
                    </td>
                  </tr>
                )}
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td style={{ color: "var(--text-2)", fontSize: "var(--fs-14)" }}>{new Date(e.created_at).toLocaleString("vi-VN")}</td>
                    <td style={{ fontWeight: "500" }}>{opLabel(e.op)}</td>
                    <td style={{ color: "var(--text-2)", fontSize: "var(--fs-14)" }}>{e.note}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: e.delta > 0 ? "var(--success)" : "var(--danger)" }}>
                      {e.delta > 0 ? "+" : ""}
                      {e.delta.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>{e.balance_after.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "var(--s-4)" }}>
              <Button onClick={loadMore} variant="ghost">Tải thêm</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
