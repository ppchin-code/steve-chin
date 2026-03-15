import React from 'react';
import { Sliders, Zap, Globe, Truck } from 'lucide-react';
import { SimulationParams } from '../types';

interface Props {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
}

export default function LatentSimulator({ params, onChange }: Props) {
  const handleChange = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="fixed bottom-24 right-8 w-72 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 z-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-xl text-white">
          <Zap size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Latent Simulator</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Supply Chain Pressure / 供应链压力</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Zap size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Materials</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">{params.materialFluctuation}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={params.materialFluctuation}
            onChange={(e) => handleChange('materialFluctuation', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Truck size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Logistics</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-bold">{params.logisticsPressure}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={params.logisticsPressure}
            onChange={(e) => handleChange('logisticsPressure', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Globe size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Geopolitical</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{params.geopoliticalRisk}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={params.geopoliticalRisk}
            onChange={(e) => handleChange('geopoliticalRisk', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Entropy Reduction Active</span>
        </div>
        <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
          Adjusting parameters will trigger real-time manifold displacement and node re-clustering.
        </p>
      </div>
    </div>
  );
}
