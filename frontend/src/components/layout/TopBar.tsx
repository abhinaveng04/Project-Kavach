import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Cpu,
  Radio,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Shield,
  Layers,
  SquarePen,
  Moon,
  Sun,
  Settings,
} from 'lucide-react';
import { SystemStatusResponse, HardwareProfileStatus } from '../../types/api';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  systemStatus: SystemStatusResponse | null;
  hardwareStatus: HardwareProfileStatus | null;
  sessionTitle: string;
  onOpenSovereignty: () => void;
  onOpenHardware: () => void;
  onOpenUpload: () => void;
  onOpenAudit: () => void;
  onOpenDebug: () => void;
  onRunTestEgress: () => void;
  onNewSession: () => void;
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
  onOpenUpload,
  onOpenAudit,
  onOpenDebug,
  onRunTestEgress,
  onNewSession,
  isTestingEgress,
  egressPassed,
  onOpenSettings,
}) => {
  const { isDark, toggleDarkMode } = useTheme();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const isSovereign = systemStatus?.sovereignty.offline_only ?? true;
  const gpuName = hardwareStatus?.gpu_name || systemStatus?.gpu.name || 'Local GPU';
  const vramMb = hardwareStatus?.vram_max_mb || systemStatus?.vram_mb || 4096;

  return (
    <header className="h-14 bg-[#212121] border-b border-white/[0.08] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Model Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] transition-all text-sm font-semibold text-white group"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>KAVACH Sovereign</span>
          </span>
          <span className="text-xs font-normal text-zinc-400">MRPL</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>

        {/* Model Dropdown Menu */}
        {modelDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setModelDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#2f2f2f] border border-white/[0.12] shadow-2xl p-2 z-40 animate-scale-in text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.05] space-y-1 mb-1">
                <div className="flex items-center justify-between text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Qwen 2.5 Brain (Survival Mode)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Kavach sovereign reasoning engine (MRPL / MoPNG). Running locally with LangGraph ReAct orchestration.
                </p>
              </div>

              <div className="p-2 space-y-2 text-zinc-300 border-t border-white/[0.08] pt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Hardware Profile:</span>
                  <span className="text-white font-mono">{hardwareStatus?.profile || 'dev_4gb'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">VRAM Allocation:</span>
                  <span className="text-emerald-400 font-mono">{vramMb} MB</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Compute Backend:</span>
                  <span className="text-white font-mono">{hardwareStatus?.gpu_backend || 'CUDA/Vulkan'}</span>
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
                  <span>Open Hardware & Model Pool</span>
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center Session Title */}
      <div className="hidden md:flex items-center gap-2 max-w-sm truncate text-xs text-zinc-400 font-mono">
        <span className="truncate">{sessionTitle || 'New Session'}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Test Egress Button */}
        <button
          onClick={onRunTestEgress}
          disabled={isTestingEgress}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            egressPassed === true
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-[#2f2f2f] hover:bg-[#383838] border-white/[0.08] text-zinc-300 hover:text-white'
          }`}
          title="Run Tri-Probe Air-Gap Verification"
        >
          <Radio className={`w-3.5 h-3.5 ${isTestingEgress ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">
            {isTestingEgress ? 'Testing...' : egressPassed === true ? 'Air-Gap Verified' : 'Test Egress'}
          </span>
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-white transition-all"
          title="Upload Document (PDF, XLSX, P&ID)"
        >
          <UploadCloud className="w-4 h-4 text-blue-400" />
        </button>

        {/* Sovereignty Badge */}
        <button
          onClick={onOpenSovereignty}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all"
          title="Sovereignty & Air-Gap Dashboard"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="hidden lg:inline text-emerald-400">Sovereign</span>
        </button>

        {/* Audit Lineage */}
        <button
          onClick={onOpenAudit}
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-white transition-all"
          title="Audit Trail & Lineage Explorer"
        >
          <FileCheck className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Developer Context Introspection */}
        <button
          onClick={onOpenDebug}
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-purple-400 transition-all"
          title="Developer Context & Runtime Introspection"
        >
          <Layers className="w-4 h-4 text-purple-400" />
        </button>

        {/* New Chat Icon Button */}
        <button
          onClick={onNewSession}
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-white transition-all"
          title="New Task"
        >
          <SquarePen className="w-4 h-4 text-zinc-300" />
        </button>

        {/* Quick Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-white transition-all"
          title={isDark ? 'Switch to Daylight / Light Paper Mode' : 'Switch to Dark Obsidian Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
        </button>

        {/* Settings & Themes Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#383838] border border-white/[0.08] text-zinc-300 hover:text-purple-400 transition-all"
            title="Settings & Themes"
          >
            <Settings className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>
    </header>
  );
};
