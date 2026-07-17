import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import Table1 from '../Table/Table';

export default function OpenEventsStoppageModal({
  isOpen,
  onClose,
  openEventsLoading,
  openEventsRows
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-[800px] max-h-[80vh] rounded-2xl px-6 py-6 shadow-2xl flex flex-col gap-4 overflow-hidden" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70">
          <X size={20} style={{ color: 'var(--text-color)' }} />
        </button>
        <div className='flex items-center justify-center mb-2'>
          <Title label="Open Events" />
        </div>
        <div className="overflow-auto flex-1 border rounded-lg" style={{ borderColor: 'var(--form-border)' }}>
          {openEventsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <Table1
              columns={[
                { key: 'ARBPL', label: 'Resource' },
                { key: 'MATNR', label: 'Material' },
                { key: 'StartTime', label: 'Start Time' },
                { key: 'StopTime', label: 'Stop Time', render: () => 'Pending' },
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
