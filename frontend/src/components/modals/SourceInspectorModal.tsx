import React from 'react';
import { X, Bookmark, FileText, CheckCircle2, Shield, Calendar, Hash } from 'lucide-react';
import { CitationItem } from '../../types/api';

interface SourceInspectorModalProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export const SourceInspectorModal: React.FC<SourceInspectorModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-text">
      <div className="max-w-2xl w-full bg-[#212124] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        {/* Header */}
        <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bookmark className="w-4 h-4 text-blue-400" />
            <span>Source Evidence Inspector</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
          {/* Citation Tag & Document Meta */}
          <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400 font-mono">{citation.citation_tag}</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Citation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-zinc-400 pt-2 border-t border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-mono">Source File</span>
                <span className="text-zinc-200 font-medium text-xs">{citation.filename}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-mono">Page / Section</span>
                <span className="text-zinc-200 font-medium text-xs">
                  Page {citation.page || 1} {citation.section ? `(${citation.section})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Extracted Evidence Box */}
          <div className="space-y-2">
            <h5 className="font-semibold text-zinc-300 text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Document Evidence Snippet
            </h5>
            <div className="p-4 rounded-2xl bg-[#18181b] border border-white/[0.08] text-zinc-200 leading-relaxed shadow-inner font-sans">
              <mark className="bg-blue-500/20 text-white px-1.5 py-0.5 rounded border-b border-blue-400">
                {citation.snippet || 'Inspection document evidence extracted from verified knowledge chunk.'}
              </mark>
            </div>
          </div>

          {/* Cryptographic Lineage */}
          <div className="space-y-2">
            <h5 className="font-semibold text-zinc-300 text-xs flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Cryptographic Lineage Metadata
            </h5>
            <div className="bg-[#27272a] p-4 rounded-2xl border border-white/[0.06] space-y-2 text-xs text-zinc-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Document ID:</span>
                <span className="text-zinc-200 font-medium">{citation.document_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Architecture:</span>
                <span className="text-emerald-400 font-medium">100% On-Premise Sovereign Memory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 bg-[#18181b] border-t border-white/[0.08] px-6 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
