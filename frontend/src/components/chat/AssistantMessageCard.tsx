import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Boxes,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '../../types/workbench';
import { ArtifactResponse, CitationItem } from '../../types/api';
import { ReasoningAccordion } from './ReasoningAccordion';
import { ToolExecutionCard } from './ToolExecutionCard';
import { CitationChip } from './CitationChip';
import { HITLApprovalCard } from './HITLApprovalCard';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AssistantMessageCardProps {
  message: ChatMessage;
  onInspectCitation: (citation: CitationItem) => void;
  onSelectArtifact: (artifact: ArtifactResponse) => void;
  onApproveAction: (actionId: string) => Promise<void>;
  onRejectAction: (actionId: string, reason?: string) => Promise<void>;
}

export const AssistantMessageCard: React.FC<AssistantMessageCardProps> = ({
  message,
  onInspectCitation,
  onSelectArtifact,
  onApproveAction,
  onRejectAction,
}) => {
  const isStreaming = message.isStreaming;

  return (
    <div className="flex gap-4 my-6 w-full max-w-3xl mx-auto animate-fade-in select-text">
      {/* 4-Point Star Icon (Drops In with Spring Animation) */}
      <div className="shrink-0 mt-1">
        <div className="w-7 h-7 rounded-full bg-[#2f2f2f] border border-white/[0.12] flex items-center justify-center shadow-md animate-star-drop">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Message Body Column */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. Reasoning Accordion */}
        {(message.reasoningSummary || message.executionTimeMs) && (
          <ReasoningAccordion
            summary={message.reasoningSummary || 'Thought for a few moments'}
            durationMs={message.executionTimeMs || 150}
            stages={message.reasoningDetails}
          />
        )}

        {/* 2. Tool Executions */}
        {message.tools && message.tools.length > 0 && (
          <div className="space-y-1.5">
            {message.tools.map((t) => (
              <ToolExecutionCard key={t.id} tool={t} />
            ))}
          </div>
        )}

        {/* 3. Citations Chips Row */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.citations.map((cite, idx) => (
              <CitationChip key={idx} citation={cite} onClick={onInspectCitation} />
            ))}
          </div>
        )}

        {/* 4. Human-In-The-Loop Approval Banner */}
        {message.pendingApprovals && message.pendingApprovals.length > 0 && (
          <div className="space-y-2 pt-1">
            {message.pendingApprovals.map((appr) => (
              <HITLApprovalCard
                key={appr.action_id}
                approval={appr}
                onApprove={onApproveAction}
                onReject={onRejectAction}
              />
            ))}
          </div>
        )}

        {/* 5. Natural Markdown Prose Stream & Typing Effect */}
        <div className="text-[15px] chat-prose-text leading-[1.75] font-sans prose-chat">
          {message.content ? (
            <div className="relative">
              <MarkdownRenderer
                content={message.content}
                citations={message.citations}
                onInspectCitation={onInspectCitation}
                isStreaming={isStreaming}
              />
            </div>
          ) : isStreaming ? (
            /* Multi-Color Gradient Pulse & Shimmer Wave (Blue, Violet, Coral) */
            <div className="space-y-3 py-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="shimmer-wave-text font-semibold">
                  Synthesizing verified findings...
                </span>
              </div>

              {/* Shimmering horizontal skeleton wave bars */}
              <div className="space-y-2 max-w-md pt-1">
                <div className="h-2.5 rounded-full shimmer-wave-bar border border-white/[0.04] w-full" />
                <div className="h-2.5 rounded-full shimmer-wave-bar border border-white/[0.04] w-4/5" />
                <div className="h-2.5 rounded-full shimmer-wave-bar border border-white/[0.04] w-3/5" />
              </div>
            </div>
          ) : null}
        </div>

        {/* 6. Artifact Deliverable Preview Card */}
        {message.artifacts && message.artifacts.length > 0 && (
          <div className="pt-2">
            {message.artifacts.map((art) => (
              <div
                key={art.artifact_id}
                onClick={() => onSelectArtifact(art)}
                className="group p-4 rounded-2xl bg-[#27272a] hover:bg-[#2f2f2f] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-between active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                        {art.filename}
                      </h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300">
                        {art.file_type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Click to open in Canvas · {Math.round(art.file_size_bytes / 1024)} KB · Air-Gap Signed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors text-xs font-medium">
                  <span className="hidden sm:inline">Open Canvas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
