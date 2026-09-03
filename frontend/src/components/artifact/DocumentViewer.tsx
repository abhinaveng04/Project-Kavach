import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Shield,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ArtifactResponse } from '../../types/api';
import { MarkdownRenderer } from '../chat/MarkdownRenderer';

interface DocumentViewerProps {
  artifact: ArtifactResponse | null;
  content?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ artifact, content }) => {
  const [copied, setCopied] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');

  // Split content into slides/pages if delimiter exists
  const rawContent = content || artifact?.content || '';
  const pages = useMemo(() => {
    if (!rawContent) return [];
    if (rawContent.includes('\n\n---\n\n')) {
      return rawContent.split('\n\n---\n\n').map((p) => p.trim()).filter(Boolean);
    }
    return [rawContent];
  }, [rawContent]);

  if (!artifact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <FileText className="w-10 h-10 mb-2 opacity-30 text-zinc-400" />
        <p className="text-xs">Select an attached document or artifact to view in Canvas.</p>
      </div>
    );
  }

  const ext = (artifact.file_type || '').toLowerCase();
  const isPdf = ext === 'pdf';
  const isSpreadsheet = ext === 'xlsx' || ext === 'csv' || ext === 'xls';
  const isDoc = ext === 'docx' || ext === 'doc';
  const isPresentation = ext === 'pptx' || ext === 'ppt';
  const hasMultiplePages = pages.length > 1;

  const handleCopyText = () => {
    const textToCopy = hasMultiplePages && viewMode === 'single' ? pages[activePageIndex] : rawContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const url = artifact.download_url || `/artifacts/${artifact.artifact_id}/download`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#18181b] overflow-y-auto p-6 space-y-4 font-sans select-text">
      {/* Document Header Card */}
      <div className="bg-[#212124] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {isPdf ? (
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            ) : isDoc ? (
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            ) : isSpreadsheet ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
            ) : isPresentation ? (
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight break-all">
                {artifact.filename}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono mt-1">
                <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-300 font-semibold uppercase">
                  {ext || 'DOC'}
                </span>
                <span>•</span>
                <span>{Math.round(artifact.file_size_bytes / 1024)} KB</span>
                {hasMultiplePages && (
                  <>
                    <span>•</span>
                    <span className="text-blue-400 font-medium">{pages.length} Slides / Pages</span>
                  </>
                )}
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans text-[11px]">
                  <Shield className="w-3 h-3" />
                  Air-Gap Verified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-all text-xs"
              title="Copy Text to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm active:scale-95"
              title="Download Original File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Multi-Page Slide Navigation Bar */}
        {hasMultiplePages && (
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'all' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Slides
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'single' ? 'bg-[#27272a] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Slide by Slide
              </button>
            </div>

            {viewMode === 'single' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
                  disabled={activePageIndex === 0}
                  className="p-1 rounded-lg hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-zinc-300 font-mono text-xs">
                  {activePageIndex + 1} / {pages.length}
                </span>
                <button
                  onClick={() => setActivePageIndex(Math.min(pages.length - 1, activePageIndex + 1))}
                  disabled={activePageIndex === pages.length - 1}
                  className="p-1 rounded-lg hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Content Canvas */}
      {rawContent ? (
        hasMultiplePages && viewMode === 'single' ? (
          /* Single Slide View */
          <div className="bg-[#212124] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">
                Slide {activePageIndex + 1} of {pages.length}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {pages[activePageIndex].length} chars
              </span>
            </div>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed">
              <MarkdownRenderer content={pages[activePageIndex]} />
            </div>
          </div>
        ) : hasMultiplePages && viewMode === 'all' ? (
          /* All Slides Stacked View */
          <div className="space-y-4">
            {pages.map((pageText, idx) => (
              <div
                key={idx}
                className="bg-[#212124] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4 transition-all hover:border-white/[0.14]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Slide {idx + 1} of {pages.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Page {idx + 1}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  <MarkdownRenderer content={pageText} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Standard Single Document View */
          <div className="bg-[#212124] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed">
              <MarkdownRenderer content={rawContent} />
            </div>
          </div>
        )
      ) : (
        <div className="bg-[#212124] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="space-y-3 text-xs font-sans text-zinc-300 leading-relaxed p-4 rounded-xl bg-[#27272a] border border-white/[0.06]">
            <h4 className="font-semibold text-white text-xs tracking-wide uppercase">
              {artifact.filename}
            </h4>
            <p className="text-zinc-400 text-xs">
              This document is stored locally on-premise in the air-gapped repository.
            </p>
            <div className="border-t border-white/[0.08] pt-3 text-[11px] text-zinc-500 font-mono">
              SHA-256 Checksum: {artifact.sha256 || 'Calculated on download'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
