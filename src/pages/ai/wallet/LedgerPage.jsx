import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Table, Button, Card } from "@/components/ui";
import { Loader2 } from "lucide-react";

import "./LedgerPage.css";

/**
 * LedgerPage  Infinity Edition
 * Immutable transaction history for Pi tokens.
 */
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
      case "topup": return "N?p tokens";
      case "spend": return "S? d?ng";
      case "refund": return "Hon";
      case "bonus": return "Bonus";
      case "admin_adjust": return "Admin di?u chnh";
      default: return op;
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-40">
        <Loader2 size={40} className="animate-spin" />
        <div className="font-bold uppercase tracking-[0.2em] text-[12px]">ang ti l?ch s?...</div>
      </div>
    );
  }

  return (
    <div className="ledger-container">
      <header className="ledger-header stagger-1">
        <h1 className="ledger-title">L?ch s? giao d?ch</h1>
        <p className="ledger-subtitle">Mi thay d?i s? du du?c log b?t bi?n (immutable ledger).</p>
      </header>

      <div className="ledger-table-card stagger-2 p-0">
        <Table className="ledger-table">
          <thead>
            <tr>
              <th>Th?i gian</th>
              <th>Lo?i</th>
              <th>Ghi ch</th>
              <th className="text-right">Thay d?i</th>
              <th className="text-right">S? du sau</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-20 text-base-content/60 opacity-40 uppercase font-bold tracking-widest text-[11px]">
                  Chua c giao d?ch no.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="time-text">
                  {new Date(e.created_at).toLocaleString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </td>
                <td className="op-text">{opLabel(e.op)}</td>
                <td className="note-text">{e.note}</td>
                <td className={`text-right delta-text ${e.delta > 0 ? "text-success" : "text-danger"}`}>
                  {e.delta > 0 ? "+" : ""}
                  {e.delta.toLocaleString()}
                </td>
                <td className="text-right balance-after-text">
                  {e.balance_after.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4 stagger-2">
          <Button onClick={loadMore} variant="ghost" className="rounded-xl border border-base-border-subtle hover:border-primary-soft px-8 font-bold uppercase tracking-widest text-[11px]">
            T?i thm giao d?ch
          </Button>
        </div>
      )}
    </div>
  );
}
