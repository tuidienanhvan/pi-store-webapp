import { Helmet } from "react-helmet-async";
import "./SeoMeta.css";

function toAbsoluteUrl(siteUrl, path) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${String(siteUrl || "").replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function SeoMeta({
  title,
  description,
  image = "/og-default.webp",
  locale = "vi",
  siteUrl = "https://store.pi-ecosystem.com",
  pathname = "/",
  structuredData = [],
}) {
  const ogLocale = locale === "vi" ? "vi_VN" : "en_US";
  const url = toAbsoluteUrl(siteUrl, pathname);
  const imageUrl = toAbsoluteUrl(siteUrl, image);
  const graph = Array.isArray(structuredData) ? structuredData : [structuredData];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {graph.filter(Boolean).map((item, index) => (
        <script key={`${title}-jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
