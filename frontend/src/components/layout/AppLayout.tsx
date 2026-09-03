import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatContainer } from '../chat/ChatContainer';
import { Composer } from '../chat/Composer';
import { ArtifactWorkspace } from '../artifact/ArtifactWorkspace';
import { IdleWorkbench } from '../common/IdleWorkbench';
import { SourceInspectorModal } from '../modals/SourceInspectorModal';
import { SovereigntyModal } from '../modals/SovereigntyModal';
import { HardwareModal } from '../modals/HardwareModal';
import { IngestionModal } from '../modals/IngestionModal';
import { AuditTrailModal } from '../modals/AuditTrailModal';
import { ContextDebugModal } from '../modals/ContextDebugModal';
import { SettingsModal } from '../modals/SettingsModal';
import {
  ArtifactResponse,
  CitationItem,
  FileUploadResponse,
  HardwareProfileStatus,
  SessionResponse,
  SystemStatusResponse,
} from '../../types/api';
import { ChatMessage, SidebarSection } from '../../types/workbench';

interface AppLayoutProps {
  systemStatus: SystemStatusResponse | null;
  hardwareStatus: HardwareProfileStatus | null;
  sessions: SessionResponse[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isExecuting: boolean;
  artifactsList: ArtifactResponse[];
  selectedArtifact: ArtifactResponse | null;
  inspectedCitation: CitationItem | null;
  onSendMessage: (message: string, attachments: string[]) => void;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  onSelectArtifact: (art: ArtifactResponse) => void;
  onCloseArtifact: () => void;
  onInspectCitation: (cite: CitationItem) => void;
  onCloseCitation: () => void;
  onApproveAction: (actionId: string) => Promise<void>;
  onRejectAction: (actionId: string, reason?: string) => Promise<void>;
  onRunTestEgress: () => void;
  isTestingEgress: boolean;
  egressPassed: boolean | null;
  onFileUploaded: (resp: FileUploadResponse) => void;
  onSelectDocument?: (filename: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  systemStatus,
  hardwareStatus,
  sessions,
  activeSessionId,
  messages,
  isExecuting,
  artifactsList,
  selectedArtifact,
  inspectedCitation,
  onSendMessage,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onSelectArtifact,
  onCloseArtifact,
  onInspectCitation,
  onCloseCitation,
  onApproveAction,
  onRejectAction,
  onRunTestEgress,
  isTestingEgress,
  egressPassed,
  onFileUploaded,
  onSelectDocument,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSection>('chat');

  // Modal open states
  const [sovereigntyModalOpen, setSovereigntyModalOpen] = useState(false);
  const [hardwareModalOpen, setHardwareModalOpen] = useState(false);
  const [ingestionModalOpen, setIngestionModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [debugModalOpen, setDebugModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Composer attachments
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const handleAddAttachment = (filename: string) => {
    if (!attachedFiles.includes(filename)) {
      setAttachedFiles([...attachedFiles, filename]);
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
  };

  const handleSelectSection = (section: SidebarSection) => {
    setActiveSection(section);
    if (section === 'sovereignty') setSovereigntyModalOpen(true);
    if (section === 'hardware' || section === 'models') setHardwareModalOpen(true);
    if (section === 'documents') setIngestionModalOpen(true);
    if (section === 'audit') setAuditModalOpen(true);
  };

  // Find all citations across messages for Artifact workspace evidence tab
  const allCitations = messages.flatMap((m) => m.citations || []);

  const currentSession = sessions.find((s) => s.session_id === activeSessionId);
  const sessionTitle = currentSession ? (currentSession.title || `Task_${currentSession.session_id.slice(0, 6)}`) : 'New Task';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#212121] text-[#ececec] overflow-hidden font-sans">
      {/* Top Bar Header */}
      <TopBar
        systemStatus={systemStatus}
        hardwareStatus={hardwareStatus}
        sessionTitle={sessionTitle}
        onOpenSovereignty={() => setSovereigntyModalOpen(true)}
        onOpenHardware={() => setHardwareModalOpen(true)}
        onOpenUpload={() => setIngestionModalOpen(true)}
        onOpenAudit={() => setAuditModalOpen(true)}
        onOpenDebug={() => setDebugModalOpen(true)}
        onRunTestEgress={onRunTestEgress}
        onNewSession={onNewSession}
        isTestingEgress={isTestingEgress}
        egressPassed={egressPassed}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 1. Left Navigation Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
          onNewSession={onNewSession}
          onDeleteSession={onDeleteSession}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />

        {/* 2. Center Region (Engineering Chat & Agent Execution Stream) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#212121] overflow-hidden relative">
          {messages.length === 0 ? (
            <IdleWorkbench
              onSelectPrompt={(p) => onSendMessage(p, attachedFiles)}
              onOpenUpload={() => setIngestionModalOpen(true)}
            />
          ) : (
            <ChatContainer
              messages={messages}
              onInspectCitation={onInspectCitation}
              onSelectArtifact={onSelectArtifact}
              onSelectDocument={onSelectDocument}
              onApproveAction={onApproveAction}
              onRejectAction={onRejectAction}
            />
          )}

          {/* Composer */}
          <Composer
            onSendMessage={(msg, files) => {
              onSendMessage(msg, files);
              setAttachedFiles([]);
            }}
            isExecuting={isExecuting}
            attachedFiles={attachedFiles}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            onSelectAttachment={onSelectDocument}
          />
        </main>

        {/* 3. Right Region (Work Output & Artifact Canvas) */}
        {selectedArtifact && (
          <ArtifactWorkspace
            artifact={selectedArtifact}
            artifactsList={artifactsList}
            citations={allCitations}
            onClose={onCloseArtifact}
            onSelectArtifact={onSelectArtifact}
            onInspectCitation={onInspectCitation}
          />
        )}
      </div>

      {/* Overlays and Modals */}
      {inspectedCitation && (
        <SourceInspectorModal citation={inspectedCitation} onClose={onCloseCitation} />
      )}

      {sovereigntyModalOpen && (
        <SovereigntyModal
          sovereignty={systemStatus?.sovereignty || null}
          onClose={() => setSovereigntyModalOpen(false)}
        />
      )}

      {hardwareModalOpen && (
        <HardwareModal
          hardware={hardwareStatus}
          systemStatus={systemStatus}
          onClose={() => setHardwareModalOpen(false)}
        />
      )}

      {ingestionModalOpen && (
        <IngestionModal
          onClose={() => setIngestionModalOpen(false)}
          onFileUploaded={(res) => {
            onFileUploaded(res);
            handleAddAttachment(res.filename);
          }}
        />
      )}

      {auditModalOpen && (
        <AuditTrailModal
          sessionId={activeSessionId || 'default'}
          onClose={() => setAuditModalOpen(false)}
        />
      )}

      {debugModalOpen && (
        <ContextDebugModal
          sessionId={activeSessionId}
          onClose={() => setDebugModalOpen(false)}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}
    </div>
  );
};
