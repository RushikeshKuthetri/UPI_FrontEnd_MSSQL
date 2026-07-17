import React from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import TextInput from '../Form/Inputs/TextInput';
import BackButton from '../Form/Buttons/BackButton';
import NextButton from '../Form/Buttons/NextButton';

export default function SplitStoppageModal({
  isOpen,
  onClose,
  splitRow,
  splitEntries,
  handleSplitEndChange,
  calcDur,
  handleDeleteSplitRow,
  handleAddSplitRow,
  handleSaveSplit,
  saving
}) {
  if (!isOpen || !splitRow) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-[600px] max-w-[95vw] rounded-2xl px-6 py-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70">
          <X size={20} style={{ color: 'var(--text-color)' }} />
        </button>
        <div className='flex items-center justify-center mb-2'>
          <Title label="Split Stoppage" />
        </div>
        <div className="p-3 text-sm rounded-lg border flex items-center justify-center gap-2" style={{ background: 'var(--card-bg, #fff)', borderColor: 'var(--form-border)', color: 'var(--text-color)' }}>
          <span>Resource: <strong style={{ color: 'var(--title)' }}>{splitRow.ARBPL}</strong></span>
          <span style={{ color: 'var(--form-border)' }}>|</span>
          <span>Range: <strong style={{ color: 'var(--title)' }}>{splitRow.StartTime} &rarr; {splitRow.StopTime}</strong></span>
          <span style={{ color: 'var(--form-border)' }}>|</span>
          <span>Duration: <strong style={{ color: 'var(--title)' }}>{splitRow.Duration}</strong></span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm font-semibold mb-1" style={{ color: 'var(--title)' }}>
            <div className="w-10">#</div>
            <div className="flex-1">Start Time</div>
            <div className="flex-1">End Time</div>
            <div className="flex-1">Duration</div>
            <div className="w-10"></div>
          </div>
          {splitEntries.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="w-10 text-sm">{idx + 1}</div>
              <div className="flex-1">
                <TextInput type="time" value={entry.startTime} disabled />
              </div>
              <div className="flex-1">
                <TextInput type="time" value={entry.endTime} onChange={(e) => handleSplitEndChange(idx, e.target.value)} />
              </div>
              <div className="flex-1 text-sm font-medium flex items-center px-2">
                {calcDur(entry.startTime, entry.endTime) || '—'}
              </div>
              <div className="w-10 flex justify-center">
                <button onClick={() => handleDeleteSplitRow(idx)} disabled={splitEntries.length <= 2} className="text-red-500 hover:text-red-700 disabled:opacity-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleAddSplitRow} className="flex items-center gap-1 text-sm font-medium mt-2 w-fit transition hover:opacity-70" style={{ color: 'var(--submit-button-bg, #f97316)' }}>
            <Plus size={16} /> Add Row
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <BackButton onClick={onClose} label="Cancel" />
          <NextButton onClick={handleSaveSplit} disabled={saving} label={saving ? 'Saving...' : 'Save Split'} />
        </div>
      </div>
    </div>
  );
}
