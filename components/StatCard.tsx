
import React from 'react';

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  variant?: 'default' | 'trend' | 'progress' | 'blue';
  trendText?: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, count, icon, variant = 'default', trendText, progress }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col justify-between h-36 ${variant === 'progress' ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{count}</p>
        </div>
        <div className={`p-2 rounded-lg ${
          variant === 'progress' ? 'bg-red-50 text-red-600' : 
          variant === 'trend' ? 'bg-green-50 text-green-600' : 
          'bg-blue-50 text-blue-600'
        }`}>
          {icon}
        </div>
      </div>

      {variant === 'trend' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-20 pointer-events-none">
          <svg className="w-full h-full text-green-500 fill-current" preserveAspectRatio="none" viewBox="0 0 200 50">
            <path d="M0,50 L0,30 L20,35 L40,20 L60,25 L80,10 L100,20 L120,5 L140,15 L160,10 L180,5 L200,0 L200,50 Z" />
          </svg>
        </div>
      )}

      {trendText && (
        <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
          <span className="mr-1">↑</span>
          {trendText}
        </div>
      )}

      {variant === 'progress' && progress !== undefined && (
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      {variant === 'blue' && (
        <div className="absolute -bottom-4 -right-4 text-blue-50/50 pointer-events-none">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-24 h-24' })}
        </div>
      )}
    </div>
  );
};

export default StatCard;
