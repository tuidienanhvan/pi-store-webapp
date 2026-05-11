/**
 * Admin-side i18n ? single translations + locale-aware formatters.
 *
 * Usage:
 *   import { useAdminT, formatCurrency, formatDate } from "../../lib/adminI18n";
 *   const t = useAdminT();              // returns object { licenses_title, ... }
 *   const price = formatCurrency(2900, locale);  // "$29.00" or "725.000 ?"
 */

import { useLocale } from "../context/LocaleContext";

// Rough FX rate for display. For real pricing decisions, use Stripe / live rate.
const USD_TO_VND = 25_000;

// ---------------------------------------------------------
// Translations ? all admin-facing strings
export const ADMIN_T = {
  vi: {
    // Common
    loading: "Đang tải",
    saving: "Đang lưu",
    saved: "Đã lưu",
    save: "Lưu",
    cancel: "Hủy",
    close: "Đóng",
    edit: "Sửa",
    delete: "Xóa",
    create: "Tạo",
    update: "Cập nhật",
    search: "Tìm kiếm",
    clear: "Xóa lọc",
    refresh: "Tải lại",
    details: "Chi tiết",
    actions: "Hành động",
    total: "Tổng",
    status: "Trạng thái",
    never: "Chưa",
    all: "Tất cả",
    confirm_delete: "Bạn chắc muốn Xóa?",

    // Pagination
    page: "Trang",
    of: "/",
    showing: "Hiển",
    per_page: "/Trang",
    prev: "? Trước",
    next: "Sau ?",

    // Time labels
    joined: "?K",
    login: "Login",
    last_run: "Lần chạy cuối",
    next_run: "Lần chạy k?",
    duration: "Thời gian",

    // Overview page
    overview_title: "Tổng quan hệ thống",
    overview_subtitle: "Số liệu real-time.",
    revenue_card: "Doanh thu",
    active_licenses: "Licenses active",
    tokens_used: "Pi Tokens dùng",
    system_status: "Trạng thái hệ thống",
    provider_health_matrix: "Provider Health Matrix",
    key_pool_status: "Key Pool Status",
    realtime_alerts: "Cảnh báo real-time",
    expiring_soon: "Sắp hết hạn (7 ngày tải)",
    view_all: "Xem tất c?",
    manage: "Quản lý",
    new_license: "License mới",
    add_key: "Thêm key",
    new_user: "User mới",
    upload_release: "Upload release",
    new_this_week: "mới tuần nay",
    proj_month_end: "Dự kiến cuối tháng",

// Licenses
    licenses_title: "Licenses",
    licenses_subtitle: "Quản lý license + assign Cloud package + cấp keys cho khách.",
    create_license: "Tạo license",
    license_id: "ID",
    license_key: "Key",
    customer: "Khách hàng",
    plugin: "Plugin",
    package: "Gói",
    package_quota: "Gói + quota",
    sites: "Sites",
    keys: "Keys",
    expires: "Hạn",
    tier: "Tier",
    revoke: "Thu hồi",
    reactivate: "Kích hoạt",
    search_license_placeholder: "Tìm theo email / key / tên?",
    filter_status: "Trạng thái",
    filter_tier: "Tier",
    filter_package: "Gói",
    filter_plugin: "Plugin",
    filter_expires: "Hạn",
    no_licenses: "Chưa có license",
    no_licenses_desc: "Tạo license đầu tiên cho khách.",
    no_match: "Không match filter",
    no_match_desc: "Thử đổi filter hoặc Clear.",
    status_active: "Đang hoạt động",
    status_revoked: "? đã thu hồi",
    status_expired: "Hết hạn",
    expires_7d: "Hết hạn <7 ngày",
    expires_30d: "Hết hạn <30 ngày",
    expires_90d: "Hết hạn <90 ngày",
    expires_past: "?? hết hạn",
    sort_newest: "Mới nhất",
    sort_oldest: "Cũ nhất",
    sort_expiring: "Sắp hết hạn",
    sort_expires_far: "Hạn xa nhất",

    // Users
    users_title: "Khách hàng & User",
    users_subtitle: "Quản trị tải khoản và phân quyền",
    accounts: "tải khoản",
    create_user_btn: "Tạo tải khoản",
    profile: "Hồ sơ",
    role: "Vai trò",
    balance: "Số dư",
    total_spent: "Tổng chi",
    signup_last_login: "Ngày ?K / Lần cuối",
    role_admin: "ADMIN",
    role_user: "USER",
    role_banned: "? đã KHÓA",
    action_demote: "Hủy quyền",
    action_promote: "Cấp Admin",
    action_ban: "Khóa",
    action_unban: "Mở khóa",
    confirm_promote: "Phong quyền Admin cho user này?",
    confirm_demote: "Hủy quyền thành User thường?",
    confirm_ban: "Khóa tải khoản? Mời license sẽ bị dừng bang.",
    confirm_unban: "Mở khóa tải khoản?",
    no_users: "Không tìm thấy khách hàng.",

    // AI Providers
    providers_title: "AI Providers",
    providers_subtitle: "Upstream AI router. Free tier ưu tiên, paid dùng khi cần chấtSố liệu?ng cao.",
    add_provider: "Thêm provider",
    slug: "Slug",
    model: "Model",
    priority: "Ưu tiên",
    health: "Health",
    cost: "Chi phí",
    api_key_status: "API Key",
    enabled: "Bật",
    has_key: "dùngSố liệu?u",
    no_key: "Chưa có",
    keys_in_pool: "Keys trong pool",
    test: "Test",
    available: "Có sẵn",
    allocated: "Đã cấp",
    healthy: "Tốt",

    // Key Pool
    keys_title: "Key Pool",
    keys_subtitle: "Quản lý API keys upstream. Keys được cấp riêng cho têng customer ? khng dùng chung.",
    add_key_btn: "Thêm key",
    bulk_import: "Nhập hàng loạt",
    reset_period: "Reset chu kỳ",
    stat_total: "Tổng",
    stat_available: "Có sẵn",
    stat_allocated: "Đã cấp",
    stat_exhausted: "Hết quota",
    stat_banned: "? đã cấm",
    label: "Nhãn",
    owner: "Chủ sở hữu",
    used: "Đã dùng",
    pool_empty_title: "Pool dang trống",
    pool_empty_desc: "Khách Chưa thể dùng Pi AI Cloud cho tải khi còn ?t nhất 1 key trong pool.",

    // Packages
    packages_title: "Gói subscription",
    packages_subtitle: "Định hình các gói. Số keys cấp cho khách được admin tùy chỉnh riêng ? Key Pool.",
    add_package: "Thêm gói",
    price_monthly: "Giá tháng",
    price_yearly: "Giá nam",
    token_quota: "Quota token",
    qualities: "ChấtSố liệu?g",
    subscribers: "Người dùng",

    // Usage
    usage_title: "Phần tích Usage",
    usage_subtitle: "Phân tích AI calls, revenue / upstream cost / margin theo plugin.",
    time_range: "Khoảng thời gian",
    days: "ngày",
    total_calls: "Tổng calls",
    pi_tokens_spent: "Pi tokens dùng",
    revenue_est: "Doanh thu (ước)",
    upstream_cost: "Chi phí upstream",
    margin: "Margin",
    avg_latency: "?? trung bình",
    daily_traffic: "Traffic theo ngày",
    success: "Thành công",
    failed: "Thất bại",
    breakdown_by_plugin: "Phần b? theo plugin",
    share: "T? tr?ng",

    // Revenue
    revenue_title: "Doanh thu",
    revenue_subtitle: "MRR / ARR / LTV / churn + invoices.",
    mrr: "MRR",
    arr: "ARR",
    ltv: "LTV",
    churn_rate: "T? l? churn",
    revenue_by_month: "Doanh thu theo tháng",
    revenue_by_package: "Doanh thu theo gói",
    failed_payments: "Thanh toán l?",
    invoices: "Hóa đơn",

    // Releases
    releases_title: "Plugin Releases",
    releases_subtitle: "Quản lý ZIP versions. Client plugin t? fetch update t? dây.",
    upload_release_btn: "Upload release",
    version: "Phiên bản",
    tier_required: "Tier",
    size: "Kích tưc",
    uploaded: "Ngày upload",
    stable: "?n d?ng",
    yanked: "R?t v?",
    mark_stable: "?nh d?u ?n d?ng",
    yank: "R?t v?",
    download: "T?i xu?ng",
    no_releases: "Chưa có release nào.",

    // Audit log
    audit_title: "Nhật k? Audit",
    audit_subtitle: "L?ch s? mới thao tác admin.",
    event_time: "Thời gian",
    actor: "Thực hiện",
    action: "Hành động",
    resource: "Tài nguyên",
    message: "Thông diệp",
    severity: "Mức độ",
    before: "Trước",
    after: "Sau",
    events: "sự kiện",
    no_events: "Chưa có sự kiện",
    no_events_desc: "Audit log s? t? c?p nh?t khi admin thao tác.",
    from_date: "T? ngày",
    to_date: "?n ngày",
    search_audit: "T?m actor / message / label?",

    // Settings
    settings_title: "Settings",
    settings_subtitle: "Cấu hình platform Pi (global).Số liệu?u trong DB ? khng c?n redeploy.",
    branding: "Thương hiệu",
    site_name: "Tên site",
    logo_url: "Logo URL",
    primary_color: "Màu chủ đạo",
    support_email: "Email h? tr?",
    save_branding: "Lưu branding",
    token_packs: "Token packs",
    feature_flags: "Feature flags",
    save_flags: "Lưu flags",
    cron_jobs: "Cron jobs",
    cron_subtitle: "Tác v? nên ch?y theo l?ch. C? th? trigger manual d? test.",
    run_now: "Ch?y ngay",
    running: "?ang ch?y?",
    job: "Job",
    schedule: "Lịch",
    never_run: "Chưa ch?y",
    security_env: "Bảo mật (env-only)",
    security_subtitle: "Các giá tr? Sau đọc t? env vars, đổi qua Railway/Docker ? khngSố liệu?u DB.",
    flag_signup: "Cho phép đăng ký account mới",
    flag_billing: "Bật top-up (Stripe checkout)",
    flag_marketplace: "Bật marketplace /catalog",
    flag_maintenance: " Maintenance mode (block /v1/ai/complete)",
  },
  en: {
    loading: "Loading",
    saving: "Saving",
    saved: "Saved",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    edit: "Edit",
    delete: "Delete",
    create: "Create",
    update: "Update",
    search: "Search",
    clear: "Clear",
    refresh: "Refresh",
    details: "Details",
    actions: "Actions",
    total: "Total",
    status: "Status",
    never: "Never",
    all: "All",
    confirm_delete: "Are you sure you want to delete?",

    page: "Page",
    of: "of",
    showing: "Showing",
    per_page: "per page",
    prev: "? Prev",
    next: "Next ?",

    joined: "Joined",
    login: "Login",
    last_run: "Last run",
    next_run: "Next run",
    duration: "Duration",

    overview_title: "System overview",
    overview_subtitle: "Real-time stats.",
    revenue_card: "Revenue",
    active_licenses: "Active licenses",
    tokens_used: "Pi Tokens used",
    system_status: "System status",
    provider_health_matrix: "Provider Health Matrix",
    key_pool_status: "Key Pool Status",
    realtime_alerts: "Real-time alerts",
    expiring_soon: "Expiring soon (next 7 days)",
    view_all: "View all",
    manage: "Manage",
    new_license: "New license",
    add_key: "Add key",
    new_user: "New user",
    upload_release: "Upload release",
    new_this_week: "new this week",
    proj_month_end: "Projected month end",

    licenses_title: "Licenses",
    licenses_subtitle: "Manage licenses + assign Cloud package + allocate keys to customers.",
    create_license: "Create license",
    license_id: "ID",
    license_key: "Key",
    customer: "Customer",
    plugin: "Plugin",
    package: "Package",
    package_quota: "Package + quota",
    sites: "Sites",
    keys: "Keys",
    expires: "Expires",
    tier: "Tier",
    revoke: "Revoke",
    reactivate: "Reactivate",
    search_license_placeholder: "Search by email / key / name?",
    filter_status: "Status",
    filter_tier: "Tier",
    filter_package: "Package",
    filter_plugin: "Plugin",
    filter_expires: "Expires",
    no_licenses: "No licenses yet",
    no_licenses_desc: "Create the first license for a customer.",
    no_match: "No match",
    no_match_desc: "Try changing filters or Clear.",
    status_active: "Active",
    status_revoked: "Revoked",
    status_expired: "Expired",
    expires_7d: "Expires in <7 days",
    expires_30d: "Expires in <30 days",
    expires_90d: "Expires in <90 days",
    expires_past: "Already expired",
    sort_newest: "Newest",
    sort_oldest: "Oldest",
    sort_expiring: "Expiring soon",
    sort_expires_far: "Expires farthest",

    users_title: "Customers & Users",
    users_subtitle: "Manage accounts and roles",
    accounts: "accounts",
    create_user_btn: "Create user",
    profile: "Profile",
    role: "Role",
    balance: "Balance",
    total_spent: "Total spent",
    signup_last_login: "Signup / Last login",
    role_admin: "ADMIN",
    role_user: "USER",
    role_banned: "BANNED",
    action_demote: "Demote",
    action_promote: "Make Admin",
    action_ban: "Ban",
    action_unban: "Unban",
    confirm_promote: "Grant Admin role to this user?",
    confirm_demote: "Demote to regular user?",
    confirm_ban: "Ban this account? All licenses will be frozen.",
    confirm_unban: "Unban this account?",
    no_users: "No customers found.",

    providers_title: "AI Providers",
    providers_subtitle: "Upstream AI router. Free tier priority, paid for quality.",
    add_provider: "Add provider",
    slug: "Slug",
    model: "Model",
    priority: "Priority",
    health: "Health",
    cost: "Cost",
    api_key_status: "API Key",
    enabled: "Enabled",
    has_key: "saved",
    no_key: "not set",
    keys_in_pool: "Keys in pool",
    test: "Test",
    available: "Available",
    allocated: "Allocated",
    healthy: "Healthy",

    keys_title: "Key Pool",
    keys_subtitle: "Manage upstream API keys. Each key is allocated to a specific customer ? never shared.",
    add_key_btn: "Add key",
    bulk_import: "Bulk import",
    reset_period: "Reset period",
    stat_total: "Total",
    stat_available: "Available",
    stat_allocated: "Allocated",
    stat_exhausted: "Exhausted",
    stat_banned: "Banned",
    label: "Label",
    owner: "Owner",
    used: "Used",
    pool_empty_title: "Pool is empty",
    pool_empty_desc: "Customers can't use Pi AI Cloud until at least 1 key is in the pool.",

    packages_title: "Subscription packages",
    packages_subtitle: "Define tier packages. Keys allocated per-customer separately in Key Pool.",
    add_package: "Add package",
    price_monthly: "Monthly price",
    price_yearly: "Yearly price",
    token_quota: "Token quota",
    qualities: "Qualities",
    subscribers: "Subscribers",

    usage_title: "Usage analytics",
    usage_subtitle: "Analyze AI calls, revenue / upstream cost / margin by plugin.",
    time_range: "Time range",
    days: "days",
    total_calls: "Total calls",
    pi_tokens_spent: "Pi tokens spent",
    revenue_est: "Revenue (estimated)",
    upstream_cost: "Upstream cost",
    margin: "Margin",
    avg_latency: "Avg latency",
    daily_traffic: "Daily traffic",
    success: "Success",
    failed: "Failed",
    breakdown_by_plugin: "Breakdown by plugin",
    share: "Share",

    revenue_title: "Revenue",
    revenue_subtitle: "MRR / ARR / LTV / churn + invoices.",
    mrr: "MRR",
    arr: "ARR",
    ltv: "LTV",
    churn_rate: "Churn rate",
    revenue_by_month: "Revenue by month",
    revenue_by_package: "Revenue by package",
    failed_payments: "Failed payments",
    invoices: "Invoices",

    releases_title: "Plugin releases",
    releases_subtitle: "Manage ZIP versions. Plugin clients auto-fetch updates.",
    upload_release_btn: "Upload release",
    version: "Version",
    tier_required: "Tier",
    size: "Size",
    uploaded: "Uploaded",
    stable: "Stable",
    yanked: "Yanked",
    mark_stable: "Mark stable",
    yank: "Yank",
    download: "Download",
    no_releases: "No releases yet.",

    audit_title: "Audit log",
    audit_subtitle: "History of all admin actions.",
    event_time: "Time",
    actor: "Actor",
    action: "Action",
    resource: "Resource",
    message: "Message",
    severity: "Severity",
    before: "Before",
    after: "After",
    events: "events",
    no_events: "No events yet",
    no_events_desc: "Audit log auto-updates as admins take actions.",
    from_date: "From",
    to_date: "To",
    search_audit: "Search actor / message / label?",

    settings_title: "Settings",
    settings_subtitle: "Global Pi platform configuration. Stored in DB ? no redeploy needed.",
    branding: "Branding",
    site_name: "Site name",
    logo_url: "Logo URL",
    primary_color: "Primary color",
    support_email: "Support email",
    save_branding: "Save branding",
    token_packs: "Token packs",
    feature_flags: "Feature flags",
    save_flags: "Save flags",
    cron_jobs: "Cron jobs",
    cron_subtitle: "Background tasks on schedule. Can manually trigger to test.",
    run_now: "Run now",
    running: "Running",
    job: "Job",
    schedule: "Schedule",
    never_run: "never run",
    security_env: "Security (env-only)",
    security_subtitle: "These values come from env vars, changed via Railway/Docker ? not stored in DB.",
    flag_signup: "Allow new account signup",
    flag_billing: "Enable top-up (Stripe checkout)",
    flag_marketplace: "Enable marketplace /catalog",
    flag_maintenance: " Maintenance mode (block /v1/ai/complete)",
  },
};

// ---------------------------------------------------------
// Hook ? get t() bound to current locale
// ---------------------------------------------------------
export function useAdminT() {
  const { locale } = useLocale();
  return ADMIN_T[locale] || ADMIN_T.vi;
}

// ---------------------------------------------------------
// Locale-aware formatters
// ---------------------------------------------------------

/** cents USD ? localized currency string. VI ? VND, EN ? USD. */
export function formatCurrency(cents, locale = "vi") {
  if (cents == null || !Number.isFinite(Number(cents))) return "?";
  const usd = Number(cents) / 100;
  if (locale === "en") {
    if (usd === 0) return "$0";
    return usd % 1 === 0 && usd >= 100 ? `$${Math.round(usd)}` : `$${usd.toFixed(2)}`;
  }
  const vnd = Math.round(usd * USD_TO_VND);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(vnd);
}

/** USD amount (dollars, not cents) ? localized currency */
export function formatCurrencyUSD(dollars, locale = "vi") {
  return formatCurrency(Math.round(dollars * 100), locale);
}

/** Integer count ? localized number with separators */
export function formatNumber(n, locale = "vi") {
  if (n == null || !Number.isFinite(Number(n))) return "?";
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(Number(n));
}

/** Token count with K/M/B suffix */
export function formatTokens(n) {
  if (n == null || !Number.isFinite(Number(n))) return "?";
  const x = Number(n);
  if (x === 0) return "0";
  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (x >= 1_000) return (x / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return x.toString();
}

/** ISO date ? short locale date (e.g. "18/4/2026" vi / "4/18/2026" en) */
export function formatDate(iso, locale = "vi") {
  if (!iso) return "?";
  const d = new Date(iso);
  if (isNaN(d)) return "?";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN");
}

/** ISO ? relative ("3p tru?c" vi / "3m ago" en) */
export function formatRelative(iso, locale = "vi") {
  if (!iso) return "?";
  const d = new Date(iso);
  if (isNaN(d)) return "?";
  const diffMs = new Date() - d;
  const past = diffMs >= 0;
  const abs = Math.abs(diffMs);
  const min = Math.floor(abs / 60_000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (locale === "en") {
    const sfx = past ? "ago" : "from now";
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ${sfx}`;
    if (hr < 24) return `${hr}h ${sfx}`;
    if (day < 30) return `${day}d ${sfx}`;
    return d.toLocaleDateString("en-US");
  }
  const sfx = past ? "tru?c" : "n?a";
  if (min < 1) return "v?a xong";
  if (min < 60) return `${min}p ${sfx}`;
  if (hr < 24) return `${hr}h ${sfx}`;
  if (day < 30) return `${day} ng?y ${sfx}`;
  return d.toLocaleDateString("vi-VN");
}

/** DateTime full */
export function formatDateTime(iso, locale = "vi") {
  if (!iso) return "?";
  const d = new Date(iso);
  if (isNaN(d)) return "?";
  return d.toLocaleString(locale === "en" ? "en-US" : "vi-VN");
}
