import React, { useState } from 'react';
import { X, Maximize2, Minimize2, FileText, Bookmark, GitBranch, Download, ExternalLink, Boxes } from 'lucide-react';
import { ArtifactResponse, CitationItem } from '../../types/api';
import { DocumentViewer } from './DocumentViewer';
import { ArtifactVersionHistory } from './ArtifactVersionHistory';
import { ArtifactExportBar } from './ArtifactExportBar';

interface ArtifactWorkspaceProps {
  artifact: ArtifactResponse | null;
  artifactsList: ArtifactResponse[];
  citations?: CitationItem[];
  onClose: () => void;
  onSelectArtifact: (art: ArtifactResponse) => void;
  onInspectCitation?: (citation: CitationItem) => void;
}

export const ArtifactWorkspace: React.FC<ArtifactWorkspaceProps> = ({
  artifact,
  artifactsList,
  citations = [],
  onClose,
  onSelectArtifact,
  onInspectCitation,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'evidence' | 'versions'>('preview');
  const [isMaximized, setIsMaximized] = useState(false);

  if (!artifact) return null;

  return (
    <div
      className={`bg-[#1e1e20] border-l border-white/[0.08] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
        isMaximized ? 'fixed inset-y-0 right-0 w-full md:w-3/4 shadow-2xl z-40' : 'w-full lg:w-[480px] xl:w-[540px]'
      }`}
    >
      {/* Canvas Top Header */}
      <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left Segmented Pill Controls */}
        <div className="flex items-center gap-1 bg-[#27272a] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-[#38383c] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'evidence'
                ? 'bg-[#38383c] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Evidence ({citations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'versions'
                ? 'bg-[#38383c] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Versions ({artifactsList.length})</span>
          </button>
        </div>

        {/* Right Window Actions */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] hover:text-white transition-colors"
            title={isMaximized ? 'Restore View' : 'Maximize Canvas'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] hover:text-white transition-colors"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#18181b]">
        {activeTab === 'preview' && <DocumentViewer artifact={artifact} content={artifact.content} />}

        {activeTab === 'evidence' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
            <div className="border-b border-white/[0.08] pb-2">
              <h4 className="font-semibold text-white">Linked SOP & Inspection Evidence</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Verified cross-references from the local RAG knowledge index and vision parser.
              </p>
            </div>
            {citations.length > 0 ? (
              <div className="space-y-3">
                {citations.map((cite, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-blue-400">{cite.citation_tag}</span>
                      <span className="text-[11px] text-zinc-400">{cite.filename}</span>
                    </div>
                    {cite.snippet && (
                      <p className="text-xs text-zinc-200 italic bg-[#1e1e20] p-3 rounded-xl border border-white/[0.06] leading-relaxed">
                        "{cite.snippet}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">No citations linked to this deliverable.</p>
            )}
          </div>
        )}

        {activeTab === 'versions' && (
          <ArtifactVersionHistory
            artifact={artifact}
            artifactsList={artifactsList}
            onSelectArtifact={onSelectArtifact}
          />
        )}
      </div>

      {/* Export Bar at Bottom */}
      <ArtifactExportBar artifact={artifact} />
    </div>
  );
};
