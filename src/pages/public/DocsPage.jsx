import { Link } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { DocsHero } from "@/components/docs/DocsHero";

import { DocsGrid } from "@/components/docs/DocsGrid";



export function DocsPage() {

  const { dict } = useLocale();

  const sections = dict.docs.sections;



  return (

    <div className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)" }}>

      <DocsHero />

      <DocsGrid sections={sections} />

    </div>

  );

}



export function DocPlaceholderPage() {

  const { dict } = useLocale();

  const t = dict.docs;



  return (

    <div className="doc-page">

      <h1>{t.empty}</h1>

      <p>Trang ny s? c n?i dung s?m. Trong th?i gian ch?, xem:</p>

      <ul>

        <li><a href="https://github.com/piwebagency/docs" target="_blank" rel="noreferrer">Public GitHub docs repo</a></li>

        <li><Link to="/faq">FAQ</Link></li>

        <li><Link to="/contact">Lin h? support</Link></li>

      </ul>

    </div>

  );

}


export default DocsPage;
