import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectMojibakeIssues,
  getVisibleCtaIssues,
  mergeProductWithOverride,
  normalizeScannedProduct,
  parseWpHeader,
  buildSitemapXml,
  resolveProjectPaths,
  sortProducts,
} from "./catalog-core.mjs";

const scriptFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(scriptFile);
const projectRoot = path.resolve(scriptsDir, "..");

const wpContentRoot = process.env.WP_CONTENT_DIR
  ? path.resolve(process.env.WP_CONTENT_DIR)
  : path.resolve(projectRoot, "..");
const pluginsRoot = process.env.WP_PLUGINS_DIR
  ? path.resolve(process.env.WP_PLUGINS_DIR)
  : path.join(wpContentRoot, "plugins");
const themesRoot = process.env.WP_THEMES_DIR
  ? path.resolve(process.env.WP_THEMES_DIR)
  : path.join(wpContentRoot, "themes");
const themeSlug = process.env.STORE_THEME_SLUG || "saigonhouse-theme";

const paths = resolveProjectPaths(projectRoot);

function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function safeReadJson(filePath, fallback) {
  if (!fileExists(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function scanPlugins() {
  if (!fileExists(pluginsRoot)) return [];
  const entries = fs.readdirSync(pluginsRoot, { withFileTypes: true });
  const pluginDirs = entries.filter((entry) => entry.isDirectory() && entry.name.startsWith("pi-"));
  const scanned = [];

  for (const entry of pluginDirs) {
    const slug = entry.name;
    const pluginDir = path.join(pluginsRoot, slug);
    let pluginMainFile = path.join(pluginDir, `${slug}.php`);

    if (!fileExists(pluginMainFile)) {
      const phpFiles = fs
        .readdirSync(pluginDir, { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.endsWith(".php"))
        .map((file) => path.join(pluginDir, file.name));
      pluginMainFile = phpFiles[0];
    }

    if (!pluginMainFile || !fileExists(pluginMainFile)) continue;

    const content = readTextFile(pluginMainFile);
    const name = parseWpHeader(content, "Plugin Name");
    if (!name) continue;

    const product = {
      slug,
      name,
      description: parseWpHeader(content, "Description"),
      version: parseWpHeader(content, "Version"),
      author: parseWpHeader(content, "Author"),
    };
    scanned.push(normalizeScannedProduct(product, "plugin"));
  }

  return scanned;
}

function scanTheme() {
  const stylePath = path.join(themesRoot, themeSlug, "style.css");
  if (!fileExists(stylePath)) return null;

  const content = readTextFile(stylePath);
  const name = parseWpHeader(content, "Theme Name");
  if (!name) return null;

  return normalizeScannedProduct(
    {
      slug: themeSlug,
      name,
      description: parseWpHeader(content, "Description"),
      version: parseWpHeader(content, "Version"),
      author: parseWpHeader(content, "Author"),
    },
    "theme",
  );
}

function ensureDirectories() {
  fs.mkdirSync(path.dirname(paths.catalogOutputPath), { recursive: true });
  fs.mkdirSync(path.dirname(paths.publicCatalogPath), { recursive: true });
  fs.mkdirSync(path.dirname(paths.sitemapPath), { recursive: true });
  fs.mkdirSync(path.dirname(paths.robotsPath), { recursive: true });
}

function assertProductHasRequiredFields(product) {
  const requiredStrings = [
    ["id", product.id],
    ["slug", product.slug],
    ["type", product.type],
    ["version", product.version],
    ["status", product.status],
    ["copy.vi.name", product.copy?.vi?.name],
    ["copy.vi.tagline", product.copy?.vi?.tagline],
    ["copy.vi.description", product.copy?.vi?.description],
    ["copy.en.name", product.copy?.en?.name],
    ["copy.en.tagline", product.copy?.en?.tagline],
    ["copy.en.description", product.copy?.en?.description],
  ];

  requiredStrings.forEach(([label, value]) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`[sync:catalog] Missing required field "${label}" on ${product.slug || "unknown-product"}.`);
    }
  });

  if (!product.pricing || typeof product.pricing !== "object") {
    throw new Error(`[sync:catalog] Missing pricing object on ${product.slug}.`);
  }

  if (typeof product.pricing.currency !== "string" || product.pricing.currency.trim().length === 0) {
    throw new Error(`[sync:catalog] Missing pricing currency on ${product.slug}.`);
  }

  if (!product.pricing.monthly || !product.pricing.yearly) {
    throw new Error(`[sync:catalog] Missing monthly/yearly pricing blocks on ${product.slug}.`);
  }
}

function validateMedia(product) {
  const coverPath = safeStringPath(product.media?.cover);
  const ogPath = safeStringPath(product.media?.og);
  const coverFile = path.join(projectRoot, "public", coverPath);
  const ogFile = path.join(projectRoot, "public", ogPath);

  if (!coverPath || !fileExists(coverFile)) {
    throw new Error(`[sync:catalog] Missing cover media for ${product.slug}: ${product.media?.cover || "(empty)"}`);
  }

  if (!ogPath || !fileExists(ogFile)) {
    return {
      ...product,
      media: {
        ...product.media,
        og: "/og-default.webp",
      },
    };
  }

  return product;
}

function safeStringPath(value) {
  return String(value || "")
    .trim()
    .replace(/^\/+/, "");
}

function validateProducts(products) {
  const seen = new Set();

  products.forEach((product) => {
    assertProductHasRequiredFields(product);

    if (seen.has(product.slug)) {
      throw new Error(`[sync:catalog] Duplicate slug found: ${product.slug}`);
    }
    seen.add(product.slug);

    const mojibakeIssues = collectMojibakeIssues(product);
    if (mojibakeIssues.length > 0) {
      const first = mojibakeIssues[0];
      throw new Error(`[sync:catalog] Mojibake detected at ${first.path}: ${first.value}`);
    }

    const ctaIssues = getVisibleCtaIssues(product);
    if (ctaIssues.length > 0) {
      throw new Error(`[sync:catalog] Invalid visible CTA on ${product.slug}: ${ctaIssues.join(", ")}`);
    }
  });
}

function main() {
  const overrides = safeReadJson(paths.overridesPath, { baseUrl: "", products: {} });
  const overrideProducts = overrides?.products ?? {};

  const scannedPlugins = scanPlugins();
  const scannedTheme = scanTheme();
  const scanned = scannedTheme ? [...scannedPlugins, scannedTheme] : scannedPlugins;

  const merged = sortProducts(scanned.map((item) => mergeProductWithOverride(item, overrideProducts[item.slug] ?? null)));
  const validated = merged.map((item) => validateMedia(item));

  validateProducts(validated);

  const baseUrl = (overrides?.baseUrl || process.env.STORE_BASE_URL || "https://store.pi-ecosystem.com").replace(
    /\/+$/,
    "",
  );

  const catalog = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    source: {
      wpContentRoot,
      pluginsRoot,
      themesRoot,
      themeSlug,
    },
    totals: {
      products: validated.length,
      plugins: validated.filter((item) => item.type === "plugin").length,
      themes: validated.filter((item) => item.type === "theme").length,
      featured: validated.filter((item) => item.featured).length,
    },
    products: validated,
  };

  ensureDirectories();
  fs.writeFileSync(paths.catalogOutputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  fs.writeFileSync(paths.publicCatalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  const sitemapXml = buildSitemapXml(
    baseUrl,
    validated.map((item) => item.slug),
  );
  fs.writeFileSync(paths.sitemapPath, sitemapXml, "utf8");

  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${baseUrl}/sitemap.xml`, ``].join("\n");
  fs.writeFileSync(paths.robotsPath, robots, "utf8");

  console.log(
    `[sync:catalog] ${validated.length} products generated (${catalog.totals.plugins} plugins, ${catalog.totals.themes} themes).`,
  );
}

main();
