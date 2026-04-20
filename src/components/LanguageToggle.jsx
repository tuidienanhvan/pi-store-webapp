import { useLocale } from "../context/LocaleContext";

export function LanguageToggle() {
  const { locale, switchLocale } = useLocale();

  return (
    <div style={{ display: "flex", background: "var(--surface-3)", borderRadius: "var(--r-pill)", padding: "2px" }} role="group" aria-label="Language selector">
      <button
        type="button"
        onClick={() => switchLocale("vi")}
        aria-pressed={locale === "vi"}
        style={{
          border: "none", background: locale === "vi" ? "var(--surface)" : "transparent",
          color: locale === "vi" ? "var(--text-1)" : "var(--text-2)",
          padding: "2px 8px", fontSize: "12px", fontWeight: "600", borderRadius: "var(--r-pill)",
          cursor: "pointer", transition: "all var(--t-fast)"
        }}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        style={{
          border: "none", background: locale === "en" ? "var(--surface)" : "transparent",
          color: locale === "en" ? "var(--text-1)" : "var(--text-2)",
          padding: "2px 8px", fontSize: "12px", fontWeight: "600", borderRadius: "var(--r-pill)",
          cursor: "pointer", transition: "all var(--t-fast)"
        }}
      >
        EN
      </button>
    </div>
  );
}
