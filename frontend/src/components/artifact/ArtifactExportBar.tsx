import React, { useState } from 'react';
import { Download, Copy, Check, ShieldCheck } from 'lucide-react';
import { ArtifactResponse } from '../../types/api';

interface ArtifactExportBarProps {
  artifact: ArtifactResponse | null;
  onApprove?: () => void;
}

export const ArtifactExportBar: React.FC<ArtifactExportBarProps> = ({ artifact }) => {
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const handleDownload = () => {
    const url = artifact.download_url || `/artifacts/${artifact.artifact_id}/download`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = artifact.download_url || `/artifacts/${artifact.artifact_id}/download`;
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-14 bg-[#18181b] border-t border-white/[0.08] px-4 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">Provenance Verified</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#323236] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy URI'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-black hover:opacity-90 transition-all font-semibold text-xs shadow-md active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
