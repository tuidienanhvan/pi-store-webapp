import React from 'react';

/**
 * AdminTable: Bảng dữ liệu chuẩn cho hệ thống quản trị.
 */
export function AdminTable({ children, className = '', containerClassName = '' }) {
  return (
    <div className={`w-full overflow-x-auto custom-scrollbar rounded-xl border border-base-content/5 bg-base-content/[0.01] ${containerClassName}`}>
      <table className={`w-full border-collapse text-left ${className}`}>
        {children}
      </table>
    </div>
  );
}
