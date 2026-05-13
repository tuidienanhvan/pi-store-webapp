import React from "react";

import { Link } from "react-router-dom";

import { Card } from "@/components/ui";
import { ArrowRight } from "lucide-react";

import "./AdminStatCard.css";



export function AdminStatCard({ 

  to, 

  title, 

  value, 

  subValue, 

  trend, 

  trendLabel, 

  variant = "glass",

  icon: IconComponent = ArrowRight,

  className = "" 

}) {

  const CardWrapper = to ? Link : "div";

  

  return (

    <Card 

      as={CardWrapper} 

      to={to} 

      className={`admin-stat-card admin-stat-card--${variant} ${to ? 'admin-stat-card--link' : ''} ${className}`}

    >

      <div className="admin-stat-card__header">

        <span className="admin-stat-card__title">{title}</span>

        {to && <IconComponent size={12} className="admin-stat-card__arrow" />}

      </div>

      

      <div className="admin-stat-card__value">{value}</div>

      

      {(subValue || trend) && (

        <div className="admin-stat-card__footer">

          {subValue && <div className="admin-stat-card__subvalue">{subValue}</div>}

          {trend && (

            <div className={`admin-stat-card__trend admin-stat-card__trend--${trend > 0 ? 'up' : 'down'}`}>

              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% {trendLabel}

            </div>

          )}

        </div>

      )}

    </Card>

  );

}

