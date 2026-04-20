import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messages } from "../i18n/messages";

const STORAGE_KEY = "pi-store-locale";

const LocaleContext = createContext(null);

function getInitialLocale() {
  if (typeof window === "undefined") return "vi";
  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (cached === "vi" || cached === "en") return cached;
  return "vi";
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLocale);

  const switchLocale = (nextLocale) => {
    if (nextLocale !== "vi" && nextLocale !== "en") return;
    setLocale(nextLocale);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(() => {
    const dict = messages[locale] ?? messages.vi;
    return {
      locale,
      dict,
      switchLocale,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
}
