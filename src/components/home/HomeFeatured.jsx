import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "../ui";
import { ProductCard } from "../ProductCard";

export function HomeFeatured({ t, featured, locale }) {
  return (
    <section id="featured-products" className="container stack gap-12 pt-20 animate-in" style={{ animationDelay: "600ms" }}>
      <div className="row justify-between items-end border-b border-hairline-strong pb-8">
        <div className="stack gap-3">
          <h2 className="text-48 m-0 font-bold">{t.featured.title}</h2>
          <p className="text-18 muted m-0 font-medium">{t.featured.description}</p>
        </div>
        <Button as={Link} to="/catalog" variant="ghost" className="font-bold text-brand hover:bg-brand/5">
          {t.featured.ctaAll} <Icon name="arrow-right" size={18} className="ml-2" />
        </Button>
      </div>
      
      <div className="grid --cols-3 gap-8">
        {featured.map((p, idx) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            billingCycle="yearly"
            className="animate-in"
            style={{ animationDelay: `${700 + (idx * 100)}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
