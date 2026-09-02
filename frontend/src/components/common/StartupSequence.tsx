import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Cpu, Lock, Check } from 'lucide-react';
import { SystemStatusResponse } from '../../types/api';

interface StartupSequenceProps {
  status: SystemStatusResponse | null;
  onComplete: () => void;
}

export const StartupSequence: React.FC<StartupSequenceProps> = ({ status, onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 380);
    const t3 = setTimeout(() => setPhase(3), 580);
    const t4 = setTimeout(() => onComplete(), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#171717] z-50 flex items-center justify-center animate-fade-in select-none">
      <div className="max-w-sm w-full p-6 text-center space-y-6">
        {/* Neural Breathing Orb */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-rose-500 blur-lg opacity-40 animate-pulse-glow" />
          <div className="relative w-14 h-14 rounded-full bg-[#212121] border border-white/[0.12] flex items-center justify-center shadow-2xl">
            <Sparkles className="w-7 h-7 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-medium tracking-tight text-white flex items-center justify-center gap-2">
            <span>KAVACH</span>
            <span className="text-[11px] font-mono text-zinc-400 bg-[#2f2f2f] px-2 py-0.5 rounded-full border border-white/[0.08]">
              Sovereign · MRPL
            </span>
          </h1>
          <p className="text-xs neural-gradient-text font-medium">
            {phase === 0 && 'Initializing sovereign compute spaces...'}
            {phase === 1 && 'Enforcing kernel-level airgap guard...'}
            {phase === 2 && 'Mounting local neural inference engine...'}
            {phase >= 3 && 'Workbench ready'}
          </p>
        </div>

        {/* Minimalist Micro Progress Line */}
        <div className="w-48 mx-auto h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 transition-all duration-300 ease-out"
            style={{ width: `${((phase + 1) / 4) * 100}%` }}
          />
        </div>

        <p className="text-[11px] text-zinc-500 font-mono">
          {status?.gpu?.name ? `${status.gpu.name} · 100% On-Premise` : 'Localhost strictly enforced'}
        </p>
      </div>
    </div>
  );
};
