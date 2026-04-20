import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Badge, Icon } from "../ui";

export function HomeHero({ t }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Massive background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-[120px] opacity-30 pointer-events-none" 
           style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }} />
      
      <div className="container relative z-10 animate-in">
        <div className="grid --cols-2 gap-16 items-center">
          <div className="stack gap-8">
            <Badge tone="brand" className="text-14 font-bold tracking-wide uppercase px-4 py-1.5 glass w-fit">
              {t.hero.badge}
            </Badge>
            <h1 className="text-60 leading-tight m-0 font-bold" style={{ letterSpacing: "-0.03em" }}>
              {t.hero.title.split(".")[0]}.<br />
              <span className="text-brand bg-gradient-to-r from-brand to-brand-400 bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
                {t.hero.title.split(".")[1]}
              </span>
            </h1>
            <p className="text-20 muted m-0 leading-relaxed max-w-lg font-medium">
              {t.hero.description}
            </p>
            <div className="row gap-5 mt-4">
              <button onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })} 
                      className="btn btn--primary btn--lg px-8 shadow-3 cursor-pointer">
                {t.hero.ctaPrimary}
              </button>
              <Button as={Link} to="/catalog" variant="ghost" size="lg" className="font-semibold text-1">
                {t.hero.ctaSecondary} <Icon name="arrow-right" size={18} className="ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-8 mt-12 pt-8 border-t border-hairline-strong">
              <div className="stack gap-1">
                <span className="text-30 font-bold text-1">7</span>
                <span className="text-13 uppercase tracking-wider muted font-bold">{t.hero.stat1}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-30 font-bold text-1">$9</span>
                <span className="text-13 uppercase tracking-wider muted font-bold">{t.hero.stat2}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-30 font-bold text-1">85%</span>
                <span className="text-13 uppercase tracking-wider muted font-bold">{t.hero.stat3}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-30 font-bold text-1">25</span>
                <span className="text-13 uppercase tracking-wider muted font-bold">{t.hero.stat4}</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 bg-brand/10 blur-[60px] rounded-full scale-75" />
            <Card className="glass p-1 overflow-hidden relative border-brand/20 shadow-4 rounded-3xl">
              <div className="p-8 stack gap-6">
                <Badge tone="warning" className="w-fit px-3 py-1 font-bold" icon="zap">POPULAR</Badge>
                <div className="stack gap-1">
                  <h3 className="text-24 m-0 font-bold">{t.productSpotlight.title}</h3>
                  <div className="row gap-2 items-baseline">
                    <span className="text-48 font-black" style={{ letterSpacing: "-2px" }}>$9</span>
                    <span className="text-18 muted font-medium">{t.productSpotlight.priceSuffix}</span>
                  </div>
                </div>
                <ul className="stack gap-4 list-none p-0 m-0">
                  {t.productSpotlight.features.map((feat, i) => (
                    <li key={i} className="row gap-3 items-center text-15 font-medium">
                      <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
                        <Icon name="check" size={14} className="text-brand" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button as={Link} to="/product/pi-ai-cloud" variant="primary" className="w-full py-6 text-16 font-bold mt-4">
                  {t.productSpotlight.cta}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
