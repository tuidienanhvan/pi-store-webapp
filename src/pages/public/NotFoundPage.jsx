import { Link } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { SeoMeta } from "@/components/core/SeoMeta";



export function NotFoundPage({ siteUrl }) {

  const { dict, locale } = useLocale();



  return (

    <section className="not-found-page">

      <SeoMeta

        title="404 | PI Ecosystem Store"

        description="Page not found"

        locale={locale}

        siteUrl={siteUrl}

        pathname="/404"

      />

      <h1>404</h1>

      <p>{dict.common.emptyHint}</p>

      <Link className="btn btn-primary" to="/">

        {dict.detail.back}

      </Link>

    </section>

  );

}


export default NotFoundPage;
