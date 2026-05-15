import React from 'react';
import { AdminBadge } from './AdminBadge';

/**
 * AdminPageHeader: Tiêu đề trang chuẩn cho hệ thống quản trị.
 * Thay thế cho HudBanner (legacy).
 */
export function AdminPageHeader({ title, subtitle, tagline, badge, actions, className = '' }) {
  return (
    <header className={`hud-banner ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1 className="hud-banner__title m-0">
              {title}
            </h1>
            {badge && <AdminBadge>{badge}</AdminBadge>}
          </div>
          {(subtitle || tagline) && (
            <div className="hud-banner__subtitle">
              <div className="hud-banner__subtitle-line" />
              <p className="hud-banner__tagline m-0">
                {tagline || subtitle}
              </p>
            </div>
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
