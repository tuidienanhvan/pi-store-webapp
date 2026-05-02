import { Link } from "react-router-dom";
import { DocsHero } from "../../components/docs/DocsHero";
import { DocsGrid } from "../../components/docs/DocsGrid";

const SECTIONS = [
  {
    title: " Getting started",
    docs: [
      { to: "/docs/install", label: "Cài đặt Pi App đầu tiên" },
      { to: "/docs/license", label: "Lấy + dán license key" },
      { to: "/docs/tokens", label: "Hiểu về Pi AI tokens" },
      { to: "/docs/bundles", label: "Chọn bundle phù hợp" },
    ],
  },
  {
    title: " Ecosystem Apps",
    docs: [
      { to: "/docs/pi-seo", label: "Pi SEO v2" },
      { to: "/docs/pi-chatbot", label: "Pi Chatbot v2" },
      { to: "/docs/pi-leads", label: "Pi Leads v2" },
      { to: "/docs/pi-analytics", label: "Pi Analytics v2" },
      { to: "/docs/pi-performance", label: "Pi Performance v2" },
      { to: "/docs/pi-dashboard", label: "Pi Dashboard v2" },
      { to: "/docs/ai-cloud", label: "Pi AI Cloud tokens" },
    ],
  },
  {
    title: " Advanced",
    docs: [
      { to: "/docs/api", label: "API reference (developers)" },
      { to: "/docs/webhooks", label: "Webhooks + integrations" },
      { to: "/docs/migration", label: "Migration từ v1 / Yoast / Rank Math" },
      { to: "/docs/self-hosted", label: "Self-hosted Pi Backend (enterprise)" },
    ],
  },
  {
    title: " Support",
    docs: [
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact support" },
      { to: "/docs/changelog", label: "Changelog" },
      { to: "/docs/status", label: "System status" },
    ],
  },
];

export function DocsPage() {
  return (
    <div className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)" }}>
      <DocsHero />
      <DocsGrid sections={SECTIONS} />
    </div>
  );
}

export function DocPlaceholderPage() {
  return (
    <div className="doc-page">
      <h1>Documentation đang xây dựng</h1>
      <p>Trang này sẽ có nội dung sớm. Trong thời gian chờ, xem:</p>
      <ul>
        <li><a href="https://github.com/piwebagency/docs" target="_blank" rel="noreferrer">Public GitHub docs repo</a></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/contact">Liên hệ support</Link></li>
      </ul>
    </div>
  );
}
