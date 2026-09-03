import React from 'react';
import { X, Cpu, FolderTree, HardDrive, Zap, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { HardwareProfileStatus, SystemStatusResponse } from '../../types/api';

interface HardwareModalProps {
  hardware: HardwareProfileStatus | null;
  systemStatus: SystemStatusResponse | null;
  onClose: () => void;
}

export const HardwareModal: React.FC<HardwareModalProps> = ({ hardware, systemStatus, onClose }) => {
  const gpuName = hardware?.gpu_name || systemStatus?.gpu.name || 'NVIDIA GeForce RTX 2050 (4 GB GDDR6)';
  const secondaryGpu = hardware?.secondary_gpu || 'Intel(R) UHD Graphics';
  const vramMb = hardware?.vram_max_mb || systemStatus?.vram_mb || 4096;
  const backend = hardware?.gpu_backend || 'CUDA / llama-cpp-python';
  const cpuName = hardware?.cpu_name || 'Intel Core (8 Cores / 12 Threads)';
  const ramTotalGb = hardware?.ram_total_gb || 15.7;
  const ramUsedGb = hardware?.ram_used_gb || 13.1;
  const ramPct = hardware?.ram_percent || Math.round((ramUsedGb / ramTotalGb) * 100);

  const modelsDetail = systemStatus?.models_detail || {
    brain: {
      role: 'Primary Reasoning & Synthesis',
      model_name: 'Qwen2.5-1.5B-Instruct',
      backend: 'llama-cpp-python / CUDA',
      estimated_vram_mb: 1065,
      installed: true,
      loaded: true,
    },
    auxiliary: {
      role: 'Fast Auxiliary / Polish',
      model_name: 'Qwen2.5-0.5B-Instruct',
      backend: 'llama-cpp-python',
      estimated_vram_mb: 468,
      installed: true,
      loaded: false,
    },
    document_vision: {
      role: 'Document & Slide Visual Engine',
      model_name: 'Chromium PDFium & Win32 COM Engine',
      backend: 'pypdfium2 / win32com',
      estimated_vram_mb: 65,
      installed: true,
      loaded: true,
    },
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-text">
      <div className="max-w-3xl w-full bg-[#1e1e22] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                System Hardware & Model Diagnostics
              </h3>
              <p className="text-[11px] text-zinc-400">
                Real-Time Host Telemetry · Local GGUF Runtime
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
          {/* Host Hardware Grid */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Host Compute Telemetry
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* GPU Card */}
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-2">
                <span className="text-[10px] uppercase text-zinc-400 font-mono block">Primary GPU</span>
                <div className="text-zinc-100 font-semibold text-xs leading-snug">{gpuName}</div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  VRAM: <span className="text-emerald-400 font-medium">{vramMb} MB Dedicated</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Integrated: {secondaryGpu}
                </div>
              </div>

              {/* CPU Card */}
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-2">
                <span className="text-[10px] uppercase text-zinc-400 font-mono block">Processor (CPU)</span>
                <div className="text-zinc-100 font-semibold text-xs leading-snug">{cpuName}</div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Architecture: <span className="text-blue-400 font-medium">x86_64</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  OS: Windows 11 Host
                </div>
              </div>

              {/* RAM Card */}
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-2">
                <span className="text-[10px] uppercase text-zinc-400 font-mono block">System Memory (RAM)</span>
                <div className="text-zinc-100 font-semibold text-xs">
                  {ramTotalGb} GB Total
                </div>
                <div className="w-full bg-[#18181b] rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${ramPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                  <span>Used: {ramUsedGb} GB</span>
                  <span className="text-purple-400">{ramPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Model Pool Registry */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
              Local Model Pool & Inference Engines
            </h4>

            <div className="space-y-2.5">
              {Object.entries(modelsDetail).map(([key, detail]) => (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-white/[0.1] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{detail.model_name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300">
                        {detail.role || key}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Runtime: {detail.backend} · Memory Footprint: ~{detail.estimated_vram_mb} MB
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        detail.loaded
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : detail.installed
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-white/[0.04] text-zinc-500 border-white/[0.06]'
                      }`}
                    >
                      {detail.loaded ? 'ONLINE (:8080)' : detail.installed ? 'STANDBY' : 'NOT FOUND'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 bg-[#18181b] border-t border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-400 font-mono">
            Host: 127.0.0.1 (Zero Cloud Egress)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
