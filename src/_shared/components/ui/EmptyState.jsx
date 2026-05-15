import React from "react";



import "./EmptyState.css";



export function EmptyState({ icon: IconComponent, title, description, action }) {

  return (

    <div className="empty-state">

      {IconComponent && (

        <div className="empty-state__icon">

          <IconComponent size={48} strokeWidth={1} />

        </div>

      )}

      <h3 className="empty-state__title">{title}</h3>

      {description && <p className="empty-state__desc">{description}</p>}

      {action && <div style={{ marginTop: "var(--s-4)" }}>{action}</div>}

    </div>

  );

}

