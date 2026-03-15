import { Sparkles, Cpu, Activity } from 'lucide-react';

export default function BottomBar() {
  return (
    <footer className="h-10 border-t border-white/5 bg-slate-950 px-8 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-2">
          <Activity size={12} className="text-emerald-500" />
          1,242 Entities Indexed
        </span>
        <span className="flex items-center gap-2 text-indigo-400">
          <Sparkles size={12} /> 
          AI Optimization Active
        </span>
        <span className="flex items-center gap-2">
          <Cpu size={12} className="text-blue-500" />
          Neural Engine: v4.2-Stable
        </span>
      </div>
      <div className="flex items-center gap-6">
        <span className="opacity-40">Session: LATENT-DELTA-992</span>
        <div className="flex gap-1.5 opacity-60">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 shadow-sm font-mono">CMD</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 shadow-sm font-mono">K</kbd>
        </div>
      </div>
    </footer>
  );
}
