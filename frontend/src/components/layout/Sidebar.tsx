import React from 'react';
import {
  Plus,
  MessageSquare,
  FileText,
  Boxes,
  ShieldCheck,
  FileCheck,
  Cpu,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Sliders,
  Settings,
} from 'lucide-react';
import { SessionResponse } from '../../types/api';
import { SidebarSection } from '../../types/workbench';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  sessions: SessionResponse[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activeSection,
  onSelectSection,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onOpenSettings,
}) => {
  return (
    <aside
      className={cn(
        'bg-[#171717] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none z-10',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Top Section */}
      <div className="p-3 space-y-3 overflow-y-auto overflow-x-hidden flex-1">
        {/* New Task Button (ChatGPT Style) */}
        <button
          onClick={onNewSession}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] border border-white/[0.08] text-sm font-medium text-white transition-all shadow-sm active:scale-[0.98]',
            collapsed && 'justify-center p-2.5'
          )}
          title="New Engineering Task"
        >
          <Plus className="w-4 h-4 text-zinc-300" />
          {!collapsed && <span className="text-xs">New Task</span>}
        </button>

        {/* Navigation Tools */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectSection('chat')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'chat'
                ? 'bg-[#2f2f2f] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Active Chat' : undefined}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-zinc-300" />
            {!collapsed && <span>Active Chat</span>}
          </button>
        </div>

        {/* Recent Tasks History */}
        {!collapsed && sessions.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-medium text-zinc-500 px-3 mb-1.5">Recent Tasks</p>
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {sessions.map((s) => {
                const isSelected = s.session_id === activeSessionId;
                return (
                  <div
                    key={s.session_id}
                    onClick={() => onSelectSession(s.session_id)}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all',
                      isSelected
                        ? 'bg-[#2f2f2f] text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
                    )}
                  >
                    <span className="truncate font-mono text-[11px]">
                      Task_{s.session_id.slice(0, 6)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {s.message_count}
                      </span>
                      <button
                        onClick={(e) => onDeleteSession(s.session_id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity rounded"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Workbench Modules */}
        <div className="pt-3 border-t border-white/[0.08] space-y-1">
          {!collapsed && (
            <p className="text-[11px] font-medium text-zinc-500 px-3 mb-1.5">Workbench Modules</p>
          )}

          <button
            onClick={() => onSelectSection('documents')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'documents'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Documents & RAG' : undefined}
          >
            <FileText className="w-4 h-4 shrink-0 text-blue-400" />
            {!collapsed && <span>Documents & SOPs</span>}
          </button>

          <button
            onClick={() => onSelectSection('artifacts')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'artifacts'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Artifacts Workspace' : undefined}
          >
            <Boxes className="w-4 h-4 shrink-0 text-purple-400" />
            {!collapsed && <span>Artifact Workspace</span>}
          </button>

          <button
            onClick={() => onSelectSection('sovereignty')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'sovereignty'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Sovereignty Guard' : undefined}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            {!collapsed && <span>Sovereignty Guard</span>}
          </button>

          <button
            onClick={() => onSelectSection('audit')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'audit'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Audit Lineage' : undefined}
          >
            <FileCheck className="w-4 h-4 shrink-0 text-amber-400" />
            {!collapsed && <span>Audit Trail</span>}
          </button>

          <button
            onClick={() => onSelectSection('hardware')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              activeSection === 'hardware'
                ? 'bg-[#2f2f2f] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#212121]'
            )}
            title={collapsed ? 'Hardware & Models' : undefined}
          >
            <Cpu className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>Hardware & Models</span>}
          </button>
        </div>
      </div>

      {/* Bottom Controls: Settings & Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.08] space-y-1">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#212121] transition-all group',
            collapsed && 'justify-center px-0'
          )}
          title="Settings"
        >
          <Settings className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-purple-400 transition-colors" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-[#212121] text-zinc-400 hover:text-white transition-all text-xs"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2">Close Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
