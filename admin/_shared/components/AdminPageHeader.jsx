import React from 'react';
import { AdminBadge } from './AdminBadge';

/**
 * AdminPageHeader: Tiêu đề trang chuẩn cho hệ thống quản trị.
 * Thay thế cho HudBanner (legacy).
 */
export function AdminPageHeader({ title, subtitle, tagline, badge, actions, className = '' }) {
  return (
    <header className={`flex flex-col gap-2 pb-10 mb-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-base-content m-0">
              {title}
            </h1>
            {badge && <AdminBadge>{badge}</AdminBadge>}
          </div>
          {(subtitle || tagline) && (
            <p className="text-xs font-semibold text-primary tracking-widest opacity-80 m-0 uppercase">
              {tagline || subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2 items-center">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
