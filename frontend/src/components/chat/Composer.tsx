import React, { useRef, useState } from 'react';
import {
  ArrowUp,
  Paperclip,
  X,
  Square,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { api } from '../../api/client';

interface ComposerProps {
  onSendMessage: (message: string, attachments: string[]) => void;
  isExecuting: boolean;
  onStopExecution?: () => void;
  attachedFiles: string[];
  onAddAttachment: (filename: string) => void;
  onRemoveAttachment: (index: number) => void;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isExecuting,
  onStopExecution,
  attachedFiles,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isExecuting) return;
    onSendMessage(text.trim(), attachedFiles);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        onAddAttachment(file.name);
        try {
          await api.uploadFile(file);
        } catch (err) {
          console.error('Failed to upload file:', file.name, err);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        onAddAttachment(file.name);
        try {
          await api.uploadFile(file);
        } catch (err) {
          console.error('Failed to upload file:', file.name, err);
        }
      }
    }
  };

  const canSubmit = text.trim().length > 0 && !isExecuting;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent shrink-0 z-20"
    >
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Attachment chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pb-1 animate-slide-up">
            {attachedFiles.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2f2f2f] border border-white/[0.12] text-xs font-mono text-zinc-200 shadow-sm"
              >
                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[160px]">{file}</span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(idx)}
                  className="hover:text-rose-400 transition-colors ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Floating Capsule Container */}
        <div
          className={cn(
            'relative rounded-[28px] bg-[#2f2f2f] border border-white/[0.1] capsule-shadow transition-all duration-200 focus-within:border-white/[0.22] p-3 px-4',
            isDragging && 'border-blue-500 ring-2 ring-blue-500/20 bg-[#353535]'
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder={
              isExecuting
                ? 'Kavach is reasoning and executing tools...'
                : 'Message KAVACH Sovereign (MRPL / MoPNG)...'
            }
            className="w-full bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[200px] leading-relaxed pr-12"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between pt-1 mt-1 border-t border-white/[0.04]">
            {/* Left Tools & Attachments */}
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExecuting}
                className="p-2 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all"
                title="Attach Document / P&ID (PDF, XLSX, DOCX)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] font-medium text-zinc-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Agentic Reasoning</span>
              </span>
            </div>

            {/* Right: Circular Action Button */}
            <div>
              {isExecuting ? (
                <button
                  type="button"
                  onClick={onStopExecution}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95"
                  title="Stop Generating"
                >
                  <Square className="w-3.5 h-3.5 fill-black" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!canSubmit}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95',
                    canSubmit
                      ? 'bg-white text-black hover:opacity-90'
                      : 'bg-white/[0.12] text-zinc-500 cursor-not-allowed'
                  )}
                  title="Send Message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <p className="text-[11px] text-center text-zinc-500 font-sans select-none">
          KAVACH runs 100% sovereign on-premise for MRPL / MoPNG (SIH26117). All reasoning, tool sandboxes, and embeddings execute locally.
        </p>
      </div>
    </div>
  );
};
