import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { RiskAlert } from '../types';

interface Props {
  risk: RiskAlert;
}

export default function RiskAlertCard({ risk }: Props) {
  const isHigh = risk.severity === 'high';
  const isMedium = risk.severity === 'medium';

  return (
    <div className={`p-4 rounded-xl border flex gap-3 transition-all hover:scale-[1.02] ${
      isHigh 
        ? 'bg-rose-50 border-rose-100 text-rose-900 shadow-sm shadow-rose-500/10' 
        : isMedium 
          ? 'bg-amber-50 border-amber-100 text-amber-900 shadow-sm shadow-amber-500/10' 
          : 'bg-blue-50 border-blue-100 text-blue-900 shadow-sm shadow-blue-500/10'
    }`}>
      <div className="shrink-0 mt-0.5">
        {isHigh ? <AlertCircle size={18} /> : isMedium ? <AlertTriangle size={18} /> : <Info size={18} />}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-black text-xs uppercase tracking-wider">{risk.typeEn}</h5>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter border ${
            isHigh ? 'bg-rose-600 text-white border-rose-500' : 'bg-white/50 border-current'
          }`}>
            {risk.severity}
          </span>
        </div>
        <p className="text-xs font-bold leading-snug">{risk.descriptionEn}</p>
        <p className="text-[10px] opacity-70 mt-1 font-medium italic">{risk.descriptionZh}</p>
      </div>
    </div>
  );
}
