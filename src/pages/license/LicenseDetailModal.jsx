import { Button, Icon, Badge } from "@/components/ui";

export function LicenseDetailModal({ licenseId, onClose, onChanged }) {
  if (!licenseId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[640px] bg-[rgba(15,18,24,0.98)] border border-base-border rounded-[2rem] p-8 shadow-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-base-content">Chi ti?t License</h2>
            <p className="text-base-content/60 font-mono text-xs mt-1">ID: #{licenseId}</p>
          </div>
          <Badge tone="success">ACTIVE</Badge>
        </header>

        <div className="py-8 border-y border-base-border-subtle my-6">
           <p className="text-base-content/80 text-sm">Thng tin chi ti?t c?a License dang du?c ti...</p>
        </div>

        <footer className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>ng</Button>
          <Button variant="primary" onClick={() => onChanged?.()}>Luu thay d?i</Button>
        </footer>

        <button onClick={onClose} className="absolute top-6 right-6 text-base-content/60 hover:text-base-content">
          <Icon name="x" size={20} />
        </button>
      </div>
    </div>
  );
}
