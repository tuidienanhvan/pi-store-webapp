import React from 'react';
import { Badge } from "@/_shared/components/ui";

export function AdminBadge({ children, tone = 'brand', className = '' }) {
  return (
    <Badge 
      tone={tone} 
      className={`glass font-bold tracking-[0.05em] px-2.5 py-1 text-xs glow-${tone} border-${tone}/20 bg-${tone}/10 ${className}`}
    >
      {children}
    </Badge>
  );
}
