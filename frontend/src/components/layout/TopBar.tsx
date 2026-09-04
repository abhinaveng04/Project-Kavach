import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Cpu,
  Shield,
} from 'lucide-react';
import { SystemStatusResponse, HardwareProfileStatus } from '../../types/api';

interface TopBarProps {
  systemStatus: SystemStatusResponse | null;
  hardwareStatus: HardwareProfileStatus | null;
  sessionTitle: string;
  onOpenSovereignty: () => void;
  onOpenHardware: () => void;
  onOpenUpload?: () => void;
  onOpenAudit?: () => void;
  onOpenDebug?: () => void;
  onRunTestEgress?: () => void;
  onNewSession?: () => void;
  isTestingEgress: boolean;
  egressPassed: boolean | null;
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  systemStatus,
  hardwareStatus,
  sessionTitle,
  onOpenSovereignty,
  onOpenHardware,
  onRunTestEgress,
  isTestingEgress,
  egressPassed,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const isSovereign = systemStatus?.sovereignty.offline_only ?? true;
  const gpuName = hardwareStatus?.gpu_name || systemStatus?.gpu.name || 'Local GPU';
  const vramMb = hardwareStatus?.vram_max_mb || systemStatus?.vram_mb || 4096;

  return (
    <header className="h-14 bg-[#161619]/95 backdrop-blur-md border-b border-white/[0.08] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-all text-sm font-semibold text-zinc-900 dark:text-white group active:scale-95"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-zinc-900 dark:text-white font-semibold">KAVACH Sovereign</span>
          </span>
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">MRPL</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
        </button>

        {/* Model Dropdown Menu */}
        {modelDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setModelDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#1f1f23] border border-white/[0.14] shadow-2xl p-2.5 z-40 animate-scale-in text-xs rim-highlight">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Active Sovereign Models</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">100% OFFLINE</span>
              </div>

              {/* Dynamic Active Model List */}
              <div className="space-y-1.5 my-1">
                {/* Brain / CEO Model */}
                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-white font-medium text-[11px]">
                        {systemStatus?.models_detail?.brain?.model_name || 'Qwen3-1.7B'}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Primary Reasoning (CEO) · {systemStatus?.models_detail?.brain?.device?.includes('RTX') ? 'RTX 2050' : 'GPU'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                {/* Auxiliary / Finalizer Model */}
                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-white font-medium text-[11px]">
                        {systemStatus?.models_detail?.auxiliary?.model_name || 'Qwen3-0.6B'}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Output Finalizer & Reviewer · Host CPU
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                {/* Multimodal Vision */}
                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-white font-medium text-[11px]">
                        {systemStatus?.models_detail?.vision?.model_name || 'Qwen2.5-VL-3B'}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Vision & Technical OCR · Port 8081
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                {/* Vector Embeddings */}
                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-white font-medium text-[11px]">
                        {systemStatus?.models_detail?.embedding?.model_name || 'nomic-embed-text-v1.5'}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        768-dim Vectors · ChromaDB RAG
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-1.5 text-zinc-300 border-t border-white/[0.08] pt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Primary GPU:</span>
                  <span className="text-white font-mono truncate max-w-[140px] text-right">{gpuName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">VRAM Allocation:</span>
                  <span className="text-emerald-400 font-mono">{vramMb} MB</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Compute Backend:</span>
                  <span className="text-white font-mono">{hardwareStatus?.gpu_backend || 'CUDA / llama-cpp'}</span>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-1">
                <button
                  onClick={() => {
                    setModelDropdownOpen(false);
                    onOpenHardware();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors text-[11px] flex items-center justify-between"
                >
                  <span>Hardware & Model Diagnostics</span>
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center Session Title */}
      <div className="hidden md:flex items-center gap-2 max-w-sm truncate text-xs text-zinc-300 font-medium">
        <span className="truncate">{sessionTitle || 'New Task'}</span>
      </div>

      {/* Right Controls: Consolidated Sovereign Status Badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onRunTestEgress?.();
            onOpenSovereignty();
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            egressPassed === true
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
              : egressPassed === false
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-[#27272a] hover:bg-[#323236] border-white/[0.08] text-zinc-300 hover:text-white'
          }`}
          title="Open Sovereign Air-Gap & Security Dashboard"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              egressPassed === true
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : egressPassed === false
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="font-medium">
            {isTestingEgress
              ? 'Testing...'
              : egressPassed === true
              ? 'Sovereign Air-Gap · Verified'
              : egressPassed === false
              ? 'Egress Detected'
              : 'Sovereign Air-Gap'}
          </span>
          <Shield className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>
    </header>
  );
};
