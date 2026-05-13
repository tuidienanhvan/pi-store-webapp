import { Link } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { SeoMeta } from "@/components/core/SeoMeta";



export function NotFoundPage({ siteUrl }) {
  const { dict, locale } = useLocale();
  const t = dict.notFound || {}; // Prevent error if not found

  return (
    <section className="not-found-page">
      <SeoMeta
        title="404 | PI Ecosystem Store"
        description="Page not found"
        locale={locale}
        siteUrl={siteUrl}
        pathname="/404"
      />
      <h1>{t.title || '404'}</h1>
      <p>{t.description || 'Page not found.'}</p>
      <Link className="btn btn-primary" to="/">
        {t.back || 'Go to homepage'}
      </Link>
    </section>
  );
}


export default NotFoundPage;
