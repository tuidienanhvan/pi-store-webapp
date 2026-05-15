import React from 'react';
import { Outlet } from 'react-router-dom';
import { SiteHeader } from '../../_shared/components/layout/SiteHeader';
import { SiteFooter } from '../../_shared/components/layout/SiteFooter';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
