import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSitemapXml,
  collectMojibakeIssues,
  mergeProductWithOverride,
  normalizeScannedProduct,
  parseWpHeader,
} from "../scripts/catalog-core.mjs";
import { filterProducts, getLocalizedProduct, isValidCtaUrl } from "../src/lib/catalog.js";

test("parseWpHeader reads plugin headers", () => {
  const content = `
/**
 * Plugin Name: Pi Test
 * Description: Demo plugin
 * Version: 1.2.3
 */
`;
  assert.equal(parseWpHeader(content, "Plugin Name"), "Pi Test");
  assert.equal(parseWpHeader(content, "Version"), "1.2.3");
});

test("mergeProductWithOverride normalizes numeric pricing and savings", () => {
  const base = normalizeScannedProduct(
    {
      slug: "pi-test",
      name: "Pi Test",
      description: "Original description",
      version: "1.0.0",
      author: "PI",
    },
    "plugin",
  );

  const merged = mergeProductWithOverride(base, {
    featured: true,
    pricing: {
      currency: "VND",
      monthly: 319000,
      yearly: 3192000,
    },
    copy: {
      vi: { tagline: "Plugin tiếng Việt" },
      en: { tagline: "English plugin" },
    },
  });

  assert.equal(merged.featured, true);
  assert.equal(merged.pricing.currency, "VND");
  assert.equal(merged.pricing.monthly.amount, 319000);
  assert.equal(merged.pricing.yearly.amount, 3192000);
  assert.equal(merged.pricing.yearly.savingsPct, 17);
  assert.equal(merged.copy.vi.tagline, "Plugin tiếng Việt");
  assert.equal(merged.copy.en.tagline, "English plugin");
});

test("collectMojibakeIssues flags broken encoding patterns but ignores valid Vietnamese", () => {
  const clean = collectMojibakeIssues({ copy: { vi: { tagline: "Xương sống AI đa nhà cung cấp" } } });
  const broken = collectMojibakeIssues({ copy: { vi: { tagline: "XÆ°Æ¡ng sá»‘ng AI Ä‘a nhÃ  cung cáº¥p" } } });

  assert.equal(clean.length, 0);
  assert.equal(broken.length > 0, true);
});

test("filterProducts matches Vietnamese text with and without accents", () => {
  const base = normalizeScannedProduct(
    {
      slug: "pi-seo",
      name: "Pi SEO",
      description: "Mô tả",
      version: "1.0.0",
      author: "PI",
    },
    "plugin",
  );

  const product = mergeProductWithOverride(base, {
    pricing: { currency: "VND", monthly: 239000, yearly: 2392000 },
    copy: {
      vi: {
        tagline: "Tối ưu tìm kiếm",
        description: "Giải pháp SEO có dấu tiếng Việt đầy đủ",
      },
    },
    features: {
      vi: ["Tăng tốc xếp hạng"],
    },
  });

  assert.equal(filterProducts([product], { locale: "vi", filterType: "all", query: "toi uu", billingCycle: "monthly" }).length, 1);
  assert.equal(filterProducts([product], { locale: "vi", filterType: "all", query: "tối ưu", billingCycle: "monthly" }).length, 1);
});

test("getLocalizedProduct formats pricing and hides invalid CTA urls", () => {
  const base = normalizeScannedProduct(
    {
      slug: "pi-chatbot",
      name: "Pi Chatbot",
      description: "Mô tả",
      version: "1.0.0",
      author: "PI",
    },
    "plugin",
  );

  const product = mergeProductWithOverride(base, {
    pricing: { currency: "VND", monthly: 279000, yearly: 2792000 },
    cta: {
      demoUrl: "https://example.com/demo",
      docsUrl: "#",
    },
  });

  const viView = getLocalizedProduct(product, "vi", "monthly");
  const enView = getLocalizedProduct(product, "en", "yearly");

  assert.match(viView.localizedPricing.label, /279\.000/);
  assert.equal(viView.hasDemoCta, true);
  assert.equal(viView.hasDocsCta, false);
  assert.equal(enView.localizedPricing.billing, "/year");
  assert.equal(isValidCtaUrl("https://example.com/demo"), true);
  assert.equal(isValidCtaUrl("#"), false);
});

test("buildSitemapXml includes root and product pages", () => {
  const xml = buildSitemapXml("https://store.pi-ecosystem.com", ["pi-test", "pi-seo"]);
  assert.match(xml, /https:\/\/store\.pi-ecosystem\.com\/<\/loc>/);
  assert.match(xml, /https:\/\/store\.pi-ecosystem\.com\/product\/pi-test<\/loc>/);
  assert.match(xml, /https:\/\/store\.pi-ecosystem\.com\/product\/pi-seo<\/loc>/);
});
