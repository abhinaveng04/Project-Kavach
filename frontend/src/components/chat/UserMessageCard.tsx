import React from 'react';
import { Paperclip } from 'lucide-react';

interface UserMessageCardProps {
  content: string;
  timestamp: string;
  attachments?: string[];
}

export const UserMessageCard: React.FC<UserMessageCardProps> = ({
  content,
  attachments = [],
}) => {
  return (
    <div className="flex justify-end my-4 animate-message-spring select-text">
      <div className="max-w-[75%] bg-[#2f2f2f] text-white rounded-[24px] px-5 py-3.5 shadow-md space-y-2 border border-white/[0.04]">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
          {content}
        </p>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.08]">
            {attachments.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] text-xs font-mono text-zinc-300"
              >
                <Paperclip className="w-3 h-3 text-blue-400" />
                <span className="truncate max-w-[160px]">{file}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
