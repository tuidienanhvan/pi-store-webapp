import { Link } from "react-router-dom";
import { useLocale } from "@/_shared/context/LocaleContext";
import { DocsHero } from "./components/DocsHero";
import { DocsGrid } from "./components/DocsGrid";

export function DocsPage() {
  const { dict } = useLocale();
  const sections = dict.docs.sections;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-8" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)" }}>
      <DocsHero />
      <DocsGrid sections={sections} />
    </div>
  );
}

export default DocsPage;
