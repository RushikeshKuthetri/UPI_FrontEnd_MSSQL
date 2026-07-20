import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import SubmitButton from '../Form/Buttons/SubmitButton';
import BackButton from '../Form/Buttons/BackButton';

export default function RoleMenuMappingModal({
  isOpen,
  onClose,
  editMode,
  roles,
  form,
  setForm,
  AVAILABLE_MENUS,
  toggleMenu,
  saving,
  handleSave
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
          <Title label={editMode ? "Edit Role Menu Mapping" : "Add Role Menu Mapping"} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Select Role</FormLabel>
            <SelectInput
              options={roles.map(r => ({ label: r.Name, value: r.Id }))}
              value={form.RoleId}
              onChange={e => setForm({ ...form, RoleId: e.target.value })}
              placeholder="Select Role"
              disabled={editMode}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Assign Menus</FormLabel>
            <div className="border border-[var(--card-border-main)] rounded-lg p-3 max-h-[250px] overflow-y-auto flex flex-col gap-2">
              {AVAILABLE_MENUS.map((menu, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={form.MenuIds.includes(idx + 1) || form.MenuIds.includes(menu)}
                    onChange={() => toggleMenu(idx + 1)}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-[var(--text-color)]">{menu}</span>
                </label>
              ))}
            </div>
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
