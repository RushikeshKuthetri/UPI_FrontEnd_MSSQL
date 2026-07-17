import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import TextInput from '../Form/Inputs/TextInput';
import BackButton from '../Form/Buttons/BackButton';
import NextButton from '../Form/Buttons/NextButton';

export default function EditStoppageModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  types,
  reasons,
  depts,
  handleSaveEdit,
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
          <Title label="Edit Stoppage" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel>Resource</FormLabel>
            <TextInput value={editForm.ARBPL} disabled />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Start Time</FormLabel>
            <TextInput value={editForm.StartTime} disabled />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormLabel>Material</FormLabel>
            <TextInput value={editForm.MATNR} onChange={(e) => setEditForm(f => ({ ...f, MATNR: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Type</FormLabel>
            <SelectInput options={types.map(t => ({ label: `${t.StoppageType} - ${t.Descr}`, value: t.StoppageType }))} value={editForm.StoppageType} onChange={(e) => setEditForm(f => ({ ...f, StoppageType: e.target.value }))} placeholder="Select Type" />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Reason (GRUND)</FormLabel>
            <SelectInput options={reasons.map(r => ({ label: `${r.GRUND} - ${r.GRDTX}`, value: r.GRUND }))} value={editForm.GRUND} onChange={(e) => setEditForm(f => ({ ...f, GRUND: e.target.value }))} placeholder="Select Reason" />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Department</FormLabel>
            <SelectInput options={depts.map(d => ({ label: `${d.ABTNR} - ${d.DESCR}`, value: d.ABTNR }))} value={editForm.ABTNR} onChange={(e) => setEditForm(f => ({ ...f, ABTNR: e.target.value }))} placeholder="Select Department" />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Equipment No.</FormLabel>
            <TextInput value={editForm.EQUNR} onChange={(e) => setEditForm(f => ({ ...f, EQUNR: e.target.value }))} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormLabel>Remarks</FormLabel>
            <TextInput value={editForm.Remarks} maxLength={30} onChange={(e) => setEditForm(f => ({ ...f, Remarks: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <BackButton onClick={onClose} label="Cancel" />
          <NextButton onClick={handleSaveEdit} disabled={saving} label={saving ? 'Saving...' : 'Save'} />
        </div>
      </div>
    </div>
  );
}
