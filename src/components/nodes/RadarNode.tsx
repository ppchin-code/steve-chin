import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Company, KeywordCombination, Message } from '../../types';
import ChatBox from '../ChatBox';
import CompanyCard from '../CompanyCard';
import { Layers, Target, ShieldCheck } from 'lucide-react';

interface RadarNodeProps {
  data: {
    companies: Company[];
    selectedCompanyId: string;
    keywords: KeywordCombination[];
    messages: Message[];
    isAnalyzing: boolean;
    onSendMessage: (text: string) => void;
    onSelectCompany: (id: string) => void;
  };
  selected?: boolean;
}

export default function RadarNode({ data, selected }: RadarNodeProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col w-full h-full overflow-hidden min-w-[400px] min-h-[500px]">
      <NodeResizer 
        minWidth={400} 
        minHeight={500} 
        isVisible={selected}
        lineClassName="border-blue-500"
        handleClassName="bg-blue-500 w-3 h-3 rounded-full border-2 border-white"
      />
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-blue-500 border-4 border-slate-900" />
      
      <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Target size={24} />
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tighter text-white uppercase italic">Enterprise Radar</h3>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Manifold Clustering / 流形聚类</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-black text-blue-400 leading-none">{data.companies.length}</div>
          <div className="text-[10px] uppercase tracking-widest font-black opacity-30 mt-1">Clusters</div>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-950/50 border-b border-white/5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex gap-2 whitespace-nowrap pb-1">
          {data.keywords.map((kw, i) => (
            <div key={i} className="inline-flex px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-[10px] font-bold text-slate-300 shadow-sm items-center gap-2 shrink-0">
              <span className="w-1 h-1 rounded-full bg-blue-500" />
              {kw.textEn}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700">
        {data.companies.map(company => (
          <div key={company.id} className="relative">
            <CompanyCard 
              company={company} 
              isSelected={data.selectedCompanyId === company.id} 
              onClick={() => data.onSelectCompany(company.id)} 
            />
            {/* Ontology Overlay */}
            <div className="absolute right-4 bottom-4 flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full bg-emerald-500 transition-all duration-1000" style={{ height: `${company.ontology.qualifications}%` }} />
                </div>
                <span className="text-[8px] font-black text-slate-600 mt-1">Q</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full bg-blue-500 transition-all duration-1000" style={{ height: `${company.ontology.capacity}%` }} />
                </div>
                <span className="text-[8px] font-black text-slate-600 mt-1">C</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full bg-indigo-500 transition-all duration-1000" style={{ height: `${company.ontology.compliance}%` }} />
                </div>
                <span className="text-[8px] font-black text-slate-600 mt-1">L</span>
              </div>
            </div>
            {/* Export Maturity Badge */}
            <div className="absolute left-4 -top-2">
              <div className="px-2 py-0.5 bg-slate-950 border border-white/10 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Maturity: {company.exportMaturity}%</span>
              </div>
            </div>
          </div>
        ))}
        {data.companies.length === 0 && (
          <div className="h-60 flex flex-col items-center justify-center text-slate-600 gap-4">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Latent Manifold...</p>
          </div>
        )}
      </div>

      <div className="h-[300px] border-t border-white/5 bg-slate-950/50">
        <ChatBox 
          messages={data.messages} 
          isAnalyzing={data.isAnalyzing} 
          onSendMessage={data.onSendMessage} 
          placeholder="Emphasize keywords (capacity, location, etc.)... / 强调关键词（产能、地址等）..."
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-blue-500 border-4 border-slate-900" />
    </div>
  );
}
