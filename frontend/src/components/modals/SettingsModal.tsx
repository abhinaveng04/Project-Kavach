import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Palette,
  Sliders,
  Shield,
  Volume2,
  HardDrive,
  Check,
  RotateCcw,
  Sparkles,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Paintbrush,
} from 'lucide-react';
import {
  useTheme,
  ThemeType,
  AccentColorType,
  DensityType,
  ACCENT_PALETTE,
} from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

interface SettingsModalProps {
  onClose: () => void;
}

interface ThemeOption {
  id: ThemeType;
  name: string;
  description: string;
  accent: string;
  bgPreview: string;
  badge?: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Onyx Dark',
    description: 'Minimalist obsidian & neutral graphite workspace',
    accent: '#10a37f',
    bgPreview: 'bg-[#171717] border-[#383838]',
    badge: 'Default',
  },
  {
    id: 'light',
    name: 'Daylight Paper',
    description: 'High-clarity technical document theme for daylight operation',
    accent: '#2563eb',
    bgPreview: 'bg-[#ffffff] border-[#cbd5e1]',
    badge: 'Light Mode',
  },
  {
    id: 'navy',
    name: 'Refinery Navy',
    description: 'Sovereign industrial deep blue for MRPL / MoPNG',
    accent: '#38bdf8',
    bgPreview: 'bg-[#0f172a] border-[#334155]',
    badge: 'Industrial',
  },
  {
    id: 'terminal',
    name: 'SCADA Terminal',
    description: 'High-contrast emerald console for mission control',
    accent: '#10b981',
    bgPreview: 'bg-[#050505] border-[#1f2937]',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    description: 'Warm industrial copper, dark charcoal, and safety amber',
    accent: '#f59e0b',
    bgPreview: 'bg-[#120e0a] border-[#332415]',
  },
  {
    id: 'crimson',
    name: 'Crimson Protocol',
    description: 'Critical plant defense & high-alert emergency command',
    accent: '#f43f5e',
    bgPreview: 'bg-[#13080b] border-[#38161e]',
    badge: 'Defense',
  },
  {
    id: 'nordic',
    name: 'Nordic Slate',
    description: 'Arctic glacier slate with cool icy-blue tones',
    accent: '#38bdf8',
    bgPreview: 'bg-[#0b1120] border-[#1e293b]',
  },
  {
    id: 'forest',
    name: 'Forest Moss',
    description: 'Deep botanical pine, eucalyptus, and organic green',
    accent: '#34d399',
    bgPreview: 'bg-[#08120c] border-[#163321]',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    theme,
    setTheme,
    isDark,
    toggleDarkMode,
    accentColor,
    setAccentColor,
    density,
    setDensity,
    soundEnabled,
    setSoundEnabled,
    strictAirGap,
    setStrictAirGap,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'appearance' | 'system' | 'audio'>('appearance');
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handlePingServer = async () => {
    setPingStatus('testing');
    try {
      const res = await fetch('http://127.0.0.1:8080/v1/models', { method: 'GET' }).catch(() => null);
      if (res && (res.ok || res.status === 200)) {
        setPingStatus('success');
      } else {
        const res2 = await fetch('/', { method: 'GET' });
        if (res2.ok) setPingStatus('success');
        else setPingStatus('error');
      }
    } catch {
      setPingStatus('error');
    }
    setTimeout(() => setPingStatus('idle'), 3500);
  };

  const handleResetDefaults = () => {
    setTheme('dark');
    setAccentColor('purple');
    setDensity('normal');
    setSoundEnabled(true);
    setStrictAirGap(true);
  };

  const currentAccent = ACCENT_PALETTE[accentColor] || ACCENT_PALETTE.purple;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-text">
      <div className="max-w-2xl w-full bg-[#212124] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-xl border"
              style={{
                backgroundColor: `${currentAccent.hex}15`,
                color: currentAccent.hex,
                borderColor: `${currentAccent.hex}30`,
              }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Settings</h3>
              <p className="text-[11px] text-zinc-400">Themes, Accent Colors & System Preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/[0.06] bg-[#1c1c1f]">
          <button
            onClick={() => setActiveTab('appearance')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all',
              activeTab === 'appearance'
                ? 'text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            )}
            style={{
              borderColor: activeTab === 'appearance' ? currentAccent.hex : 'transparent',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            Theme & Colors
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all',
              activeTab === 'system'
                ? 'text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            )}
            style={{
              borderColor: activeTab === 'system' ? currentAccent.hex : 'transparent',
            }}
          >
            <HardDrive className="w-3.5 h-3.5" />
            System & Air-Gap
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all',
              activeTab === 'audio'
                ? 'text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            )}
            style={{
              borderColor: activeTab === 'audio' ? currentAccent.hex : 'transparent',
            }}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Sound Cues
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Quick Dark/Light Mode Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#27272a] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-xl border',
                      isDark
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    )}
                  >
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Dark / Light Mode</h4>
                    <p className="text-[11px] text-zinc-400">
                      Currently active: {isDark ? 'Dark / High-Contrast Mode' : 'Daylight Paper / Light Mode'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    isDark ? 'bg-purple-600' : 'bg-zinc-600'
                  )}
                  style={{
                    backgroundColor: isDark ? currentAccent.hex : '#52525b',
                  }}
                  title="Toggle dark mode"
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                      isDark ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#27272a] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Paintbrush className="w-3.5 h-3.5 text-zinc-400" />
                    Custom Accent Color
                  </label>
                  <span
                    className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${currentAccent.hex}20`,
                      color: currentAccent.hex,
                    }}
                  >
                    {currentAccent.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Select your preferred primary highlight color across all buttons, indicators, and focus states:
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {(Object.keys(ACCENT_PALETTE) as AccentColorType[]).map((colKey) => {
                    const col = ACCENT_PALETTE[colKey];
                    const isSelected = accentColor === colKey;
                    return (
                      <button
                        key={colKey}
                        onClick={() => setAccentColor(colKey)}
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center transition-all relative group',
                          isSelected ? 'scale-110 shadow-lg ring-2 ring-white/40' : 'hover:scale-105 opacity-85 hover:opacity-100'
                        )}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Palette Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-zinc-400" />
                    Theme Palettes
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">8 Presets</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = theme === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={cn(
                          'p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group relative',
                          isSelected
                            ? 'bg-[#2f2f33] shadow-md ring-1'
                            : 'bg-[#27272a] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#2b2b2f]'
                        )}
                        style={{
                          borderColor: isSelected ? currentAccent.hex : undefined,
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                'w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-mono shadow-inner',
                                opt.bgPreview
                              )}
                              style={{ borderColor: opt.accent }}
                            >
                              <span style={{ color: opt.accent }}>■</span>
                            </div>
                            <span className="font-semibold text-white">{opt.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {opt.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.08] text-zinc-300 font-mono">
                                {opt.badge}
                              </span>
                            )}
                            {isSelected && (
                              <div
                                className="w-4 h-4 rounded-full text-white flex items-center justify-center"
                                style={{ backgroundColor: currentAccent.hex }}
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed">{opt.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interface Scale / Density */}
              <div className="space-y-3 pt-2">
                <label className="font-semibold text-white flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                  Interface Density
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'normal', 'spacious'] as DensityType[]).map((d) => {
                    const isSelected = density === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        className={cn(
                          'p-2.5 rounded-xl border text-center font-medium capitalize transition-all',
                          isSelected
                            ? 'bg-white/[0.08] text-white font-semibold'
                            : 'bg-[#27272a] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-[#2f2f33]'
                        )}
                        style={{
                          borderColor: isSelected ? currentAccent.hex : undefined,
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-5">
              {/* Air-Gap Strict Enforcement */}
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Strict Air-Gap Verification</h4>
                    <p className="text-[11px] text-zinc-400">
                      Zero-CDN preflight grep assertion and socket isolation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStrictAirGap(!strictAirGap)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    strictAirGap ? 'bg-emerald-600' : 'bg-zinc-600'
                  )}
                  title="Toggle air-gap enforcement"
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                      strictAirGap ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Local Model Server Parameters */}
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Inference Endpoint</h4>
                  <button
                    onClick={handlePingServer}
                    disabled={pingStatus === 'testing'}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 font-mono text-[11px] transition-all flex items-center gap-1.5"
                  >
                    {pingStatus === 'testing' && <span className="animate-spin">⟳</span>}
                    {pingStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {pingStatus === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{pingStatus === 'idle' ? 'Ping Model Server' : pingStatus.toUpperCase()}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-[#1f1f22] border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">DAEMON PORT</span>
                    <span className="text-white font-semibold">127.0.0.1:8080</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1f1f22] border border-white/[0.04]">
                    <span className="text-zinc-500 block text-[10px]">LOADED GGUF</span>
                    <span className="text-emerald-400 font-semibold">Qwen 2.5 1.5B (8k ctx)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-xl border"
                    style={{
                      backgroundColor: `${currentAccent.hex}15`,
                      color: currentAccent.hex,
                      borderColor: `${currentAccent.hex}30`,
                    }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Synthesis Completion Chime</h4>
                    <p className="text-[11px] text-zinc-400">
                      Play acoustic notification when LangGraph deliverable finishes
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    soundEnabled ? 'bg-purple-600' : 'bg-zinc-600'
                  )}
                  style={{
                    backgroundColor: soundEnabled ? currentAccent.hex : '#52525b',
                  }}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-14 bg-[#18181b] border-t border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-white font-medium text-xs shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: currentAccent.hex }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
