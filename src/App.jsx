import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import catalog from "./data/catalog.generated.json";
import "./App.css";

import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ProductEcosystemPage } from "./pages/ProductEcosystemPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { HomePage } from "./pages/public/HomePage";
import { PricingPage } from "./pages/public/PricingPage";
import { AboutPage } from "./pages/public/AboutPage";
import { FaqPage } from "./pages/public/FaqPage";
import { DocsPage, DocPlaceholderPage } from "./pages/public/DocsPage";
import { ContactPage } from "./pages/public/ContactPage";

import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { RequireAuth } from "./components/layout/RequireAuth";

import { UserLayout } from "./pages/user/UserLayout";
const UserOverviewPage = lazy(() => import("./pages/user/UserOverviewPage").then((m) => ({ default: m.UserOverviewPage })));
const UsagePage = lazy(() => import("./pages/user/UsagePage").then((m) => ({ default: m.UsagePage })));
const WalletPage = lazy(() => import("./pages/user/WalletPage").then((m) => ({ default: m.WalletPage })));
const LedgerPage = lazy(() => import("./pages/user/LedgerPage").then((m) => ({ default: m.LedgerPage })));
const LicensesPage = lazy(() => import("./pages/user/LicensesPage").then((m) => ({ default: m.LicensesPage })));
const BillingPage = lazy(() => import("./pages/user/BillingPage").then((m) => ({ default: m.BillingPage })));
const CheckoutSuccessPage = lazy(() => import("./pages/user/CheckoutSuccessPage").then((m) => ({ default: m.CheckoutSuccessPage })));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const DownloadsPage = lazy(() => import("./pages/user/DownloadsPage").then((m) => ({ default: m.DownloadsPage })));
const SupportPage = lazy(() => import("./pages/user/SupportPage").then((m) => ({ default: m.SupportPage })));
const ApiKeysPage = lazy(() => import("./pages/user/ApiKeysPage").then((m) => ({ default: m.ApiKeysPage })));

import { AdminLayout } from "./pages/admin/AdminLayout";
const AdminOverviewPage = lazy(() => import("./pages/admin/AdminOverviewPage").then((m) => ({ default: m.AdminOverviewPage })));
const AdminLicensesPage = lazy(() => import("./pages/admin/AdminLicensesPage").then((m) => ({ default: m.AdminLicensesPage })));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage })));
const AdminProvidersPage = lazy(() => import("./pages/admin/AdminProvidersPage").then((m) => ({ default: m.AdminProvidersPage })));
const AdminKeysPage = lazy(() => import("./pages/admin/AdminKeysPage").then((m) => ({ default: m.AdminKeysPage })));
const AdminPackagesPage = lazy(() => import("./pages/admin/AdminPackagesPage").then((m) => ({ default: m.AdminPackagesPage })));
const AdminUsagePage = lazy(() => import("./pages/admin/AdminUsagePage").then((m) => ({ default: m.AdminUsagePage })));
const AdminRevenuePage = lazy(() => import("./pages/admin/AdminRevenuePage").then((m) => ({ default: m.AdminRevenuePage })));
const AdminReleasesPage = lazy(() => import("./pages/admin/AdminReleasesPage").then((m) => ({ default: m.AdminReleasesPage })));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage })));
const AdminAuditLogPage = lazy(() => import("./pages/admin/AdminAuditLogPage").then((m) => ({ default: m.AdminAuditLogPage })));

function PageFallback() {
  return (
    <div className="page-fallback">
      <svg className="page-fallback__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Đang tải...
    </div>
  );
}

export default function App() {
  const products = catalog?.products ?? [];
  const siteUrl = catalog?.baseUrl ?? "https://store.pi-ecosystem.com";

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/app" element={<RequireAuth><UserLayout /></RequireAuth>}>
          <Route index element={<Suspense fallback={<PageFallback />}><UserOverviewPage /></Suspense>} />
          <Route path="usage" element={<Suspense fallback={<PageFallback />}><UsagePage /></Suspense>} />
          <Route path="wallet" element={<Suspense fallback={<PageFallback />}><WalletPage /></Suspense>} />
          <Route path="ledger" element={<Suspense fallback={<PageFallback />}><LedgerPage /></Suspense>} />
          <Route path="licenses" element={<Suspense fallback={<PageFallback />}><LicensesPage /></Suspense>} />
          <Route path="downloads" element={<Suspense fallback={<PageFallback />}><DownloadsPage /></Suspense>} />
          <Route path="billing" element={<Suspense fallback={<PageFallback />}><BillingPage /></Suspense>} />
          <Route path="billing/success" element={<Suspense fallback={<PageFallback />}><CheckoutSuccessPage /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<PageFallback />}><ProfilePage /></Suspense>} />
          <Route path="api-keys" element={<Suspense fallback={<PageFallback />}><ApiKeysPage /></Suspense>} />
          <Route path="support" element={<Suspense fallback={<PageFallback />}><SupportPage /></Suspense>} />
        </Route>

        <Route path="/admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
          <Route index element={<Suspense fallback={<PageFallback />}><AdminOverviewPage /></Suspense>} />
          <Route path="licenses" element={<Suspense fallback={<PageFallback />}><AdminLicensesPage /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageFallback />}><AdminUsersPage /></Suspense>} />
          <Route path="providers" element={<Suspense fallback={<PageFallback />}><AdminProvidersPage /></Suspense>} />
          <Route path="keys" element={<Suspense fallback={<PageFallback />}><AdminKeysPage /></Suspense>} />
          <Route path="packages" element={<Suspense fallback={<PageFallback />}><AdminPackagesPage /></Suspense>} />
          <Route path="usage" element={<Suspense fallback={<PageFallback />}><AdminUsagePage /></Suspense>} />
          <Route path="revenue" element={<Suspense fallback={<PageFallback />}><AdminRevenuePage /></Suspense>} />
          <Route path="releases" element={<Suspense fallback={<PageFallback />}><AdminReleasesPage /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageFallback />}><AdminSettingsPage /></Suspense>} />
          <Route path="audit-log" element={<Suspense fallback={<PageFallback />}><AdminAuditLogPage /></Suspense>} />
        </Route>

        <Route path="/*" element={<PublicShell products={products} siteUrl={siteUrl} />} />
      </Routes>
    </AuthProvider>
  );
}

function PublicShell({ products, siteUrl }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="page-shell public-shell__main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<Navigate to="/pricing" replace />} />
          <Route path="/product/pi-ecosystem" element={<ProductEcosystemPage products={products} siteUrl={siteUrl} />} />
          <Route path="/product/:slug" element={<Navigate to="/pricing" replace />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:doc" element={<DocPlaceholderPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage siteUrl={siteUrl} />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
