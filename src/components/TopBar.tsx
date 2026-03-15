import { Settings, Bell, Settings2, ShieldCheck } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 border-b border-white/10 bg-slate-950 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Latent Space <span className="text-indigo-500">Explorer</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">
              Decision Support System / 决策支持系统
            </p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/10"></div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-2 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Engine: Optimal
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center gap-2 tracking-widest uppercase">
            <ShieldCheck size={12} />
            Secure Session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="h-10 w-px bg-white/10"></div>
        
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Lead Architect</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border-2 border-white/10 p-0.5 group-hover:border-indigo-500 transition-all overflow-hidden">
            <img className="w-full h-full object-cover rounded-xl" src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
          </div>
        </div>
      </div>
    </header>
  );
}
