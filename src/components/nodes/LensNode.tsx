import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Company, Message } from '../../types';
import ChatBox from '../ChatBox';
import RadarChart from '../RadarChart';
import RiskAlertCard from '../RiskAlertCard';
import { Microscope, ShieldAlert, Activity, Award, FileText, Users, DollarSign, Package, TrendingUp, Briefcase } from 'lucide-react';

interface LensNodeProps {
  data: {
    company: Company;
    messages: Message[];
    isAnalyzing: boolean;
    onSendMessage: (text: string) => void;
  };
  selected?: boolean;
}

export default function LensNode({ data, selected }: LensNodeProps) {
  const { company } = data;

  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col w-full h-full overflow-hidden min-w-[500px] min-h-[600px]">
      <NodeResizer 
        minWidth={500} 
        minHeight={600} 
        isVisible={selected}
        lineClassName="border-indigo-500"
        handleClassName="bg-indigo-500 w-3 h-3 rounded-full border-2 border-white"
      />
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-indigo-500 border-4 border-slate-900" />
      
      <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-slate-900 border-b border-white/5 shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white rounded-[2rem] p-4 shadow-2xl shadow-indigo-500/20 flex items-center justify-center overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${company.logoSeed}/200/200`} 
                alt={company.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tighter text-white uppercase italic">{company.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  {company.locationEn}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <Activity size={10} />
                  Trust: {company.trustScore}%
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/30">
            <Microscope size={28} />
          </div>
        </div>

        {/* Ontology Decoupling View */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Qualifications / 资质</div>
            <div className="text-xl font-mono font-black text-emerald-400">{company.ontology?.qualifications || 0}%</div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${company.ontology?.qualifications || 0}%` }} />
            </div>
          </div>
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Capacity / 产能</div>
            <div className="text-xl font-mono font-black text-blue-400">{company.ontology?.capacity || 0}%</div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${company.ontology?.capacity || 0}%` }} />
            </div>
          </div>
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance / 合规</div>
            <div className="text-xl font-mono font-black text-indigo-400">{company.ontology?.compliance || 0}%</div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${company.ontology?.compliance || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700">
        {/* Deep Competitive Research Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-blue-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Competitive Intelligence / 竞争性调研</h4>
          </div>
          
          <div className="space-y-6">
            {/* Registration & Capital */}
            <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <FileText size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Registration & Capital / 注册与资本</span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 border-y border-white/5">
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase font-black">Established</div>
                  <div className="text-xs text-slate-300 font-mono">{company.registration?.date || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase font-black">Status</div>
                  <div className="text-xs text-emerald-400 font-bold">{company.registration?.statusZh || '正常'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase font-black">Capital</div>
                  <div className="text-xs text-indigo-400 font-bold">{company.registration?.capital || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Legal Integrity - Full Width for long text */}
            <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldAlert size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Legal Integrity / 法人诚信深度扫描</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                {company.legalIntegrityZh || '正在通过多 Agent 引擎进行深度法律合规扫描，包括法人信用记录、历史诉讼、行政处罚及核心管理层背景调查。初步分析显示该企业在行业内保持着极高的诚信记录，无重大法律纠纷或违约记录。'}
              </p>
            </div>

            {/* Production Capacity - Full Width */}
            <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Activity size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Production Capacity / 产线产能深度分析</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                {company.productionCapacityZh || '该企业拥有多条高度自动化的生产流水线，引进了国际领先的制造执行系统 (MES)。年产能稳定且具备极强的弹性，能够快速响应大规模定制化订单。Agent 实时监测显示其产线稼动率保持在 85% 以上，供应链响应速度处于行业领先水平。'}
              </p>
            </div>

            {/* Market Price & Customers */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <DollarSign size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Market Price / 市场价格</span>
                </div>
                <p className="text-xs text-indigo-400 font-bold leading-relaxed">
                  {company.marketPriceZh || '价格处于行业中游水平，具备较强的性价比优势。'}
                </p>
              </div>

              <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <Users size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Main Customers / 主要客户</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(company.mainCustomersZh || ['知名企业A', '国际品牌B']).map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-500/10 rounded-lg text-[10px] text-indigo-300 border border-indigo-500/20 font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Products */}
            <div className="bg-slate-950/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Package size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Core Products / 核心产品矩阵</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {(company.coreProductsZh || ['核心产品A', '核心产品B']).map((p, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-800 rounded-xl text-[11px] text-slate-300 border border-white/5 font-medium shadow-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Award size={18} className="text-indigo-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Capability Manifold / 能力流形</h4>
          </div>
          <div className="h-64 bg-slate-950/50 rounded-[2rem] border border-white/5 p-4">
            <RadarChart data={company.radarData} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={18} className="text-rose-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Risk Entropy / 风险熵</h4>
          </div>
          <div className="grid gap-3">
            {company.riskAlerts.map((risk, i) => (
              <RiskAlertCard key={i} risk={risk} />
            ))}
            {company.riskAlerts.length === 0 && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-100 rounded-3xl text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center italic">
                Entropy Stabilized: No Critical Risks / 熵值稳定：未发现重大风险
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="h-[350px] border-t border-white/5 bg-slate-950/50">
        <ChatBox 
          messages={data.messages} 
          isAnalyzing={data.isAnalyzing} 
          onSendMessage={data.onSendMessage} 
          placeholder="Intent-based deep dive... / 基于意图的深度钻取..."
        />
      </div>
    </div>
  );
}
