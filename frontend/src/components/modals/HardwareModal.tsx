import React from 'react';
import { X, Cpu, FolderTree, CheckCircle2 } from 'lucide-react';
import { HardwareProfileStatus, SystemStatusResponse } from '../../types/api';

interface HardwareModalProps {
  hardware: HardwareProfileStatus | null;
  systemStatus: SystemStatusResponse | null;
  onClose: () => void;
}

export const HardwareModal: React.FC<HardwareModalProps> = ({ hardware, systemStatus, onClose }) => {
  const gpuName = hardware?.gpu_name || systemStatus?.gpu.name || 'Hardware Accelerator';
  const vramMb = hardware?.vram_max_mb || systemStatus?.vram_mb || 4096;
  const backend = hardware?.gpu_backend || 'CUDA';
  const profileName = hardware?.profile || 'dev_4gb';
  const profileDesc = hardware?.profile_description || 'Local hardware development profile';

  const modelsDetail = systemStatus?.models_detail || {};

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-text">
      <div className="max-w-3xl w-full bg-[#212124] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Hardware Abstraction & Model Pool
              </h3>
              <p className="text-[11px] text-zinc-400">
                Dynamic Compute Profile · Adaptive VRAM Allocation
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
          {/* Active Hardware Profile */}
          <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">Profile: {profileName}</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 font-mono">
                {profileDesc}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-mono">Primary Device</span>
                <span className="text-zinc-200 font-medium text-xs">{gpuName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-mono">Compute Backend</span>
                <span className="text-emerald-400 font-medium text-xs">{backend}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-mono">VRAM Budget</span>
                <span className="text-blue-400 font-medium text-xs font-mono">
                  {vramMb} MB ({Math.round(vramMb / 1024)} GB)
                </span>
              </div>
            </div>
          </div>

          {/* Model Pool Registry */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
              Sovereign Model Pool Registry
            </h4>

            <div className="space-y-2">
              {Object.entries(modelsDetail).map(([role, detail]) => (
                <div
                  key={role}
                  className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white uppercase text-xs">{role}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">({detail.model_name})</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Backend: {detail.backend} · Footprint: ~{detail.estimated_vram_mb} MB VRAM
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        detail.installed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-white/[0.04] text-zinc-500 border-white/[0.06]'
                      }`}
                    >
                      {detail.installed ? 'READY' : 'NOT INSTALLED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 bg-[#18181b] border-t border-white/[0.08] px-6 flex items-center justify-end shrink-0">
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
