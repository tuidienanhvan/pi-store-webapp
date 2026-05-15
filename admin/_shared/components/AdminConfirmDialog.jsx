import React from 'react';
import { AdminCard } from './AdminCard';
import { Button } from '@/_shared/components/ui';
import { AlertTriangle } from 'lucide-react';

export function AdminConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel = "Xác nhận", 
  cancelLabel = "Hủy bỏ",
  tone = "danger" 
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <AdminCard className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full bg-${tone}/10 flex items-center justify-center mb-6`}>
            <AlertTriangle size={32} className={`text-${tone}`} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">{title}</h2>
          <p className="text-base-content/60 font-bold mb-8">{message}</p>
          
          <div className="flex items-center gap-4 w-full">
            <Button variant="ghost" className="flex-1" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={tone === 'danger' ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
