import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import SelectInput from '../Form/Inputs/SelectInput';
import SubmitButton from '../Form/Buttons/SubmitButton';
import BackButton from '../Form/Buttons/BackButton';

export default function PlantDetailsModal({
  isOpen,
  onClose,
  editMode,
  form,
  setForm,
  businessUnits,
  handleSave,
  saving
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-[550px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700">
          <X size={20} />
        </button>
        <div className="flex items-center justify-center mb-6 mt-2">
          <Title label={editMode ? "Edit Plant" : "Add Plant"} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Plant Code</FormLabel>
            <TextInput placeholder="Enter Plant Code" value={form.PlantCode}
              onChange={e => setForm({ ...form, PlantCode: e.target.value })} disabled={editMode} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Plant Name</FormLabel>
            <TextInput placeholder="Enter Plant Name" value={form.PlantName}
              onChange={e => setForm({ ...form, PlantName: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Display Name</FormLabel>
            <TextInput placeholder="Enter Display Name" value={form.DisplayName}
              onChange={e => setForm({ ...form, DisplayName: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel>Business Unit</FormLabel>
            <SelectInput
              options={businessUnits.map(b => ({ label: `${b.BUCode} - ${b.ShortName || b.BUName}`, value: b.BUCode }))}
              value={form.BussinesUnitBUCode}
              onChange={e => setForm({ ...form, BussinesUnitBUCode: e.target.value })}
              placeholder="Select Business Unit"
            />
          </div>
          <div className="flex items-center gap-2">
            <FormLabel required>Is Active</FormLabel>
            <input type="checkbox" checked={form.IsActive}
              onChange={e => setForm({ ...form, IsActive: e.target.checked })}
              className="w-4 h-4 accent-orange-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
              <BackButton onClick={onClose} label="Close" />
          <SubmitButton onClick={handleSave} loading={saving}>Save</SubmitButton>
        </div>
      </div>
    </div>
  );
}
