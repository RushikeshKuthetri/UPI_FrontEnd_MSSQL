import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import SubmitButton from '../Form/Buttons/SubmitButton';

export default function RoleModal({
  isOpen,
  onClose,
  editMode,
  form,
  setForm,
  saving,
  handleSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-[500px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700">
          <X size={20} />
        </button>
        <div className="flex items-center justify-center mb-6 mt-2">
          <Title label={editMode ? "Edit Role" : "Add Role"} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Role Name</FormLabel>
            <TextInput placeholder="Enter Role Name" value={form.Name}
              onChange={e => setForm({ ...form, Name: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Description</FormLabel>
            <div className="relative">
              <textarea
                value={form.Description}
                onChange={e => setForm({ ...form, Description: e.target.value.slice(0, 10000) })}
                placeholder="Enter Description here..."
                rows={4}
                className="w-full rounded-lg border border-[var(--input-enable-border)] bg-[var(--input-enable-bg)] px-3 py-2 text-sm outline-none resize-none"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {form.Description.length}/10000
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FormLabel required>Is Active</FormLabel>
            <input type="checkbox" checked={form.IsActive}
              onChange={e => setForm({ ...form, IsActive: e.target.checked })}
              className="w-4 h-4 accent-orange-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-1.5 rounded-md border border-[var(--form-border)] text-sm font-medium hover:bg-[var(--button-hover-bg)] text-[var(--text-color)] transition">Close</button>
          <SubmitButton onClick={handleSave} loading={saving}>Save</SubmitButton>
        </div>
      </div>
    </div>
  );
}
