const BILLING_COPY = {
  vi: {
    monthly: "/tháng",
    yearly: "/năm",
    contact: "Liên hệ",
  },
  en: {
    monthly: "/month",
    yearly: "/year",
    contact: "Contact",
  },
};

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function isValidCtaUrl(value) {
  const candidate = String(value ?? "").trim();
  if (!candidate || candidate === "#") return false;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getLocaleCopy(locale) {
  return BILLING_COPY[locale] ?? BILLING_COPY.vi;
}

function formatCurrency(amount, locale, currency = "VND") {
  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function resolvePricing(pricing, locale, billingCycle = "monthly") {
  const localeCopy = getLocaleCopy(locale);
  const cycle = billingCycle === "yearly" ? "yearly" : "monthly";
  const amount = pricing?.[cycle]?.amount ?? null;
  const currency = pricing?.currency ?? "VND";
  const savingsPct = pricing?.yearly?.savingsPct ?? null;

  if (!Number.isFinite(amount)) {
    return {
      amount: null,
      currency,
      label: localeCopy.contact,
      billing: "",
      cycle,
      savingsPct,
    };
  }

  return {
    amount,
    currency,
    label: formatCurrency(amount, locale, currency),
    billing: localeCopy[cycle],
    cycle,
    savingsPct,
  };
}

export function getLocalizedProduct(product, locale, billingCycle = "monthly") {
  const localCopy = product.copy?.[locale] ?? product.copy?.vi ?? {};
  const localFeatures = product.features?.[locale] ?? product.features?.vi ?? [];
  const localUseCases = product.useCases?.[locale] ?? product.useCases?.vi ?? [];
  const localFaq = product.faq?.[locale] ?? product.faq?.vi ?? [];
  const localizedPricing = resolvePricing(product.pricing, locale, billingCycle);

  return {
    ...product,
    localizedName: localCopy.name ?? product.slug,
    localizedTagline: localCopy.tagline ?? "",
    localizedDescription: localCopy.description ?? "",
    localizedFeatures: localFeatures,
    localizedUseCases: localUseCases,
    localizedFaq: localFaq,
    localizedPricing,
    hasDemoCta: isValidCtaUrl(product.cta?.demoUrl),
    hasDocsCta: isValidCtaUrl(product.cta?.docsUrl),
    hasContactCta: isValidCtaUrl(product.cta?.contactUrl),
  };
}

export function filterProducts(products, { locale, filterType, query, billingCycle = "monthly" }) {
  const term = normalizeSearchText(query);

  return products.filter((product) => {
    const typeMatched = filterType === "all" ? true : product.type === filterType;
    if (!typeMatched) return false;

    if (!term) return true;

    const localized = getLocalizedProduct(product, locale, billingCycle);
    const haystack = [
      localized.localizedName,
      localized.localizedTagline,
      localized.localizedDescription,
      ...(localized.localizedFeatures ?? []),
      ...(localized.localizedUseCases ?? []),
      product.type,
      product.slug,
    ]
      .map((item) => normalizeSearchText(item))
      .join(" ");

    return haystack.includes(term);
  });
}

export function getCatalogStats(products) {
  return {
    products: products.length,
    plugins: products.filter((item) => item.type === "plugin").length,
    themes: products.filter((item) => item.type === "theme").length,
    featured: products.filter((item) => item.featured).length,
  };
}

export function findProductBySlug(products, slug) {
  return products.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedProduct(products) {
  return products.find((item) => item.featured) ?? products[0] ?? null;
}

export function buildCatalogStructuredData({ baseUrl, locale }) {
  const inLanguage = locale === "vi" ? "vi-VN" : "en-US";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PI Ecosystem",
      url: baseUrl,
      logo: `${baseUrl}/logo-optimized.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PI Ecosystem Store",
      url: baseUrl,
      inLanguage,
    },
  ];
}

export function buildProductStructuredData({ product, baseUrl, locale, billingCycle }) {
  const view = getLocalizedProduct(product, locale, billingCycle);
  const url = `${baseUrl}/product/${product.slug}`;
  const offer =
    Number.isFinite(view.localizedPricing.amount) && view.localizedPricing.currency
      ? {
          "@type": "Offer",
          priceCurrency: view.localizedPricing.currency,
          price: String(view.localizedPricing.amount),
          url,
          availability: "https://schema.org/InStock",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: view.localizedName,
    description: view.localizedDescription,
    image: [`${baseUrl}${view.media.cover}`],
    category: product.type,
    brand: {
      "@type": "Brand",
      name: "PI Ecosystem",
    },
    offers: offer,
  };
}
