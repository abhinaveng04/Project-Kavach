import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2, FileText, Bookmark, GitBranch, Download, ExternalLink, Boxes, GripVertical } from 'lucide-react';
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

  // Resizable panel width state
  const [width, setWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kavach_canvas_width');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 360 && val <= 1400) {
          return val;
        }
      }
    } catch {}
    return 560;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartWidthRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Side panel is docked on the right, so moving mouse left increases width
      const deltaX = dragStartXRef.current - e.clientX;
      const minWidth = 360;
      const maxWidth = Math.min(window.innerWidth - 380, 1200);
      const newWidth = Math.min(Math.max(minWidth, dragStartWidthRef.current + deltaX), maxWidth);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  useEffect(() => {
    try {
      localStorage.setItem('kavach_canvas_width', width.toString());
    } catch {}
  }, [width]);

  const handleDoubleClickResizer = () => {
    setWidth(560);
  };

  if (!artifact) return null;

  return (
    <div
      style={!isMaximized ? { width: `${width}px` } : undefined}
      className={`relative bg-[#1e1e20] border-l border-white/[0.08] flex flex-col justify-between z-10 shrink-0 ${
        isDragging ? 'select-none' : 'transition-[width] duration-150 ease-out'
      } ${
        isMaximized
          ? 'fixed inset-y-0 right-0 w-full md:w-3/4 shadow-2xl z-40'
          : 'max-w-[90vw]'
      }`}
    >
      {/* Draggable Resize Edge Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClickResizer}
          className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-30 group flex items-center justify-center select-none"
          title="Drag to resize panel (Double-click to reset)"
        >
          <div
            className={`w-1 h-full transition-all duration-150 ${
              isDragging
                ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                : 'bg-transparent group-hover:bg-purple-500/60'
            }`}
          />
          {/* Subtle grab pill in center */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-10 rounded-full bg-[#27272a] border border-white/20 flex flex-col items-center justify-center gap-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              isDragging ? 'opacity-100 bg-purple-600 border-purple-400' : ''
            }`}
          >
            <div className="w-0.5 h-1.5 rounded-full bg-zinc-400" />
            <div className="w-0.5 h-1.5 rounded-full bg-zinc-400" />
          </div>
        </div>
      )}
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
