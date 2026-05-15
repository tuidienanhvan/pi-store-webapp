import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AdminCard } from './AdminCard';
import { AdminValue } from './AdminValue';

/**
 * AdminStatCard: Thẻ hiển thị thông số thống kê.
 */
export function AdminStatCard({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendLabel, 
  to, 
  className = '',
  tone = 'primary' // 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}) {
  const CardContent = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-base-content/40">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg bg-${tone}/10 text-${tone}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <AdminValue className={`text-2xl text-${tone}`}>
          {value}
        </AdminValue>
        {subValue && (
          <div className="text-[11px] font-medium text-base-content/40">
            {subValue}
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend >= 0 ?'text-success' : 'text-danger'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
          <span className="text-[10px] font-medium text-base-content/30 tracking-wide">
            {trendLabel || 'So với tháng trước'}
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block group">
        <AdminCard className={`p-6 hover:border-${tone}/30 ${className}`}>
          {CardContent}
        </AdminCard>
      </Link>
    );
  }

  return (
    <AdminCard className={`p-6 ${className}`}>
      {CardContent}
    </AdminCard>
  );
}
