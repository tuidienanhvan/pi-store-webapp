import React from "react";
import catalog from "../../data/catalog.generated.json";
import { useLocale } from "../../context/LocaleContext";
import { HomeHero } from "../../components/home/HomeHero";
import { HomeBento } from "../../components/home/HomeBento";
import { HomeFeatured } from "../../components/home/HomeFeatured";
import { HomeCTA } from "../../components/home/HomeCTA";

export function HomePage() {
  const { dict, locale } = useLocale();
  const products = catalog?.products ?? [];
  const featured = products
    .filter((p) => p.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 6);

  const t = dict.home;

  return (
    <div className="stack gap-24 pb-32">
      <HomeHero t={t} />
      <HomeBento t={t} />
      <HomeFeatured t={t} featured={featured} locale={locale} />
      <HomeCTA t={t} />
    </div>
  );
}
