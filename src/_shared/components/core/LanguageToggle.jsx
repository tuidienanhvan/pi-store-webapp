import { useLocale } from "../../context/LocaleContext";



export function LanguageToggle() {

  const { locale, switchLocale } = useLocale();



  return (

    <button
      type="button"
      onClick={() => switchLocale(locale === "vi" ? "en" : "vi")}
      className="lang-toggle-btn"
      aria-label="Switch Language"
    >
      <span className="lang-text">
        {locale === "vi" ? "VI" : "EN"}
      </span>
    </button>

  );

}

