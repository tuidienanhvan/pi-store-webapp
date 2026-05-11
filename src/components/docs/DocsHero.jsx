import { useLocale } from "@/context/LocaleContext";

import { Input } from "../ui";



export function DocsHero() {

  const { dict } = useLocale();

  const t = dict.docs;



  return (

    <header className="stack" style={{ gap: "var(--s-4)", paddingTop: "var(--s-16)", maxWidth: 600 }}>

      <h1 className="text-5xl m-0">{t.title}</h1>

      <p className="text-lg muted m-0">{t.description}</p>

      <div className="stack" style={{ gap: "var(--s-2)", marginTop: "var(--s-4)" }}>

        <Input type="search" placeholder={t.searchPlaceholder} disabled />

        <span className="text-xs muted">{t.empty}</span>

      </div>

    </header>

  );

}

