import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Message } from '../../types';
import ChatBox from '../ChatBox';

interface CompassNodeProps {
  data: {
    clarity: number;
    awaiting: { en: string; zh: string };
    messages: Message[];
    isAnalyzing: boolean;
    onSendMessage: (text: string) => void;
  };
  selected?: boolean;
}

export default function CompassNode({ data, selected }: CompassNodeProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col w-full h-full min-w-[300px] min-h-[400px]">
      <NodeResizer 
        minWidth={300} 
        minHeight={400} 
        isVisible={selected}
        lineClassName="border-emerald-500"
        handleClassName="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"
      />
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div>
          <h3 className="font-bold text-lg">Requirement Compass</h3>
          <p className="text-xs opacity-70">需求指南针</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-emerald-400">{data.clarity}%</div>
          <div className="text-[10px] uppercase tracking-wider opacity-50">Clarity / 明确度</div>
        </div>
      </div>
      
      <div className="p-4 bg-emerald-50 border-b border-emerald-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Awaiting Details / 待补充</span>
        </div>
        <p className="text-xs text-emerald-900 font-medium">{data.awaiting.en}</p>
        <p className="text-[10px] text-emerald-700 mt-0.5">{data.awaiting.zh}</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatBox 
          messages={data.messages} 
          isAnalyzing={data.isAnalyzing} 
          onSendMessage={data.onSendMessage} 
          placeholder="Refine requirements... / 细化需求..."
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
    </div>
  );
}
