import React, { useState } from "react";
import "./Tabs.css";

export function Tabs({ items = [], defaultActiveId, onChange, className = "" }) {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);

  const handleTabClick = (id) => {
    setActiveId(id);
    if (onChange) onChange(id);
  };

  const activeContent = items.find(item => item.id === activeId)?.content;

  return (
    <div className={`tabs ${className}`}>
      <div 
        role="tablist" 
        style={{ 
          display: "flex", 
          gap: "var(--s-4)", 
          borderBottom: "1px solid var(--hairline-strong)",
          marginBottom: "var(--s-6)"
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeId === item.id}
            onClick={() => handleTabClick(item.id)}
            style={{
              padding: "var(--s-3) 0",
              background: "transparent",
              border: "none",
              borderBottom: activeId === item.id ? "2px solid var(--brand)" : "2px solid transparent",
              color: activeId === item.id ? "var(--brand)" : "var(--text-2)",
              fontWeight: activeId === item.id ? "600" : "500",
              cursor: "pointer",
              fontSize: "var(--fs-14)",
              transition: "all var(--t-fast)",
              marginBottom: "-1px"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
}
