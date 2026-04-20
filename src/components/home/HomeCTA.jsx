import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";

export function HomeCTA({ t }) {
  return (
    <section className="container pt-16 animate-in" style={{ animationDelay: "1000ms" }}>
      <div className="relative p-16 rounded-[2rem] overflow-hidden stack items-center text-center shadow-4">
        <div className="absolute inset-0 bg-brand" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.2)_0%,transparent_50%)]" />
        
        <div className="relative z-10 stack gap-6 items-center">
          <h2 className="text-48 m-0 text-white font-bold">{t.cta.title}</h2>
          <p className="text-20 text-white/80 m-0 max-w-xl font-medium leading-relaxed">
            {t.cta.description}
          </p>
          <div className="row gap-6 mt-8">
            <Button as={Link} to="/pricing" className="py-6 px-10 bg-white text-brand border-none hover:bg-surface-1 font-bold text-18 shadow-lg">
              {t.cta.primary}
            </Button>
            <Button as={Link} to="/pricing" variant="outline" className="py-6 px-10 text-white border-white/40 hover:border-white font-bold text-18 glass">
              {t.cta.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
