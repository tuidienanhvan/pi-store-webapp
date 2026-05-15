import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import './DocsGrid.css';

export function DocsGrid({ sections }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  if (!sections) return null;

  return (
    <div className="docs-grid-quantum">
      {sections.map((section, idx) => (
        <section 
          key={section.title} 
          className="docs-card-panel group"
          onMouseMove={handleMouseMove}
        >
          <div className="card-hud-index">0{idx + 1}</div>
          <div className="card-glow" />
          
          <h2 className="section-title">
            <span className="title-dot" />
            {section.title}
          </h2>
          
          <ul className="docs-list">
            {(section.docs || section.items || []).map((d) => (
              <li key={d.to} className="docs-item">
                <Link to={d.to} className="item-link">
                  <div className="item-icon">
                    <FileText size={14} />
                  </div>
                  <span className="item-label">{d.label}</span>
                  <ChevronRight size={14} className="chevron" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="card-border-decorator" />
        </section>
      ))}
    </div>
  );
}
