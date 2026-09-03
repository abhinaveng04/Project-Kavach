import React from 'react';
import { Paperclip, ExternalLink, FileText } from 'lucide-react';

interface UserMessageCardProps {
  content: string;
  timestamp: string;
  attachments?: string[];
  onSelectAttachment?: (filename: string) => void;
}

export const UserMessageCard: React.FC<UserMessageCardProps> = ({
  content,
  attachments = [],
  onSelectAttachment,
}) => {
  return (
    <div className="flex justify-end my-4 animate-message-spring select-text">
      <div className="max-w-[75%] bg-[#2f2f2f] text-white rounded-[24px] px-5 py-3.5 shadow-md space-y-2 border border-white/[0.04]">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
          {content}
        </p>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.08]">
            {attachments.map((file, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAttachment?.(file)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.1] hover:border-white/[0.25] text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm group active:scale-95 text-left"
                title={`Click to open ${file} in Canvas`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0" />
                <span className="truncate max-w-[180px] font-mono">{file}</span>
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 bg-black/40 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                  Canvas <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
