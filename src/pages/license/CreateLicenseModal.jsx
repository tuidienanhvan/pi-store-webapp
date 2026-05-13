import { Button } from "@/components/ui";
import { X } from "lucide-react";

export function CreateLicenseModal({ open, onClose, onCreated }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[540px] bg-[rgba(15,18,24,0.98)] border border-base-border rounded-[2rem] p-8 shadow-2xl">
        <header className="mb-6">
          <h2 className="text-2xl font-black tracking-tight text-base-content">To License mi</h2>
          <p className="text-base-content/80 text-sm">C?p php s? d?ng cho khch hng mi.</p>
        </header>
        
        <div className="flex flex-col gap-6 py-4">
           {/* Placeholder for form fields */}
           <div className="text-base-content/60 italic text-xs">Form n?i dung dang du?c c?p nh?t...</div>
        </div>

        <footer className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>H?y</Button>
          <Button variant="primary" onClick={() => onCreated?.()}>To ngay</Button>
        </footer>
        
        <button onClick={onClose} className="absolute top-6 right-6 text-base-content/60 hover:text-base-content">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
