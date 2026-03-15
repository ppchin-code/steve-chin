import React, { useState, useRef, useEffect } from 'react';
import { Bot, Paperclip, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface Props {
  messages: Message[];
  isAnalyzing: boolean;
  onSendMessage: (text: string) => void;
  placeholder?: string;
  loadingText?: string;
}

export default function ChatBox({ messages, isAnalyzing, onSendMessage, placeholder, loadingText }: Props) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isAnalyzing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900/50">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/10">
                <Bot size={16} className="text-indigo-400" />
              </div>
            )}
            <div className={`${msg.role === 'user' ? 'bg-indigo-600 text-white border border-indigo-500 rounded-tr-none' : 'bg-slate-800/80 backdrop-blur-sm border border-white/10 text-slate-200 rounded-tl-none'} p-4 rounded-2xl text-sm max-w-[90%] shadow-xl relative group`}>
              <div className="markdown-body prose prose-invert prose-sm max-w-none 
                [&>h3]:text-xs [&>h3]:font-black [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-indigo-400 [&>h3]:uppercase [&>h3]:tracking-widest [&>h3:first-child]:mt-0 
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-2 [&>p]:mb-4 [&>p:last-child]:mb-0 
                [&_strong]:font-bold [&_strong]:text-white [&_a]:text-indigo-400 [&_a]:no-underline hover:[&_a]:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.contentZh && msg.contentZh !== msg.content && (
                <div className={`mt-4 pt-4 border-t ${msg.role === 'user' ? 'border-indigo-500/30' : 'border-white/5'}`}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none text-slate-400 italic leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.contentZh}</ReactMarkdown>
                  </div>
                </div>
              )}

              {msg.role === 'ai' && (
                <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-indigo-600 p-1 rounded-lg shadow-lg">
                    <Sparkles size={10} className="text-white" />
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400 font-black text-[10px] mt-1 shadow-lg">
                SJ
              </div>
            )}
          </div>
        ))}
        
        {isAnalyzing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
              <Bot size={16} className="text-indigo-400" />
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%] text-slate-400 flex items-center gap-3 shadow-xl">
              <div className="relative">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <div className="absolute inset-0 blur-sm bg-indigo-500/50 animate-pulse rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{loadingText || 'Processing Latent Space...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-950/50 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-2xl">
          <button type="button" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-slate-600 text-white outline-none font-medium" 
            placeholder={placeholder || "Query the engine... / 询问引擎..."} 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAnalyzing}
          />
          <button type="submit" disabled={isAnalyzing || !input.trim()} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-30 shadow-lg shadow-indigo-600/20 active:scale-95">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
