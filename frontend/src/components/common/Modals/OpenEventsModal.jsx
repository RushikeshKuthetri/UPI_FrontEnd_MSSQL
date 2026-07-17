import React from 'react';
import { X } from 'lucide-react';
import Table1 from '../../../components/Common/Table/Table';

function fmtTime(val) {
  if (!val) return '';
  if (typeof val === 'string' && val.includes('T')) return val.substring(11, 19);
  return String(val).substring(0, 8);
}

export default function OpenEventsModal({
  isOpen,
  onClose,
  openEventsLoading,
  openEventsRows
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[800px] max-h-[80vh] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden" style={{ background: 'var(--modal-bg)' }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--title)' }}>Open Events</h2>
          <button onClick={onClose} className="hover:opacity-70" style={{ color: 'var(--card-subtle)' }}><X size={20} /></button>
        </div>
        <div className="overflow-auto flex-1 border rounded-lg" style={{ borderColor: 'var(--form-border)' }}>
          {openEventsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <Table1
              columns={[
                { key: 'ResourceCode', label: 'Resource' },
                { key: 'Material', label: 'Material' },
                { key: 'StartTime', label: 'Start Time', render: (v) => fmtTime(v) },
                { key: 'StopTime', label: 'Stop Time', render: (v) => fmtTime(v) },
                { key: 'Duration', label: 'Duration' },
                { key: 'Line', label: 'Line' },
              ]}
              data={openEventsRows}
            />
          )}
        </div>
      </div>
    </div>
  );
}
