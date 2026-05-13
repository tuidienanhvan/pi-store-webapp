import React from "react";



import "./Badge.css";



export function Badge({ children, tone = "neutral", className = "", icon: IconComponent }) {

  const toneClass = `badge--${tone}`;



  return (

    <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold tracking-wide ${toneClass} ${className}`}>

      {IconComponent && <IconComponent size={12} />}

      {children}

    </span>

  );

}

