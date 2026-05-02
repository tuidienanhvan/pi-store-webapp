import { useLocale } from "../context/LocaleContext";
import "./ProofStrip.css";

export function ProofStrip({ stats }) {
  const { dict } = useLocale();

  return (
    <section className="proof-strip" aria-label={dict.hero.proofLabel}>
      <article>
        <span>{dict.hero.metrics.products}</span>
        <strong>{stats.products}</strong>
      </article>
      <article>
        <span>{dict.hero.metrics.plugins}</span>
        <strong>{stats.plugins}</strong>
      </article>
      <article>
        <span>{dict.hero.metrics.themes}</span>
        <strong>{stats.themes}</strong>
      </article>
      <article>
        <span>{dict.hero.metrics.featured}</span>
        <strong>{stats.featured}</strong>
      </article>
    </section>
  );
}
