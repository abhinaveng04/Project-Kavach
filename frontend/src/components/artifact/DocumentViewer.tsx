import React from 'react';
import { FileText, FileSpreadsheet, FileCode, CheckCircle2, Shield } from 'lucide-react';
import { ArtifactResponse } from '../../types/api';
import { MarkdownRenderer } from '../chat/MarkdownRenderer';

interface DocumentViewerProps {
  artifact: ArtifactResponse | null;
  content?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ artifact, content }) => {
  if (!artifact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <FileText className="w-10 h-10 mb-2 opacity-30 text-zinc-400" />
        <p className="text-xs">Select an artifact to view in Canvas.</p>
      </div>
    );
  }

  const ext = artifact.file_type.toLowerCase();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#18181b] overflow-y-auto p-6 space-y-4 font-sans select-text">
      {/* Document Header Card */}
      <div className="border-b border-white/[0.08] pb-4 space-y-2">
        <div className="flex items-center gap-2.5">
          {ext === 'docx' || ext === 'doc' ? (
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
          ) : ext === 'xlsx' || ext === 'csv' ? (
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileCode className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">{artifact.filename}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
              <span>{ext.toUpperCase()}</span>
              <span>•</span>
              <span>{Math.round(artifact.file_size_bytes / 1024)} KB</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Air-Gap Signed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Body View */}
      <div className="bg-[#212124] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <div className="space-y-3 text-xs font-sans text-zinc-300 leading-relaxed p-4 rounded-xl bg-[#27272a] border border-white/[0.06]">
            <h4 className="font-semibold text-white text-xs tracking-wide uppercase">
              {artifact.filename}
            </h4>
            <p className="text-zinc-400 text-xs">
              This deliverable was generated and cryptographically signed on-premise in an isolated air-gap environment.
            </p>
            <div className="border-t border-white/[0.08] pt-3 text-[11px] text-zinc-500 font-mono">
              SHA-256 Checksum: {artifact.sha256 || 'Calculated on download'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
