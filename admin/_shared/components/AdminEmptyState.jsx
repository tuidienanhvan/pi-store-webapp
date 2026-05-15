import React from 'react';
import { Inbox } from 'lucide-react';
import { AdminCard } from './AdminCard';

export function AdminEmptyState({ 
  title = "Không có dữ liệu", 
  description = "Hiện tại chưa có bản ghi nào để hiển thị.", 
  icon: Icon = Inbox,
  action,
  className = ""
}) {
  return (
      <AdminCard className={`w-full max-w-lg p-12 border-dashed ${className}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Icon size={40} className="text-base-content/20" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-wider mb-2">{title}</h3>
          <p className="text-sm font-medium text-base-content/40 mb-8">{description}</p>
          {action}
        </div>
      </AdminCard>
  );
}
