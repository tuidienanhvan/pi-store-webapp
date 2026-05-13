import { useLocale } from "@/context/LocaleContext";
import { Input, Badge } from "../ui";
import { Search, BookOpen, Cpu } from "lucide-react";
import "./DocsHero.css";

export function DocsHero() {
  const { dict } = useLocale();
  const t = dict.docs;

  return (
    <header className="docs-hero-quantum">
      <div className="hero-hud-decorators">
        <div className="hud-line top" />
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
      </div>

      <div className="hero-content-stack">
        <Badge tone="brand" className="mb-6">
          <BookOpen size={12} className="mr-2" />
          <span>PI_KNOWLEDGE_BASE_V1</span>
        </Badge>

        <h1 className="docs-title">
          <span className="text-gradient">{t.title}</span>
        </h1>
        
        <p className="docs-description">{t.description}</p>

        <div className="docs-search-container">
          <div className="search-box-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="docs-search-input"
              placeholder={t.searchPlaceholder}
            />
            <div className="search-shimmer" />
          </div>
          <div className="search-meta">
            <div className="meta-unit">
               <Cpu size={12} className="text-primary" />
               <span>INDEX_READY</span>
            </div>
            <div className="divider" />
            <span>LAST_SYNC: 2026.05.11</span>
          </div>
        </div>
      </div>
    </header>
  );
}
