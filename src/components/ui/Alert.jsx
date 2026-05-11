import React from "react";

import { Icon } from "./icons";

import "./Alert.css";



const ICONS = {

  info: "info",

  success: "success",

  warning: "warning",

  danger: "danger",

};



export function Alert({ tone = "info", title, children, className = "", onDismiss }) {

  const toneClass = `alert--${tone}`;

  const iconToneClass = `text-${tone}`;



  return (

    <div className={`flex items-start gap-3 rounded-lg border p-4 ${toneClass} ${className}`} role="alert">

      <div className={`mt-0.5 shrink-0 ${iconToneClass}`}>

        <Icon name={ICONS[tone] || "info"} size={20} />

      </div>

      <div className="flex-1">

        {title && <h4 className="mb-1 text-sm text-base-content">{title}</h4>}

        <div className="text-sm text-slate-400">

          {children}

        </div>

      </div>

      {onDismiss && (

        <button

          type="button"

          onClick={onDismiss}

          className="rounded p-1 text-slate-500 transition hover:bg-base-content/10 hover:text-base-content"

          aria-label="Dismiss"

        >

          <Icon name="x" size={16} />

        </button>

      )}

    </div>

  );

}

