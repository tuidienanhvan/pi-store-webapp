import React from "react";

import { Icon } from "./icons";

import "./Badge.css";



export function Badge({ children, tone = "neutral", className = "", icon }) {

  const toneClass = `badge--${tone}`;



  return (

    <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold tracking-wide ${toneClass} ${className}`}>

      {icon && <Icon name={icon} size={12} />}

      {children}

    </span>

  );

}

