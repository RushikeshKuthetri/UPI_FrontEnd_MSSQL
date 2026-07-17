import React from 'react';
import { X } from 'lucide-react';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import TextInput from '../Form/Inputs/TextInput';
import DateTimePicker from '../Form/Inputs/DatePicker';
import api from '../../../api/axios';

export default function AddGradeChangeModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[500px] rounded-2xl p-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--modal-bg)' }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--title)' }}>Add Grade Change</h2>
          <button onClick={onClose} className="hover:opacity-70" style={{ color: 'var(--card-subtle)' }}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Plant</FormLabel>
            <SelectInput
              options={plants}
              value={addForm.PlantCode}
              onChange={(e) => {
                const pc = e.target.value;
                setAddForm(f => ({ ...f, PlantCode: pc, Line: '' }));
                if (pc) {
                  api.get('/grade-change/lines', { params: { plantCode: pc } })
                    .then(({ data }) => setAddFormLines(data.map(l => ({ label: l, value: l }))))
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
            <FormLabel required>Resource Name</FormLabel>
            <TextInput value={addForm.ResourceName} onChange={(e) => setAddForm(f => ({ ...f, ResourceName: e.target.value }))} placeholder="Enter Resource Name" />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <FormLabel required>Material</FormLabel>
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
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--form-border)', color: 'var(--text-color)' }}>Cancel</button>
          <button onClick={handleAddSubmit} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--submit-button-bg)', color: '#000' }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
