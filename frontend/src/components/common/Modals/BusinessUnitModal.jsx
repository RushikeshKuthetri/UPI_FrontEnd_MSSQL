import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import SubmitButton from '../Form/Buttons/SubmitButton';
import BackButton from '../Form/Buttons/BackButton';

export default function BusinessUnitModal({
  isOpen,
  onClose,
  editMode,
  form,
  setForm,
  fetchData
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-[500px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70 text-[var(--text-color)]">
          <X size={20} />
        </button>

        <div className="flex items-center justify-center mb-6 mt-2">
          <Title label={editMode ? "Edit Business Unit" : "Add Business Unit"} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>BU Code</FormLabel>
            <TextInput
              placeholder="Enter BU Code"
              value={form.BUCode}
              onChange={e => setForm({ ...form, BUCode: e.target.value })}
              disabled={editMode}
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Short Name</FormLabel>
            <TextInput
              placeholder="Enter Short Name"
              value={form.ShortName}
              onChange={e => setForm({ ...form, ShortName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>BU Name</FormLabel>
            <TextInput
              placeholder="Enter BU Name"
              value={form.BUName}
              onChange={e => setForm({ ...form, BUName: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
               <BackButton onClick={onClose} label="Close" />
          <SubmitButton onClick={() => {
            alert(editMode ? 'Business Unit updated' : 'Business Unit added');
            onClose();
            fetchData();
          }}>Save</SubmitButton>
        </div>
      </div>
    </div>
  );
}
