import React, { useState } from 'react'
import { X } from 'lucide-react'
import FormLabel from '../TitleAndLabel/InputLabel'
import TextInput from '../Form/Inputs/TextInput'
import CheckboxInput from '../Form/Inputs/CheckboxInput'
import BackButton from '../Form/Buttons/BackButton'
import NextButton from '../Form/Buttons/NextButton'
import Title from '../TitleAndLabel/Title'

const MAX_DESC = 10000

const AddRoleModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    roleName: '',
    description: '',
    isActive: false,
  })

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'description' && value.length > MAX_DESC) return
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  const handleSave = () => {
    const newErrors = {};
    if (!form.roleName) newErrors.roleName = 'Role Name is required';
    if (!form.description) newErrors.description = 'Description is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave?.(form)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[480px] rounded-2xl px-6 py-6 shadow-2xl flex flex-col gap-4"
        style={{ background: 'var(--modal-bg, var(--card-bg))' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition hover:opacity-70"
          style={{ color: 'var(--card-subtle)' }}
        >
          <X size={20} />
        </button>

        {/* Title */}

        <div className='flex items-center justify-center mb-2'>
           <Title label={"Add Role"} />
          </div>

        {/* Role Name */}
        <div className="flex flex-col gap-1">
          <FormLabel required>Role Name</FormLabel>
          <TextInput
            name="roleName"
            value={form.roleName}
            onChange={handleChange}
            placeholder="Enter Role Name"
            error={errors.roleName}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <FormLabel required>Description</FormLabel>
          <div className="relative">
              <TextInput
              name="description"
               value={form.description}
              onChange={handleChange}
              placeholder="Enter Description here..."
              rows={5}
              error={errors.description}
            />
            <span
              className="absolute bottom-2 right-3 text-[11px]"
              style={{ color: 'var(--search-placeholder)' }}
            >
              {form.description.length}/{MAX_DESC}
            </span>
          </div>
        </div>

        {/* Is Active */}
        <div className="flex items-center justify-center gap-3">
          <FormLabel required>Is Active</FormLabel>
          <CheckboxInput
            checked={form.isActive}
            onChange={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 mt-2">
          <BackButton onClick={onClose} label="Close" />
          <NextButton onClick={handleSave} label="Save" />
        </div>
      </div>
    </div>
  )
}

export default AddRoleModal