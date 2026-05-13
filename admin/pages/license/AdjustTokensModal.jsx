import { useState } from "react";
import { api } from "@/lib/api-client";
import { Alert, Button, Card, Input, Modal, Textarea } from "@/components/ui";

export function AdjustTokensModal({ license, onClose, onChanged }) {
  const [delta, setDelta] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!license) return null;

  const submit = async (event) => {
    event.preventDefault();
    const parsedDelta = Number(delta);
    if (!Number.isFinite(parsedDelta) || parsedDelta === 0) {
      setErr("Delta must be a non-zero number.");
      return;
    }
    if (!note.trim()) {
      setErr("A note is required for audit.");
      return;
    }
    if (!confirm(`Apply token adjustment ${parsedDelta.toLocaleString()} to license #${license.id}?`)) return;

    setSaving(true);
    setErr("");
    try {
      await api.admin.adjustTokens(license.id, parsedDelta, note.trim());
      await onChanged?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Adjust tokens" size="md">
      <form onSubmit={submit} className="stack gap-4">
        <Card className="p-4 bg-base-200/40">
          <div className="text-[11px] uppercase font-black tracking-widest opacity-50">License</div>
          <div className="mt-1 font-mono text-sm">#{license.id} - {license.email}</div>
          <div className="mt-1 text-xs opacity-60">{license.plugin} / {license.tier}</div>
        </Card>

        <Input
          label="Token delta"
          type="number"
          required
          value={delta}
          onChange={(event) => setDelta(event.target.value)}
          hint="Use positive numbers for top-up/refund, negative numbers for debit."
          placeholder="100000"
        />
        <Textarea
          label="Audit note"
          rows={3}
          required
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Manual support adjustment"
        />

        {err && <Alert tone="danger">{err}</Alert>}

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !delta || !note.trim()}>
            {saving ? "Applying" : "Apply adjustment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

