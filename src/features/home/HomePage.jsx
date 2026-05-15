import './HomePage.css';
import React from "react";
import catalog from "../../_shared/data/catalog.generated.json";
import { useLocale } from "@/_shared/context/LocaleContext";
import { HomeHero } from "./components/HomeHero";
import { HomeBento } from "./components/HomeBento";
import { ProductOfferings } from "./components/ProductOfferings";
import { HomeFeatured } from "./components/HomeFeatured";
import { HomeCTA } from "./components/HomeCTA";

export function HomePage() {
  const { dict } = useLocale();
  const products = catalog?.products ?? [];
  const t = dict;

  return (
    <div className="stack gap-24 pb-32">
      <HomeHero t={t} />
      <HomeBento t={t} />
      <ProductOfferings products={products} />
      <HomeCTA t={t} />
    </div>
  );
}

export default HomePage;
