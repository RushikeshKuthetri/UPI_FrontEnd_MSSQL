import React from 'react';
import { X } from 'lucide-react';
import FormLabel from '../../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../../components/Common/Form/Inputs/SelectInput';
import TextInput from '../../../components/Common/Form/Inputs/TextInput';

export default function EditGradeChangeModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  reasons,
  handleSaveEdit,
  saving
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[500px] rounded-2xl p-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--modal-bg)' }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--title)' }}>Edit Grade Change</h2>
          <button onClick={onClose} className="hover:opacity-70" style={{ color: 'var(--card-subtle)' }}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel>Resource</FormLabel>
            <TextInput value={editForm.ResourceCode} disabled />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Posting Date</FormLabel>
            <TextInput value={editForm.PostingDate} disabled />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Start Time</FormLabel>
            <TextInput type="time" value={editForm.StartTime} onChange={(e) => setEditForm(f => ({ ...f, StartTime: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Stop Time</FormLabel>
            <TextInput type="time" value={editForm.StopTime} onChange={(e) => setEditForm(f => ({ ...f, StopTime: e.target.value }))} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormLabel>Material</FormLabel>
            <TextInput value={editForm.Material} onChange={(e) => setEditForm(f => ({ ...f, Material: e.target.value }))} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormLabel>Reason (GRUND)</FormLabel>
            <SelectInput options={reasons} value={editForm.GRUND} onChange={(e) => setEditForm(f => ({ ...f, GRUND: e.target.value }))} placeholder="Select Reason" />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormLabel>Remarks</FormLabel>
            <TextInput value={editForm.Remarks} onChange={(e) => setEditForm(f => ({ ...f, Remarks: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--form-border)', color: 'var(--text-color)' }}>Cancel</button>
          <button onClick={handleSaveEdit} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--submit-button-bg)', color: '#000' }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
