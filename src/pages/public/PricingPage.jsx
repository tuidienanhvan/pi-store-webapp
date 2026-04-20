import { useEffect, useState } from "react";
import { api } from "../../lib/api-client";
import catalog from "../../data/catalog.generated.json";
import { useLocale } from "../../context/LocaleContext";
import { Alert } from "../../components/ui";

import { PricingHero } from "../../components/pricing/PricingHero";
import { PricingGrid } from "../../components/pricing/PricingGrid";
import { PricingBundles } from "../../components/pricing/PricingBundles";
import { PricingFAQ } from "../../components/pricing/PricingFAQ";
import { PricingCTA } from "../../components/pricing/PricingCTA";

export function PricingPage() {
  const { locale, dict } = useLocale();
  const products = catalog?.products || [];
  const [packages, setPackages] = useState([]);
  const [billing, setBilling] = useState("monthly"); // monthly | yearly
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const t = dict.home; // Shared home/pricing translations could be used or expanded

  useEffect(() => {
    api.public.packages()
      .then((r) => setPackages(r.items || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const bundles = products
    .filter((p) => p.slug.startsWith("bundle-"))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="stack gap-0">
      <PricingHero billing={billing} setBilling={setBilling} />
      
      {err && (
        <div className="container pb-8">
          <Alert tone="danger">Không load được packages: {err}</Alert>
        </div>
      )}

      <PricingGrid 
        packages={packages} 
        billing={billing} 
        loading={loading} 
      />

      <PricingBundles bundles={bundles} locale={locale} />
      
      <PricingFAQ />
      
      <PricingCTA />
    </div>
  );
}
