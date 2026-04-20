import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { useCatalogParams } from "../hooks/useCatalogParams";
import { SeoMeta } from "../components/SeoMeta";
import { LeadForm } from "../components/LeadForm";
import { buildProductStructuredData, findProductBySlug, getLocalizedProduct } from "../lib/catalog";
import { useCartStore } from "../store/useCartStore";

import { ProductHero } from "../components/product/ProductHero";
import { ProductFeatures } from "../components/product/ProductFeatures";
import { ProductFAQ } from "../components/product/ProductFAQ";

export function ProductDetailPage({ products, siteUrl }) {
  const { slug } = useParams();
  const { dict, locale } = useLocale();
  const { billingCycle, setBillingCycle, search } = useCatalogParams();
  const { addItem } = useCartStore();

  const product = useMemo(() => findProductBySlug(products, slug), [products, slug]);

  if (!product) {
    return (
      <section style={{ textAlign: "center", padding: "var(--s-16) var(--s-4)" }}>
        <SeoMeta
          title="404 | PI Ecosystem Store"
          description="Product not found"
          locale={locale}
          siteUrl={siteUrl}
          pathname="/404"
        />
        <h1>404</h1>
        <p className="muted">{dict.common.empty}</p>
        <Link className="btn btn-primary" to="/">
          {dict.detail.back}
        </Link>
      </section>
    );
  }

  const view = getLocalizedProduct(product, locale, billingCycle);
  const backHref = search ? `/${search}` : "/";

  return (
    <>
      <SeoMeta
        title={`${view.localizedName} ${dict.seo.detailTitleSuffix}`}
        description={view.localizedDescription}
        image={view.media.og || view.media.cover || "/og-default.webp"}
        locale={locale}
        siteUrl={siteUrl}
        pathname={`/product/${product.slug}`}
        structuredData={buildProductStructuredData({ product, baseUrl: siteUrl, locale, billingCycle })}
      />

      <ProductHero
        view={view}
        product={product}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        addItem={addItem}
        dict={dict}
        backHref={backHref}
      />

      <ProductFeatures view={view} dict={dict} />

      <ProductFAQ view={view} dict={dict} />

      <section className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)", borderTop: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 var(--s-2)", fontSize: "var(--fs-30)" }}>Sẵn sàng để bắt đầu?</h2>
          <p className="muted" style={{ margin: "0 0 var(--s-8)" }}>Đăng ký tư vấn để nhận lộ trình triển khai chi tiết cho website của bạn.</p>
        </div>
        <LeadForm
          defaultProduct={product}
          products={products}
          sourcePage={`/product/${product.slug}`}
          billingCycle={billingCycle}
          lockedProduct
        />
      </section>

      <div style={{ textAlign: "center", paddingBottom: "var(--s-12)" }}>
        <Link className="btn btn-ghost" to={backHref}>
          {dict.detail.back}
        </Link>
      </div>
    </>
  );
}
