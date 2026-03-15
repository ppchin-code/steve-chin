import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onClick: () => void;
}

export default function CompanyCard({ company, isSelected, onClick }: CompanyCardProps) {
  const hasDeepIntel = !!company.registration;

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer transition-all relative group ${
        isSelected 
          ? 'bg-indigo-600 border-2 border-indigo-400 shadow-xl shadow-indigo-600/20' 
          : 'bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg'
      }`}
    >
      {isSelected && (
        <div className="absolute -right-2 -top-2 w-6 h-6 bg-indigo-400 text-white flex items-center justify-center rounded-full shadow-lg border-2 border-white">
          <Check size={14} strokeWidth={4} />
        </div>
      )}

      {hasDeepIntel && (
        <div className="absolute -left-2 -top-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg border-2 border-white flex items-center gap-1">
          <Zap size={8} fill="currentColor" />
          Deep Intel
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden shadow-sm ${
          isSelected ? 'border-indigo-400 bg-white' : 'border-slate-100 bg-slate-50'
        }`}>
          <img 
            className="object-cover w-full h-full" 
            src={`https://picsum.photos/seed/${company.logoSeed}/100/100`} 
            alt="Logo" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col items-end gap-1">
          {company.tags.length > 0 && (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border tracking-widest ${
              isSelected 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              {company.tags[0].textEn}
            </span>
          )}
          <div className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
            {company.responseTime} Response
          </div>
        </div>
      </div>

      <h4 className={`font-black text-base leading-tight transition-colors ${
        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'
      }`}>
        {company.name}
      </h4>
      
      <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
        {company.locationEn} / {company.locationZh}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {company.tags.slice(1).map((tag, idx) => (
          <span 
            key={idx} 
            className={`text-[9px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-tighter ${
              isSelected 
                ? 'bg-white/10 text-white border-white/20' 
                : tag.type === 'premium' 
                  ? 'bg-amber-50 text-amber-600 border-amber-100' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            {tag.textEn}
          </span>
        ))}
      </div>
    </div>
  );
}
