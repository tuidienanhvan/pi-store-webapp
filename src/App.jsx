import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const Catalog = lazy(() => import('./pages/public/Catalog'));
const ProductEcosystemPage = lazy(() => import('./pages/public/ProductEcosystemPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const FaqPage = lazy(() => import('./pages/public/FaqPage'));
const DocsPage = lazy(() => import('./pages/public/DocsPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// User pages
const UserLayout = lazy(() => import('./pages/core/UserLayout'));
const UserOverviewPage = lazy(() => import('./pages/core/UserOverviewPage'));

// Public layout (non-lazy for shell stability)
import PublicLayout from './pages/public/PublicLayout';

// Admin pages
const AdminLayout = lazy(() => import('./pages/core/AdminLayout'));
const AdminOverviewPage = lazy(() => import('./pages/core/AdminOverviewPage'));

// Admin AI
const AdminProvidersPage = lazy(() => import('./pages/ai/providers/AdminProvidersPage'));
const AdminUsagePage = lazy(() => import('./pages/ai/usage/AdminUsagePage'));

// Admin Finance
const AdminPackagesPage = lazy(() => import('./pages/finance/AdminPackagesPage'));
const AdminRevenuePage = lazy(() => import('./pages/finance/AdminRevenuePage'));
const BillingPage = lazy(() => import('./pages/finance/BillingPage'));

// Admin License
const AdminLicensesPage = lazy(() => import('./pages/license/AdminLicensesPage'));
const AdminKeysPage = lazy(() => import('./pages/license/AdminKeysPage'));

// Admin System
const AdminAuditLogPage = lazy(() => import('./pages/system/AdminAuditLogPage'));
const AdminSettingsPage = lazy(() => import('./pages/system/AdminSettingsPage'));
const AdminReleasesPage = lazy(() => import('./pages/system/AdminReleasesPage'));

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-base-100 text-brand font-black animate-pulse">PI STORE</div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:slug" element={<ProductEcosystemPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Routes */}
          <Route path="/app" element={<UserLayout />}>
            <Route index element={<UserOverviewPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="usage" element={<AdminUsagePage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="licenses" element={<AdminLicensesPage />} />
            <Route path="releases" element={<AdminReleasesPage />} />
            <Route path="providers" element={<AdminProvidersPage />} />
            <Route path="keys" element={<AdminKeysPage />} />
            <Route path="audit-log" element={<AdminAuditLogPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;