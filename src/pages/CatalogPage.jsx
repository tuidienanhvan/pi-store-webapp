import { useMemo, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { useCatalogParams } from "../hooks/useCatalogParams";
import { SeoMeta } from "../components/SeoMeta";
import { HeroSection } from "../components/HeroSection";
import { CommerceShortcuts } from "../components/CommerceShortcuts";
import { ProofStrip } from "../components/ProofStrip";
import { FilterBar } from "../components/FilterBar";
import { LeadForm } from "../components/LeadForm";
import { CatalogGrid } from "../components/catalog/CatalogGrid";

import {
  buildCatalogStructuredData,
  filterProducts,
  getCatalogStats,
  getFeaturedProduct,
} from "../lib/catalog";

const SECTION_ORDER = ["tokens", "bundle", "plugin"];

function bucketOf(product) {
  if (product.slug === "pi-ai-cloud") return "tokens";
  if (product.slug.startsWith("bundle-")) return "bundle";
  return "plugin";
}

export function CatalogPage({ products, siteUrl }) {
  const { dict, locale } = useLocale();
  const { filterType, setFilterType, query, deferredQuery, setQuery, billingCycle, setBillingCycle, search } =
    useCatalogParams();

  const stats = useMemo(() => getCatalogStats(products), [products]);
  const featured = useMemo(() => getFeaturedProduct(products), [products]);
  const [defaultLeadProduct, setDefaultLeadProduct] = useState(featured);

  const searchMatched = useMemo(
    () => filterProducts(products, { locale, filterType: "all", query: deferredQuery, billingCycle }),
    [products, locale, deferredQuery, billingCycle]
  );

  const bucketed = useMemo(() => {
    const byBucket = { tokens: [], bundle: [], plugin: [] };
    for (const p of searchMatched) {
      byBucket[bucketOf(p)].push(p);
    }
    for (const k of SECTION_ORDER) {
      byBucket[k].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    }
    return byBucket;
  }, [searchMatched]);

  const visibleSections = filterType === "all"
    ? SECTION_ORDER
    : SECTION_ORDER.includes(filterType) ? [filterType] : SECTION_ORDER;

  const totalVisible = visibleSections.reduce((sum, k) => sum + bucketed[k].length, 0);

  return (
    <>
      <SeoMeta
        title={dict.seo.catalogTitle}
        description={dict.seo.catalogDescription}
        image={featured?.media?.og || "/og-default.webp"}
        locale={locale}
        siteUrl={siteUrl}
        pathname="/"
        structuredData={buildCatalogStructuredData({ baseUrl: siteUrl, locale })}
      />

      <HeroSection featuredProduct={featured} billingCycle={billingCycle} detailSearch={search} />
      <CommerceShortcuts products={products} detailSearch={search} />
      <ProofStrip stats={stats} />

      <div className="container stack" style={{ gap: "var(--s-10)", paddingBottom: "var(--s-20)" }}>
        <div className="stack" style={{ gap: "var(--s-2)", maxWidth: 600 }}>
          <p className="form-hint" style={{ color: "var(--brand)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
            {dict.catalog.heading}
          </p>
          <h2 className="text-32">{dict.catalog.shelfTitle}</h2>
          <p className="text-18 muted">{dict.catalog.shelfHint}</p>
        </div>

        <FilterBar
          filterType={filterType}
          onFilterChange={setFilterType}
          query={query}
          onQueryChange={setQuery}
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />

        <div className="text-14 muted">
          <strong>
            {bucketed.tokens.length} tokens · {bucketed.bundle.length} bundles · {bucketed.plugin.length} plugin lẻ
          </strong>
        </div>
      </div>

      <CatalogGrid
        bucketed={bucketed}
        visibleSections={visibleSections}
        billingCycle={billingCycle}
        onConsult={setDefaultLeadProduct}
        totalVisible={totalVisible}
        dict={dict}
      />

      <section className="container" style={{ paddingTop: "var(--s-16)", borderTop: "1px solid var(--hairline)" }}>
        <LeadForm
          defaultProduct={defaultLeadProduct}
          products={products}
          sourcePage={search ? `/${search}` : "/"}
          billingCycle={billingCycle}
        />
      </section>
    </>
  );
}
