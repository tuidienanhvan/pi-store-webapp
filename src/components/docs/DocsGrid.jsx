import React from "react";
import { Link } from "react-router-dom";
import "./DocsGrid.css";

export function DocsGrid({ sections }) {
  return (
    <div className="container docs-grid">
      {sections.map((section) => (
        <section key={section.title} className="docs-section">
          <h2>{section.title}</h2>
          <ul>
            {section.docs.map((d) => (
              <li key={d.to}>
                <Link to={d.to}>{d.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
