import { useState } from "react";
import { api } from "@/lib/api-client";
import { Alert, Button, Input, Modal, Select, Textarea } from "@/components/ui";

const INITIAL_FORM = {
  email: "",
  name: "",
  plugin: "pi-api",
  tier: "pro",
  max_sites: 1,
  expires_days: 365,
  notes: "",
};

export function CreateLicenseModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await api.admin.createLicense({
        plugin: form.plugin,
        email: form.email.trim(),
        name: form.name.trim(),
        tier: form.tier,
        max_sites: Number(form.max_sites || 1),
        expires_days: Number(form.expires_days || 0),
        notes: form.notes.trim(),
      });
      setForm(INITIAL_FORM);
      await onCreated?.();
      onClose();
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create license" size="lg">
      <form onSubmit={submit} className="stack gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="customer@example.com"
          />
          <Input
            label="Customer name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="Customer or company"
          />
          <Select
            label="Plugin"
            value={form.plugin}
            onChange={(event) => setField("plugin", event.target.value)}
            options={[
              { label: "pi-api", value: "pi-api" },
              { label: "pi-seo", value: "pi-seo" },
              { label: "pi-chatbot", value: "pi-chatbot" },
              { label: "pi-leads", value: "pi-leads" },
            ]}
          />
          <Select
            label="Tier"
            value={form.tier}
            onChange={(event) => setField("tier", event.target.value)}
            options={[
              { label: "free", value: "free" },
              { label: "pro", value: "pro" },
              { label: "max", value: "max" },
            ]}
          />
          <Input
            label="Max sites"
            type="number"
            min="1"
            value={form.max_sites}
            onChange={(event) => setField("max_sites", event.target.value)}
          />
          <Input
            label="Expires after days"
            type="number"
            min="0"
            hint="0 means no expiry date is set."
            value={form.expires_days}
            onChange={(event) => setField("expires_days", event.target.value)}
          />
        </div>

        <Textarea
          label="Internal notes"
          rows={3}
          value={form.notes}
          onChange={(event) => setField("notes", event.target.value)}
          placeholder="Support note, deal context, or manual billing reference"
        />

        {err && <Alert tone="danger">{err}</Alert>}

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !form.email.trim()}>
            {saving ? "Creating" : "Create license"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

