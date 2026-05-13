/**

 * Number / currency / time formatting ? single source of truth.

 */



// -- Tokens -------------------------------------------------

export function formatTokens(n) {

  if (n == null || !Number.isFinite(Number(n))) return "?";

  const x = Number(n);

  if (x === 0) return "0";

  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";

  if (x >= 1_000_000) return (x / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";

  if (x >= 1_000) return (x / 1_000).toFixed(1).replace(/\.0$/, "") + "K";

  return x.toLocaleString();

}



// -- Prices -------------------------------------------------

export function formatUSD(cents, { showDecimals = "auto" } = {}) {

  if (cents == null) return "?";

  const d = cents / 100;

  if (showDecimals === "never" || (showDecimals === "auto" && d % 1 === 0 && d >= 100)) {

    return `$${Math.round(d)}`;

  }

  return `$${d.toFixed(2)}`;

}



export function formatVND(amount) {

  if (!Number.isFinite(Number(amount))) return "?";

  return new Intl.NumberFormat("vi-VN", {

    style: "currency", currency: "VND", maximumFractionDigits: 0,

  }).format(Number(amount));

}



export function formatPct(n, digits = 1) {

  if (!Number.isFinite(Number(n))) return "?";

  return `${(Number(n) * 100).toFixed(digits)}%`;

}



// -- Time ---------------------------------------------------

export function formatRelative(iso, now = new Date()) {

  if (!iso) return "?";

  const then = new Date(iso);

  if (isNaN(then)) return "?";

  const diffMs = now - then;

  const abs = Math.abs(diffMs);

  const sec = Math.floor(abs / 1000);

  const min = Math.floor(sec / 60);

  const hr = Math.floor(min / 60);

  const day = Math.floor(hr / 24);

  const month = Math.floor(day / 30);

  const year = Math.floor(day / 365);

  const suffix = diffMs >= 0 ? " trước" : " nữa";

  if (sec < 45) return "vừa xong";

  if (min < 60) return `${min}p${suffix}`;

  if (hr < 24) return `${hr}h${suffix}`;

  if (day < 30) return `${day} ngày${suffix}`;

  if (month < 12) return `${month} tháng${suffix}`;

  return `${year} năm${suffix}`;

}



export function formatDateTime(iso) {

  if (!iso) return "?";

  const d = new Date(iso);

  if (isNaN(d)) return "?";

  return new Intl.DateTimeFormat("vi-VN", {

    year: "numeric", month: "2-digit", day: "2-digit",

    hour: "2-digit", minute: "2-digit",

  }).format(d);

}



export function formatDate(iso) {

  if (!iso) return "?";

  const d = new Date(iso);

  if (isNaN(d)) return "?";

  return new Intl.DateTimeFormat("vi-VN").format(d);

}



export function daysUntil(iso) {

  if (!iso) return null;

  const d = new Date(iso);

  if (isNaN(d)) return null;

  return Math.ceil((d - new Date()) / 86_400_000);

}



// -- Strings -----------------------------------------------

export function truncate(s, n = 40) {

  if (!s) return "";

  return s.length <= n ? s : s.slice(0, n - 1) + "?";

}



export function maskKey(s, prefix = 4, suffix = 4) {

  if (!s) return "";

  if (s.length <= prefix + suffix) return "?".repeat(s.length);

  return `${s.slice(0, prefix)}?${s.slice(-suffix)}`;

}



export async function copyToClipboard(text) {

  try {

    await navigator.clipboard.writeText(text);

    return true;

  } catch {

    return false;

  }

}

