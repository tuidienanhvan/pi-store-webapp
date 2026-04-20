import React from "react";
import { Card, Badge, Icon } from "../ui";

export function HomeBento({ t }) {
  return (
    <section className="container stack gap-12 pt-12 animate-in" style={{ animationDelay: "400ms" }}>
      <div className="stack gap-4 items-center text-center max-w-2xl mx-auto">
        <Badge tone="brand" className="glass uppercase font-bold tracking-widest px-4">Why Choose Pi</Badge>
        <h2 className="text-48 m-0 font-bold">{t.whyPi.title}</h2>
        <p className="text-18 muted m-0 leading-relaxed font-medium">{t.whyPi.description}</p>
      </div>
      
      <div className="grid --cols-4 gap-6">
        {t.whyPi.items.map((usp, i) => (
          <Card key={i} className="glass hover-glow stack gap-4 p-8 items-start text-left group">
            <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center text-brand border border-hairline group-hover:bg-brand group-hover:text-white transition-colors duration-300">
              <Icon name={["wallet", "shield", "zap", "home"][i]} size={28} />
            </div>
            <div className="stack gap-2">
              <h3 className="text-20 m-0 font-bold">{usp.title}</h3>
              <p className="text-15 muted m-0 leading-relaxed font-medium">{usp.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
