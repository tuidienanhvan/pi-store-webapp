import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import "./CommerceShortcuts.css";

const SHORTCUTS = {
  vi: [
    { slug: "pi-seo", title: "SEO & Nội dung", hint: "Tối ưu onsite và schema" },
    { slug: "pi-chatbot", title: "Chatbot & Lead", hint: "Tư vấn tự động, thu lead" },
    { slug: "pi-ai-provider", title: "AI Provider", hint: "Kết nối nhiều mô hình AI" },
    { slug: "pi-performance", title: "Tăng tốc Website", hint: "Cache, WebP, Core Web Vitals" },
    { slug: "pi-dashboard", title: "Admin Dashboard", hint: "Quản trị tập trung cho WordPress" },
    { slug: "saigonhouse-theme", title: "Theme Dịch Vụ", hint: "Theme production-ready bán hàng" },
  ],
  en: [
    { slug: "pi-seo", title: "SEO & Content", hint: "Onsite optimization and schema" },
    { slug: "pi-chatbot", title: "Chatbot & Leads", hint: "Automated consulting and lead capture" },
    { slug: "pi-ai-provider", title: "AI Provider", hint: "Connect multiple AI models" },
    { slug: "pi-performance", title: "Performance", hint: "Cache, WebP, Core Web Vitals" },
    { slug: "pi-dashboard", title: "Admin Dashboard", hint: "Centralized WordPress operations" },
    { slug: "saigonhouse-theme", title: "Service Theme", hint: "Production-ready selling theme" },
  ],
};

export function CommerceShortcuts({ products, detailSearch = "" }) {
  const { locale } = useLocale();
  const shortcuts = SHORTCUTS[locale] ?? SHORTCUTS.vi;
  const productSlugs = new Set(products.map((product) => product.slug));

  return (
    <section className="shortcut-grid" aria-label={locale === "vi" ? "Nhóm sản phẩm nhanh" : "Quick product groups"}>
      {shortcuts
        .filter((item) => productSlugs.has(item.slug))
        .map((item) => (
          <Link key={item.slug} to={`/product/${item.slug}${detailSearch}`} className="shortcut-card">
            <strong>{item.title}</strong>
            <span>{item.hint}</span>
          </Link>
        ))}
    </section>
  );
}
