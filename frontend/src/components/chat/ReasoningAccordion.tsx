import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface ReasoningStage {
  stage: 'understanding' | 'planning' | 'evidence' | 'verification';
  text: string;
  completed: boolean;
}

interface ReasoningAccordionProps {
  summary?: string;
  durationMs?: number;
  stages?: ReasoningStage[];
  thought?: string;
  defaultExpanded?: boolean;
}

export const ReasoningAccordion: React.FC<ReasoningAccordionProps> = ({
  summary = 'Thought process',
  durationMs = 0,
  stages = [],
  thought,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const displayTime =
    durationMs > 0
      ? `Thought for ${formatDuration(durationMs)}`
      : thought
      ? 'Thought process'
      : 'Thought for a few moments';

  return (
    <div className="my-2 select-none">
      {/* Minimalist Thought Disclosure Trigger */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors group"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
        )}
        <Sparkles className="w-3 h-3 text-purple-400 opacity-80 group-hover:opacity-100" />
        <span className="font-medium text-[13px]">{displayTime}</span>
      </button>

      {/* Expanded Thought Stream */}
      {expanded && (
        <div className="mt-2 ml-2 pl-3 border-l-2 border-purple-500/30 space-y-2.5 text-xs text-zinc-400 font-sans leading-relaxed animate-slide-down">
          {thought ? (
            <div className="text-zinc-300 whitespace-pre-wrap font-sans text-xs leading-relaxed bg-[#1c1c1f] p-3 rounded-xl border border-white/[0.06] select-text">
              {thought}
            </div>
          ) : stages.length > 0 ? (
            stages.map((stg, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="capitalize">{stg.stage}</span>
                </div>
                <p className="text-zinc-400 text-xs italic pl-3 leading-relaxed">
                  {stg.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 text-xs italic pl-1">
              {summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
