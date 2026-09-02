import React, { useState } from 'react';
import { ShieldAlert, Check, X, FileText } from 'lucide-react';
import { PendingApproval } from '../../types/api';

interface HITLApprovalCardProps {
  approval: PendingApproval;
  onApprove: (actionId: string) => Promise<void>;
  onReject: (actionId: string, reason?: string) => Promise<void>;
  onViewEvidence?: () => void;
}

export const HITLApprovalCard: React.FC<HITLApprovalCardProps> = ({
  approval,
  onApprove,
  onReject,
  onViewEvidence,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(approval.action_id);
      setStatus('approved');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(approval.action_id, 'Engineer rejected via workbench interface');
      setStatus('rejected');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3 rounded-2xl bg-[#27272a] border border-amber-500/30 p-4 space-y-3 shadow-lg animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-300">
              Human-in-the-Loop Confirmation Required
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono">
              Action Gate: {approval.type || 'Deliverable Finalization'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          GATE ACTIVE
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-200 leading-relaxed bg-[#1e1e20] p-3 rounded-xl border border-white/[0.06] font-mono">
        {approval.description || 'Kavach requires engineering confirmation before creating final deliverables.'}
      </p>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-1">
        {onViewEvidence ? (
          <button
            onClick={onViewEvidence}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Evidence</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          {status === 'pending' ? (
            <>
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-xs font-medium text-zinc-300 hover:text-rose-300 border border-white/[0.08] transition-all active:scale-95"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Finalize</span>
              </button>
            </>
          ) : status === 'approved' ? (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Approved by Engineer
            </span>
          ) : (
            <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
              <X className="w-4 h-4" />
              Action Rejected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
