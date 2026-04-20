import { Navigate, Route, Routes } from "react-router-dom";
import catalog from "./data/catalog.generated.json";

// Public storefront (existing)
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CartDrawer } from "./components/CartDrawer";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Public new pages
import { HomePage } from "./pages/public/HomePage";
import { PricingPage } from "./pages/public/PricingPage";
import { AboutPage } from "./pages/public/AboutPage";
import { FaqPage } from "./pages/public/FaqPage";
import { DocsPage, DocPlaceholderPage } from "./pages/public/DocsPage";
import { ContactPage } from "./pages/public/ContactPage";

// Auth
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { RequireAuth } from "./components/layout/RequireAuth";

// User dashboard
import { UserLayout } from "./pages/user/UserLayout";
import { UserOverviewPage } from "./pages/user/UserOverviewPage";
import { UsagePage } from "./pages/user/UsagePage";
import { WalletPage } from "./pages/user/WalletPage";
import { LedgerPage } from "./pages/user/LedgerPage";
import { LicensesPage } from "./pages/user/LicensesPage";
import { BillingPage } from "./pages/user/BillingPage";
import { ProfilePage } from "./pages/user/ProfilePage";
import { DownloadsPage } from "./pages/user/DownloadsPage";
import { SupportPage } from "./pages/user/SupportPage";
import { ApiKeysPage } from "./pages/user/ApiKeysPage";

// Admin dashboard
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminLicensesPage } from "./pages/admin/AdminLicensesPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminProvidersPage } from "./pages/admin/AdminProvidersPage";
import { AdminKeysPage } from "./pages/admin/AdminKeysPage";
import { AdminPackagesPage } from "./pages/admin/AdminPackagesPage";
import { AdminUsagePage } from "./pages/admin/AdminUsagePage";
import { AdminRevenuePage } from "./pages/admin/AdminRevenuePage";
import { AdminReleasesPage } from "./pages/admin/AdminReleasesPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminAuditLogPage } from "./pages/admin/AdminAuditLogPage";

export default function App() {
  const products = catalog?.products ?? [];
  const siteUrl = catalog?.baseUrl ?? "https://store.pi-ecosystem.com";

  return (
    <AuthProvider>
      <Routes>
        {/* Auth routes — no header/footer */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User dashboard */}
        <Route
          path="/app"
          element={<RequireAuth><UserLayout /></RequireAuth>}
        >
          <Route index            element={<UserOverviewPage />} />
          <Route path="usage"     element={<UsagePage />} />
          <Route path="wallet"    element={<WalletPage />} />
          <Route path="ledger"    element={<LedgerPage />} />
          <Route path="licenses"  element={<LicensesPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="billing"   element={<BillingPage />} />
          <Route path="profile"   element={<ProfilePage />} />
          <Route path="api-keys"  element={<ApiKeysPage />} />
          <Route path="support"   element={<SupportPage />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={<RequireAuth admin><AdminLayout /></RequireAuth>}
        >
          <Route index           element={<AdminOverviewPage />} />
          <Route path="licenses" element={<AdminLicensesPage />} />
          <Route path="users"    element={<AdminUsersPage />} />
          <Route path="providers" element={<AdminProvidersPage />} />
          <Route path="keys"      element={<AdminKeysPage />} />
          <Route path="packages"  element={<AdminPackagesPage />} />
          <Route path="usage"    element={<AdminUsagePage />} />
          <Route path="revenue"  element={<AdminRevenuePage />} />
          <Route path="releases" element={<AdminReleasesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="audit-log" element={<AdminAuditLogPage />} />
        </Route>

        {/* Public storefront */}
        <Route path="/*" element={<PublicShell products={products} siteUrl={siteUrl} />} />
      </Routes>
    </AuthProvider>
  );
}

function PublicShell({ products, siteUrl }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <CartDrawer />

      <main className="page-shell" style={{ paddingTop: "var(--header-h)" }}>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/catalog"       element={<CatalogPage products={products} siteUrl={siteUrl} />} />
          <Route path="/product/:slug" element={<ProductDetailPage products={products} siteUrl={siteUrl} />} />
          <Route path="/pricing"       element={<PricingPage />} />
          <Route path="/about"         element={<AboutPage />} />
          <Route path="/faq"           element={<FaqPage />} />
          <Route path="/docs"          element={<DocsPage />} />
          <Route path="/docs/:doc"     element={<DocPlaceholderPage />} />
          <Route path="/contact"       element={<ContactPage />} />
          <Route path="/home"          element={<Navigate to="/" replace />} />
          <Route path="*"              element={<NotFoundPage siteUrl={siteUrl} />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}
