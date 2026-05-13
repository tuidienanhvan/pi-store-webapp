import React from "react";

import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

import "./Alert.css";



const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};



export function Alert({ tone = "info", icon: IconComponent, title, children, className = "", onDismiss }) {

  const toneClass = `alert--${tone}`;

  const iconToneClass = `text-${tone}`;

  const DefaultIcon = ICONS[tone] || Info;

  const FinalIcon = IconComponent || DefaultIcon;



  return (

    <div className={`flex items-start gap-3 rounded-lg border p-4 ${toneClass} ${className}`} role="alert">

      <div className={`mt-0.5 shrink-0 ${iconToneClass}`}>

        <FinalIcon size={20} />

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

          <X size={16} />

        </button>

      )}

    </div>

  );

}

