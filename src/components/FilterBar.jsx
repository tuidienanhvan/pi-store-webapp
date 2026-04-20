import { useLocale } from "../context/LocaleContext";
import { BillingCycleToggle } from "./BillingCycleToggle";

export function FilterBar({
  filterType,
  onFilterChange,
  query,
  onQueryChange,
  billingCycle,
  onBillingCycleChange,
}) {
  const { dict, locale } = useLocale();

  const TABS = [
    ["all",    locale === "vi" ? "Tất cả"     : "All"],
    ["tokens", locale === "vi" ? "💰 Tokens"  : "💰 Tokens"],
    ["bundle", locale === "vi" ? "📦 Bundles" : "📦 Bundles"],
    ["plugin", locale === "vi" ? "🧩 Plugins" : "🧩 Plugins"],
  ];

  return (
    <section className="filter-bar" aria-label={dict.filters.stickyHint}>
      <div className="filter-bar__tabs" role="tablist" aria-label={dict.filters.stickyHint}>
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filterType === value}
            className={filterType === value ? "tab-btn active" : "tab-btn"}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="filter-bar__search">
        <span className="sr-only">{locale === "vi" ? "Tìm kiếm sản phẩm" : "Search products"}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={dict.filters.searchPlaceholder}
          autoComplete="off"
          spellCheck="false"
        />
      </label>

      <div className="filter-bar__right">
        <BillingCycleToggle billingCycle={billingCycle} onChange={onBillingCycleChange} />
      </div>
    </section>
  );
}
