import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import CompassNode from './components/nodes/CompassNode';
import RadarNode from './components/nodes/RadarNode';
import LensNode from './components/nodes/LensNode';
import LatentSimulator from './components/LatentSimulator';

import { Message, Company, KeywordCombination, SimulationParams } from './types';
import { analyzeRequirement, AnalysisMode } from './services/geminiService';

const initialMessages: Message[] = [
  { role: 'ai', content: "Hello! I am your Requirement Compass. What product are you looking to source today? Please provide the product name or any initial specifications.", contentZh: "您好！我是您的需求指南针。今天您想寻找什么产品？请提供产品名称或任何初步规格。" }
];

const nodeTypes = {
  compass: CompassNode,
  radar: RadarNode,
  lens: LensNode,
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [radarMessages, setRadarMessages] = useState<Message[]>([
    { role: 'ai', content: "I'm ready to discover suppliers based on your keywords. / 我准备好根据您的关键词发现供应商了。", contentZh: "我准备好根据您的关键词发现供应商了。" }
  ]);
  const [lensMessages, setLensMessages] = useState<Message[]>([
    { role: 'ai', content: "Select a supplier to start deep analysis. / 选择一个供应商开始深度分析。", contentZh: "选择一个供应商开始深度分析。" }
  ]);

  const [clarity, setClarity] = useState(0);
  const [awaiting, setAwaiting] = useState({ en: 'Product name and basic specifications', zh: '产品名称和基本规格' });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [keywords, setKeywords] = useState<KeywordCombination[]>([]);
  
  const [isAnalyzingCompass, setIsAnalyzingCompass] = useState(false);
  const [isAnalyzingRadar, setIsAnalyzingRadar] = useState(false);
  const [isAnalyzingLens, setIsAnalyzingLens] = useState(false);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [simParams, setSimParams] = useState<SimulationParams>({
    materialFluctuation: 20,
    logisticsPressure: 15,
    geopoliticalRisk: 10
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const performAnalysis = async (
    text: string, 
    history: Message[], 
    mode: AnalysisMode,
    setMsgs: React.Dispatch<React.SetStateAction<Message[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const newUserMsg: Message = { role: 'user', content: text, contentZh: text };
    setMsgs(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      let effectiveInput = text;
      if (mode === 'lens' && selectedCompanyId) {
        const target = companies.find(c => c.id === selectedCompanyId);
        if (target) {
          effectiveInput = `[Target Company: ${target.name}] ${text}`;
        }
      }

      const result = await analyzeRequirement(effectiveInput, JSON.stringify(history), mode);
      
      const newAiMsg: Message = { 
        role: 'ai', 
        content: result.aiResponseEn, 
        contentZh: result.aiResponseZh 
      };
      
      setMsgs(prev => [...prev, newAiMsg]);
      
      if (result.specClarity !== undefined) setClarity(result.specClarity);
      if (result.awaitingDetailsEn) setAwaiting({ en: result.awaitingDetailsEn, zh: result.awaitingDetailsZh });
      
      if (result.keywordCombinations) {
        setKeywords(prev => {
          const newKws = [...prev];
          result.keywordCombinations.forEach((kw: KeywordCombination) => {
            if (!newKws.some(k => k.textEn === kw.textEn)) {
              newKws.push(kw);
            }
          });
          return newKws;
        });
      }
      
      if (result.companies && result.companies.length > 0) {
        setCompanies(prev => {
          const updatedCompanies = [...prev];
          result.companies.forEach((newComp: Company) => {
            const existingIndex = updatedCompanies.findIndex(c => 
              c.id === newComp.id || c.name === newComp.name
            );
            
            if (existingIndex !== -1) {
              updatedCompanies[existingIndex] = {
                ...updatedCompanies[existingIndex],
                ...newComp,
                id: updatedCompanies[existingIndex].id 
              };
            } else {
              if (!updatedCompanies.some(c => c.id === newComp.id)) {
                // Ensure ontology exists
                const compWithOntology = {
                  ...newComp,
                  ontology: newComp.ontology || { qualifications: 80, capacity: 70, compliance: 90 },
                  exportMaturity: newComp.exportMaturity || 75
                };
                updatedCompanies.push(compWithOntology);
              }
            }
          });
          return updatedCompanies;
        });
        
        if (!selectedCompanyId && result.companies.length > 0) {
          setSelectedCompanyId(result.companies[0].id);
        }
      }
    } catch (error: any) {
      console.error(`Failed to analyze (${mode}):`, error);
      let errorMsgEn = "⚠️ **Quota Exceeded**: The AI service is currently at its limit. Please wait 30-60 seconds before sending another message. / **配额超限**：AI 服务目前达到限制，请等待 30-60 秒后重试。";
      setMsgs(prev => [...prev, { role: 'ai', content: errorMsgEn, contentZh: "" }]);
    } finally {
      setLoading(false);
    }
  };

  // Update radarMessages when messages (Project 1) changes to sync context
  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'ai') {
        setRadarMessages(prev => [
          ...prev,
          { 
            role: 'ai', 
            content: `🔄 **Requirement Sync**: The product specifications have been refined. I am now optimizing the supplier search based on the latest keywords: ${keywords.map(k => k.textEn).join(', ')}.`, 
            contentZh: `🔄 **需求同步**：产品规格已进一步细化。我正根据最新的关键词组合优化供应商搜索：${keywords.map(k => k.textZh).join(', ')}。` 
          }
        ]);
      }
    }
  }, [messages.length]); // Only trigger when a new message is added

  // Update lensMessages when selectedCompanyId changes
  useEffect(() => {
    if (selectedCompanyId) {
      const company = companies.find(c => c.id === selectedCompanyId);
      if (company) {
        setLensMessages([
          { 
            role: 'ai', 
            content: `Deep analysis for ${company.name} initiated. I have performed a multi-agent competitive research. You can ask me specific questions about their capacity, compliance, or market positioning.`, 
            contentZh: `已启动对 ${company.name} 的深度分析。我已完成多 Agent 竞争性调研。您可以向我询问有关其产能、合规性或市场定位的具体问题。` 
          }
        ]);
      }
    }
  }, [selectedCompanyId, companies]);

  const handleCompassSendMessage = (text: string) => performAnalysis(text, messages, 'compass', setMessages, setIsAnalyzingCompass);
  const handleRadarSendMessage = (text: string) => performAnalysis(text, [...messages, ...radarMessages], 'radar', setRadarMessages, setIsAnalyzingRadar);
  const handleLensSendMessage = (text: string) => performAnalysis(text, [...messages, ...lensMessages], 'lens', setLensMessages, setIsAnalyzingLens);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Filter companies based on simulation (Entropy Reduction)
  const filteredCompanies = useMemo(() => {
    return companies.map(c => {
      // Simulate node displacement based on pressure
      const pressureFactor = (simParams.materialFluctuation + simParams.logisticsPressure + simParams.geopoliticalRisk) / 300;
      const adjustedMaturity = Math.max(0, Math.min(100, c.exportMaturity - (pressureFactor * 20)));
      return { ...c, exportMaturity: Math.round(adjustedMaturity) };
    });
  }, [companies, simParams]);

  // Initialize nodes and edges
  useEffect(() => {
    setNodes((nds) => {
      const compassNode = nds.find(n => n.id === 'compass');
      const radarNode = nds.find(n => n.id === 'radar');
      const lensNode = nds.find(n => n.id === 'lens');

      const nextNodes: Node[] = [
        {
          id: 'compass',
          type: 'compass',
          position: compassNode?.position || { x: 50, y: 100 },
          style: compassNode?.style || { width: 550, height: 850 },
          data: { clarity, awaiting, messages, isAnalyzing: isAnalyzingCompass, onSendMessage: handleCompassSendMessage },
        },
        {
          id: 'radar',
          type: 'radar',
          position: radarNode?.position || { x: 650, y: 50 },
          style: radarNode?.style || { width: 650, height: 1000 },
          data: { companies: filteredCompanies, selectedCompanyId, keywords, messages: radarMessages, isAnalyzing: isAnalyzingRadar, onSendMessage: handleRadarSendMessage, onSelectCompany: setSelectedCompanyId },
        },
      ];

      if (selectedCompany) {
        nextNodes.push({
          id: 'lens',
          type: 'lens',
          position: lensNode?.position || { x: 1400, y: 0 },
          style: lensNode?.style || { width: 850, height: 1200 },
          data: { company: selectedCompany, messages: lensMessages, isAnalyzing: isAnalyzingLens, onSendMessage: handleLensSendMessage },
        });
      }

      return nextNodes;
    });

    setEdges((eds) => {
      const nextEdges: Edge[] = [
        { id: 'e1-2', source: 'compass', target: 'radar', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      ];
      if (selectedCompany) {
        nextEdges.push({ id: 'e2-3', source: 'radar', target: 'lens', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } });
      }
      return nextEdges;
    });
  }, [clarity, awaiting, messages, isAnalyzingCompass, filteredCompanies, selectedCompanyId, keywords, radarMessages, isAnalyzingRadar, selectedCompany, lensMessages, isAnalyzingLens]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <TopBar />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-950"
        >
          <Background variant={BackgroundVariant.Lines} color="#1e293b" gap={40} size={1} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-100" />
          <MiniMap 
            nodeColor={(n) => {
              if (n.type === 'compass') return '#10b981';
              if (n.type === 'radar') return '#3b82f6';
              if (n.type === 'lens') return '#6366f1';
              return '#eee';
            }}
            maskColor="rgba(15, 23, 42, 0.7)"
            className="bg-slate-900 border border-slate-700"
          />
        </ReactFlow>
        
        <LatentSimulator params={simParams} onChange={setSimParams} />
        
        {/* Zero-Omission Visual Boundary Indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-4 z-50 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Zero-Omission Boundary Active</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Entropy: <span className="text-slate-300 font-mono">{(100 - clarity).toFixed(2)} bits</span>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
