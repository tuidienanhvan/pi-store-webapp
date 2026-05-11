import { useLocale } from "@/context/LocaleContext";



export function LanguageToggle() {

  const { locale, switchLocale } = useLocale();



  return (

    <div style={{ display: "flex", background: "var(--base-300)", borderRadius: "var(--r-pill)", padding: "2px" }} role="group" aria-label="Language selector">

      <button

        type="button"

        onClick={() => switchLocale("vi")}

        aria-pressed={locale === "vi"}

        style={{

          border: "none", background: locale === "vi" ? "var(--base-200)" : "transparent",

          color: locale === "vi" ? "var(--base-content)" : "color-mix(in srgb, var(--base-content) 80%, transparent)",

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

          border: "none", background: locale === "en" ? "var(--base-200)" : "transparent",

          color: locale === "en" ? "var(--base-content)" : "color-mix(in srgb, var(--base-content) 80%, transparent)",

          padding: "2px 8px", fontSize: "12px", fontWeight: "600", borderRadius: "var(--r-pill)",

          cursor: "pointer", transition: "all var(--t-fast)"

        }}

      >

        EN

      </button>

    </div>

  );

}

