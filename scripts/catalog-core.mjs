import path from "node:path";

const CONTACT_FALLBACK = "https://thietkethicongnhadep.vn/lien-he/";
const MOJIBAKE_PATTERNS = [/Ã./u, /Ä./u, /Æ./u, /â€./u, /áº./u, /á»./u, /Â./u, /VN\?/u];

function safeString(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function safeNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const digits = value.replace(/\D/g, "");
    if (digits) return Number(digits);
  }
  return null;
}

function toArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim().length > 0) : [];
}

function toFaqArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item) => ({
      q: safeString(item.q),
      a: safeString(item.a),
    }))
    .filter((item) => item.q && item.a);
}

function mergeLocaleObject(baseObj, overrideObj) {
  if (!overrideObj || typeof overrideObj !== "object") return baseObj;
  return {
    vi: {
      ...(baseObj.vi ?? {}),
      ...(overrideObj.vi ?? {}),
    },
    en: {
      ...(baseObj.en ?? {}),
      ...(overrideObj.en ?? {}),
    },
  };
}

function mergeLocaleArray(baseObj, overrideObj) {
  return {
    vi: toArray(overrideObj?.vi ?? baseObj?.vi ?? []),
    en: toArray(overrideObj?.en ?? baseObj?.en ?? []),
  };
}

function mergeLocaleFaq(baseObj, overrideObj) {
  return {
    vi: toFaqArray(overrideObj?.vi ?? baseObj?.vi ?? []),
    en: toFaqArray(overrideObj?.en ?? baseObj?.en ?? []),
  };
}

function calculateSavingsPct(monthly, yearly) {
  if (!Number.isFinite(monthly) || !Number.isFinite(yearly) || monthly <= 0 || yearly <= 0) {
    return null;
  }
  const fullYear = monthly * 12;
  if (fullYear <= 0 || yearly >= fullYear) return 0;
  return Math.round(((fullYear - yearly) / fullYear) * 100);
}

function normalizePricingOverride(value) {
  const currency = safeString(value?.currency, "VND");
  const monthlyAmount = safeNumber(value?.monthly);
  const yearlyAmount = safeNumber(value?.yearly);

  return {
    currency,
    monthly: {
      amount: monthlyAmount,
    },
    yearly: {
      amount: yearlyAmount,
      savingsPct: calculateSavingsPct(monthlyAmount, yearlyAmount),
    },
  };
}

export function parseWpHeader(content, label) {
  if (!content || !label) return "";
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^\\s*\\*?\\s*${escaped}\\s*:\\s*(.+)$`, "im");
  const match = content.match(regex);
  return match?.[1]?.trim() ?? "";
}

export function containsMojibake(value) {
  if (typeof value !== "string") return false;
  return MOJIBAKE_PATTERNS.some((pattern) => pattern.test(value));
}

export function collectMojibakeIssues(value, currentPath = "root") {
  const issues = [];

  if (typeof value === "string") {
    if (containsMojibake(value)) {
      issues.push({ path: currentPath, value });
    }
    return issues;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      issues.push(...collectMojibakeIssues(item, `${currentPath}[${index}]`));
    });
    return issues;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      issues.push(...collectMojibakeIssues(item, `${currentPath}.${key}`));
    });
  }

  return issues;
}

export function isValidCtaUrl(value) {
  const candidate = safeString(value);
  if (!candidate || candidate === "#") return false;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getVisibleCtaIssues(product) {
  const issues = [];
  if (product.cta?.showDemo === true && !isValidCtaUrl(product.cta?.demoUrl)) {
    issues.push("demoUrl");
  }
  if (product.cta?.showDocs === true && !isValidCtaUrl(product.cta?.docsUrl)) {
    issues.push("docsUrl");
  }
  if (product.cta?.showContact === true && !isValidCtaUrl(product.cta?.contactUrl)) {
    issues.push("contactUrl");
  }
  return issues;
}

export function normalizeScannedProduct(input, type) {
  const slug = safeString(input.slug);
  const name = safeString(input.name, slug);
  const description = safeString(input.description, "Sản phẩm WordPress production-ready.");
  const version = safeString(input.version, "1.0.0");
  const author = safeString(input.author, "PI Ecosystem");
  const normalizedType = type === "theme" ? "theme" : "plugin";

  return {
    id: slug,
    slug,
    type: normalizedType,
    version,
    author,
    status: "ready",
    featured: false,
    sortOrder: 999,
    pricing: normalizePricingOverride({ currency: "VND", monthly: null, yearly: null }),
    cta: {
      demoUrl: "",
      docsUrl: "",
      contactUrl: CONTACT_FALLBACK,
    },
    media: {
      cover: `/media/products/${slug}.svg`,
      og: "/og-default.webp",
    },
    copy: {
      vi: {
        name,
        tagline: normalizedType === "plugin" ? "Plugin WordPress chuyên dụng" : "Theme WordPress chuyên dụng",
        description,
      },
      en: {
        name,
        tagline: normalizedType === "plugin" ? "Specialized WordPress plugin" : "Specialized WordPress theme",
        description,
      },
    },
    features: {
      vi: [],
      en: [],
    },
    useCases: {
      vi: [],
      en: [],
    },
    faq: {
      vi: [],
      en: [],
    },
  };
}

export function mergeProductWithOverride(baseProduct, override) {
  if (!override || typeof override !== "object") return baseProduct;

  const merged = {
    ...baseProduct,
    status: safeString(override.status, baseProduct.status),
    featured: typeof override.featured === "boolean" ? override.featured : baseProduct.featured,
    sortOrder:
      Number.isFinite(override.sortOrder) || typeof override.sortOrder === "number"
        ? Number(override.sortOrder)
        : baseProduct.sortOrder,
    pricing: normalizePricingOverride(override.pricing ?? baseProduct.pricing),
    cta: {
      ...baseProduct.cta,
      ...(override.cta ?? {}),
    },
    media: {
      ...baseProduct.media,
      ...(override.media ?? {}),
    },
    copy: mergeLocaleObject(baseProduct.copy, override.copy),
    features: mergeLocaleArray(baseProduct.features, override.features),
    useCases: mergeLocaleArray(baseProduct.useCases, override.useCases),
    faq: mergeLocaleFaq(baseProduct.faq, override.faq),
  };

  const fallbackCover = `/media/products/${baseProduct.slug}.svg`;
  merged.media.cover = safeString(merged.media.cover, fallbackCover);
  merged.media.og = safeString(merged.media.og, "/og-default.webp");
  merged.cta.contactUrl = safeString(merged.cta.contactUrl, CONTACT_FALLBACK);
  merged.cta.demoUrl = safeString(merged.cta.demoUrl, "");
  merged.cta.docsUrl = safeString(merged.cta.docsUrl, "");

  merged.copy.vi.name = safeString(merged.copy.vi.name, baseProduct.copy.vi.name);
  merged.copy.en.name = safeString(merged.copy.en.name, merged.copy.vi.name);
  merged.copy.vi.tagline = safeString(merged.copy.vi.tagline, baseProduct.copy.vi.tagline);
  merged.copy.en.tagline = safeString(merged.copy.en.tagline, merged.copy.vi.tagline);
  merged.copy.vi.description = safeString(merged.copy.vi.description, baseProduct.copy.vi.description);
  merged.copy.en.description = safeString(merged.copy.en.description, merged.copy.vi.description);

  return merged;
}

export function sortProducts(products) {
  return [...products].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
    if (orderDiff !== 0) return orderDiff;
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDiff !== 0) return featuredDiff;
    if (a.type !== b.type) return a.type === "plugin" ? -1 : 1;
    return a.copy.vi.name.localeCompare(b.copy.vi.name, "vi");
  });
}

export function buildSitemapXml(baseUrl, slugs) {
  const normalizedBase = String(baseUrl || "").replace(/\/+$/, "");
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ["/", ...slugs.map((slug) => `/product/${slug}`)];

  const body = urls
    .map((urlPath) => {
      const loc = `${normalizedBase}${urlPath}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        urlPath === "/" ? "    <priority>1.0</priority>" : "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}

export function resolveProjectPaths(projectRoot) {
  return {
    overridesPath: path.join(projectRoot, "data", "product-overrides.json"),
    catalogOutputPath: path.join(projectRoot, "src", "data", "catalog.generated.json"),
    publicCatalogPath: path.join(projectRoot, "public", "catalog.json"),
    sitemapPath: path.join(projectRoot, "public", "sitemap.xml"),
    robotsPath: path.join(projectRoot, "public", "robots.txt"),
  };
}
