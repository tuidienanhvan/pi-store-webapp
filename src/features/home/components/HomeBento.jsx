import React from "react";
import { useLocale } from "@/_shared/context/LocaleContext";
import "./HomeBento.css";

// Import Bento Sub-components
import { BentoMetricsCard } from "./bento/BentoMetricsCard";
import { BentoInfrastructureCard } from "./bento/BentoInfrastructureCard";
import { BentoAINexusCard } from "./bento/BentoAINexusCard";
import { BentoRegionalHubCard } from "./bento/BentoRegionalHubCard";

export function HomeBento() {
  const { dict } = useLocale();
  const items = dict.whyPi.items;

  return (
    <section className="home-bento">
      <div className="home-bento__bg-glow" aria-hidden="true" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="home-bento__header">
          <h2 className="home-bento__headline">{dict.whyPi.title}</h2>
          <p className="home-bento__subline">{dict.whyPi.description}</p>
        </div>

        <div className="home-bento__grid">
          {/* Card 0: Metrics */}
          <BentoMetricsCard 
            title={items[0].title} 
            description={items[0].desc} 
          />

          {/* Card 1: Infrastructure */}
          <BentoInfrastructureCard 
            title={items[1].title} 
            description={items[1].desc} 
          />
          
          {/* Card 2: AI Nexus */}
          <BentoAINexusCard 
            title={items[2].title} 
            description={items[2].desc} 
          />

          {/* Card 3: Regional Hub */}
          <BentoRegionalHubCard 
            title={items[3].title} 
            description={items[3].desc} 
          />
        </div>
      </div>
    </section>
  );
}
