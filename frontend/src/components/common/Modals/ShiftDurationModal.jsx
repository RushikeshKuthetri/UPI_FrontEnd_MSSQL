import React from 'react';
import { X } from 'lucide-react';
import Table1 from '../../../components/Common/Table/Table';

export default function ShiftDurationModal({
  isOpen,
  onClose,
  shiftDurationLoading,
  shiftDurationData,
  handleSaveShiftDuration,
  saving
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[1000px] max-h-[85vh] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden" style={{ background: 'var(--modal-bg)' }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--title)' }}>Shift Duration Preview</h2>
          <button onClick={onClose} className="hover:opacity-70" style={{ color: 'var(--card-subtle)' }}><X size={20} /></button>
        </div>
        <div className="overflow-auto flex-1 border rounded-lg" style={{ borderColor: 'var(--form-border)' }}>
          {shiftDurationLoading ? (
            <div className="p-8 text-center">Calculating Shift Duration...</div>
          ) : (
            <Table1
              columns={[
                { key: 'Resource', label: 'Resource' },
                { key: 'Material', label: 'Material' },
                { key: 'OldStartTime', label: 'Old Start Time' },
                { key: 'OldStopTime', label: 'Old Stop Time' },
                { key: 'OldDuration', label: 'Old Duration' },
                { key: 'StartTime', label: 'New Start Time' },
                { key: 'StopTime', label: 'New Stop Time' },
                { key: 'Duration', label: 'New Duration' },
              ]}
              data={shiftDurationData}
            />
          )}
        </div>
        <div className="flex justify-end gap-3 mt-4 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--form-border)', color: 'var(--text-color)' }}>Cancel</button>
          <button onClick={handleSaveShiftDuration} disabled={saving || shiftDurationLoading} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--submit-button-bg)', color: '#000' }}>{saving ? 'Saving...' : 'Save Shift Duration'}</button>
        </div>
      </div>
    </div>
  );
}
