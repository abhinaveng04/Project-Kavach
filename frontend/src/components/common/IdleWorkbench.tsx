import React, { useState } from 'react';
import { Sparkles, FileText, Calculator, ShieldCheck, UploadCloud, Terminal, Eye } from 'lucide-react';

interface IdleWorkbenchProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenUpload: () => void;
}

export const IdleWorkbench: React.FC<IdleWorkbenchProps> = ({ onSelectPrompt, onOpenUpload }) => {
  const [isCollapsing, setIsCollapsing] = useState(false);

  const suggestions = [
    {
      title: 'Corrosion Trend Memo',
      prompt: 'Draft the Q3 corrosion-trend memo for Unit 200, cite the inspection SOP.',
      icon: FileText,
      subtitle: 'Executive deliverable with SOP citations',
    },
    {
      title: 'P&ID Vision Tag OCR',
      prompt: 'Inspect P&ID tag V-204 and check safe operating pressure limits.',
      icon: Eye,
      subtitle: 'Visual equipment extraction & limits check',
    },
    {
      title: 'Python Deterministic Math',
      prompt: 'Calculate 125 * 48 using Python sandbox.',
      icon: Calculator,
      subtitle: 'Deterministic sandbox execution',
    },
    {
      title: 'Inspection Gate Verification',
      prompt: 'Verify corrosion rate calculation formulas according to inspection SOP §4.2.',
      icon: Terminal,
      subtitle: 'RAG verification against standard SOP',
    },
  ];

  const handleCardClick = (promptText: string) => {
    setIsCollapsing(true);
    setTimeout(() => {
      onSelectPrompt(promptText);
    }, 220);
  };

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto text-center select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsing ? 'animate-collapse-up pointer-events-none' : 'animate-fade-in'
      }`}
    >
      {/* 4-Point Neural Sparkle Icon */}
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#2f2f2f] border border-white/[0.12] flex items-center justify-center shadow-xl">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
        What are we engineering today?
      </h2>
      <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        Sovereign, air-gapped agentic intelligence for industrial and refinery engineering. All execution is 100% on-premise.
      </p>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-6 text-left">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleCardClick(item.prompt)}
              className="p-4 rounded-2xl bg-[#2f2f2f]/60 hover:bg-[#2f2f2f] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-200 group flex flex-col justify-between gap-2 shadow-sm text-left active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/[0.06] text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Upload Pill */}
      <button
        onClick={onOpenUpload}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2f2f2f]/70 hover:bg-[#2f2f2f] border border-white/[0.08] hover:border-white/[0.2] text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm active:scale-[0.98]"
      >
        <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
        <span>Ingest Document / P&ID (PDF, XLSX, DOCX)</span>
      </button>
    </div>
  );
};
