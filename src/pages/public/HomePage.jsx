import './HomePage.css';
import React from "react";
import catalog from "@/data/catalog.generated.json";
import { useLocale } from "@/context/LocaleContext";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBento } from "@/components/home/HomeBento";
import { ProductOfferings } from "@/components/home/ProductOfferings";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeCTA } from "@/components/home/HomeCTA";

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
