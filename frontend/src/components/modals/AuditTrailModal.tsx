import React, { useEffect, useState } from 'react';
import { X, FileCheck, Search, Clock, Terminal } from 'lucide-react';
import { api } from '../../api/client';
import { formatTimestamp } from '../../utils/formatters';

interface AuditTrailModalProps {
  sessionId: string;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ sessionId, onClose }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAudit = async () => {
      setLoading(true);
      try {
        const res = await api.getSessionEvents(sessionId, 100);
        setEvents(res.events || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [sessionId]);

  const filtered = events.filter((e) => {
    const matchType = e.event_type?.toLowerCase().includes(search.toLowerCase());
    const matchDetails = JSON.stringify(e.details || {}).toLowerCase().includes(search.toLowerCase());
    return matchType || matchDetails;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-text">
      <div className="max-w-4xl w-full bg-[#212124] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="h-14 bg-[#18181b] border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Audit Trail & Provenance Explorer
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Immutable Localhost Audit Stream · Session: {sessionId}
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

        {/* Filter Bar */}
        <div className="p-4 bg-[#18181b] border-b border-white/[0.08] flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit events, tools, hashes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#27272a] border border-white/[0.08] text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/[0.2]"
            />
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {filtered.length} Events Logged
          </span>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs font-mono">
          {loading ? (
            <div className="text-center py-12 text-zinc-400 animate-pulse">
              Loading local audit log entries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No matching audit events found for this session.
            </div>
          ) : (
            filtered.map((evt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#27272a] border border-white/[0.06] space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-400 uppercase text-xs flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                    {evt.event_type}
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(evt.timestamp)}
                  </span>
                </div>

                <pre className="text-xs font-mono text-zinc-200 bg-[#18181b] p-3 rounded-xl border border-white/[0.04] overflow-x-auto leading-relaxed">
                  {JSON.stringify(evt.details || evt.data || {}, null, 2)}
                </pre>
              </div>
            ))
          )}
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
