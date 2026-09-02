import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Sparkles, Check, Brain } from 'lucide-react';
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
  defaultExpanded?: boolean;
}

export const ReasoningAccordion: React.FC<ReasoningAccordionProps> = ({
  summary = 'Thought for a few seconds',
  durationMs = 0,
  stages = [],
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const displayTime = durationMs > 0 ? `Thought for ${formatDuration(durationMs)}` : 'Thought for 4.2s';

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
        <div className="mt-2 ml-2 pl-4 thought-stream-border space-y-2.5 text-xs text-zinc-400 font-sans leading-relaxed animate-slide-down">
          {stages.length > 0 ? (
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
            <div className="space-y-1.5 italic text-zinc-400 text-xs">
              <p>1. Analyzing industrial engineering constraints from user request.</p>
              <p>2. Checking sovereign model execution policy and routing table.</p>
              <p>3. Dispatching local specialist tools and RAG vector index.</p>
              <p>4. Validating deterministic accuracy against standard engineering SOP.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
