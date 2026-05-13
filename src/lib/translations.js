/**
 * translations.js - Unified Admin i18n
 */
import { useLocale } from "../context/LocaleContext";

const USD_TO_VND = 25_000;

export const ADMIN_T = {
  vi: {
    loading: "Đang tải",
    overview_title: "Tổng quan hệ thống",
    overview_subtitle: "Số liệu real-time.",
    revenue_card: "Doanh thu",
    active_licenses: "Licenses active",
    tokens_used: "Pi Tokens dùng",
    system_status: "Trạng thái hệ thống",
    provider_health_matrix: "Provider Health Matrix",
    key_pool_status: "Key Pool Status",
    realtime_alerts: "Cảnh báo real-time",
    expiring_soon: "Sắp hết hạn (7 ngày tới)",
    view_all: "Xem tất cả",
    manage: "Quản lý",
    new_license: "License mới",
    add_key: "Thêm key",
    new_user: "User mới",
    upload_release: "Upload release",
    new_this_week: "mới tuần này",
    proj_month_end: "Dự kiến cuối tháng",
  },
  en: {
    loading: "Loading",
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
  }
};

export function useAdminT() {
  const { locale } = useLocale();
  return ADMIN_T[locale] || ADMIN_T.vi;
}

export function formatCurrency(cents, locale = "vi") {
  if (cents == null) return "?";
  const usd = cents / 100;
  if (locale === "en") return `$${usd.toFixed(2)}`;
  const vnd = Math.round(usd * USD_TO_VND);
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(vnd);
}

export function formatCurrencyUSD(dollars, locale = "vi") {
  return formatCurrency(Math.round(dollars * 100), locale);
}

export function formatNumber(n, locale = "vi") {
  if (n == null) return "?";
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(n);
}

export function formatTokens(n) {
  if (n == null) return "?";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function formatDate(iso, locale = "vi") {
  if (!iso) return "?";
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN");
}

export function formatRelative(iso, locale = "vi") {
  return iso ? "just now" : "?";
}

export function formatDateTime(iso, locale = "vi") {
  if (!iso) return "?";
  return new Date(iso).toLocaleString(locale === "en" ? "en-US" : "vi-VN");
}
