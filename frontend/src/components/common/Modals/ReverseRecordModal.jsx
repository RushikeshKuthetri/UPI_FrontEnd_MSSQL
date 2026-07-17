import React from 'react';
import { Undo2, X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import BackButton from '../Form/Buttons/BackButton';

export default function ReverseRecordModal({
  isOpen,
  onClose,
  singleRow,
  reason,
  setReason,
  saving,
  handleConfirmReverse
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[480px] rounded-2xl px-6 py-6 shadow-2xl flex flex-col gap-4"
        style={{ background: 'var(--modal-bg, var(--card-bg))' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition hover:opacity-70"
          style={{ color: 'var(--card-subtle)' }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Undo2 size={20} className="text-[#EF4444]" />
          <Title label="Reverse Record" />
        </div>

        {/* Warning Alert */}
        <div className="flex items-start gap-3 p-3 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[13px]" style={{ color: 'var(--text-color)' }}>
          <span className="text-[#F59E0B] mt-0.5 shrink-0">⚠</span>
          <span>This will mark the selected record as reversed and create a reversal entry. This action cannot be undone.</span>
        </div>

        {/* Row Details */}
        {singleRow && (
          <div className="p-3 bg-[var(--input-disable-bg)] text-[var(--text-color)] rounded-xl text-[13px] border border-[var(--form-border)]">
            <strong>Plant:</strong> {singleRow.WERKS || singleRow.Plant} | <strong>Resource:</strong> {singleRow.Resource} |
            <strong> Material:</strong> {singleRow.Material} | <strong>Line:</strong> {singleRow.Line || singleRow.Operation} |
            <strong> Qty:</strong> {singleRow.Quantity || singleRow.Yield} {singleRow.UOM}
          </div>
        )}

        {/* Reason Input */}
        <div className="flex flex-col gap-1">
          <FormLabel>Reason for Reversal</FormLabel>
          <TextInput
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incorrect quantity posted"
            rows={2}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 mt-2">
          <BackButton onClick={onClose} label="Cancel" />
          <button
            onClick={handleConfirmReverse}
            disabled={saving}
            className="flex items-center gap-2 border border-[#EF4444] bg-[#EF4444] text-white text-[14px] font-medium px-3 py-1 rounded-lg transition cursor-pointer hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 size={14} />
            {saving ? 'Processing...' : 'Confirm Reversal'}
          </button>
        </div>
      </div>
    </div>
  );
}
