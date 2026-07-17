import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import TextInput from '../Form/Inputs/TextInput';
import DateTimePicker from '../Form/Inputs/DatePicker';
import BackButton from '../Form/Buttons/BackButton';
import NextButton from '../Form/Buttons/NextButton';
import api from '../../../api/axios';

export default function AddStoppageModal({
  isOpen,
  onClose,
  addForm,
  setAddForm,
  plants,
  addFormLines,
  setAddFormLines,
  handleAddSubmit,
  saving
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-[500px] max-w-[95vw] rounded-2xl px-6 py-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70">
          <X size={20} style={{ color: 'var(--text-color)' }} />
        </button>
        <div className='flex items-center justify-center mb-2'>
          <Title label="Add Stoppage Entry" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Plant (WERKS)</FormLabel>
            <SelectInput
              options={plants.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode }))}
              value={addForm.WERKS}
              onChange={(e) => {
                const pc = e.target.value;
                setAddForm(f => ({ ...f, WERKS: pc, Line: '' }));
                if (pc) {
                  api.get('/stoppages/lines', { params: { plantCode: pc } })
                    .then(({ data }) => setAddFormLines(data.map(l => ({ label: l.Descr || l.UnitCode, value: l.UnitCode }))))
                    .catch(() => setAddFormLines([]));
                } else {
                  setAddFormLines([]);
                }
              }}
              placeholder="Select Plant"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Line</FormLabel>
            <SelectInput
              options={addFormLines}
              value={addForm.Line}
              onChange={(e) => setAddForm(f => ({ ...f, Line: e.target.value }))}
              placeholder="Select Line"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <FormLabel required>Resource (ARBPL)</FormLabel>
            <TextInput value={addForm.ARBPL} onChange={(e) => setAddForm(f => ({ ...f, ARBPL: e.target.value }))} placeholder="Enter Resource Name" />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <FormLabel>Material</FormLabel>
            <TextInput value={addForm.Material} onChange={(e) => setAddForm(f => ({ ...f, Material: e.target.value }))} placeholder="Enter Material" />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Start Time</FormLabel>
            <DateTimePicker
              value={addForm.StartTime}
              onChange={(date) => setAddForm(f => ({ ...f, StartTime: date }))}
              placeholder="Select Start Time"
              showTime={true}
              dateFormat="dd/MM/yyyy h:mm aa"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>End Time</FormLabel>
            <DateTimePicker
              value={addForm.EndTime}
              onChange={(date) => setAddForm(f => ({ ...f, EndTime: date }))}
              placeholder="Select End Time"
              showTime={true}
              dateFormat="dd/MM/yyyy h:mm aa"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <BackButton onClick={onClose} label="Cancel" />
          <NextButton onClick={handleAddSubmit} disabled={saving} label={saving ? 'Saving...' : 'Save'} />
        </div>
      </div>
    </div>
  );
}
