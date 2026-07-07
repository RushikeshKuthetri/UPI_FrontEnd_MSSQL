import React, { useState } from 'react'
import { X } from 'lucide-react'
import InputLabel from '../TitleAndLabel/InputLabel'
import TextInput from '../Form/Inputs/TextInput'
import FormLabel from '../TitleAndLabel/InputLabel'

import SelectInput from '../Form/Inputs/SelectInput'
import CheckboxInput from '../Form/Inputs/CheckboxInput'
import SubmitButton from '../Form/Buttons/SubmitButton'


const TABS = ['Add User', 'Assign Business Unit', 'Assign Plant', 'Assign Role']



const EditUserModal = ({ user, rolesList = [], plantsList = [], onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
    isActive: user?.isActive || false,
    plant: user?.plant || [],
    role: user?.role || [],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = () => {
    onSave?.(form)
    onClose()
  }

  const ROLE_OPTIONS = rolesList;
  const PLANT_OPTIONS = plantsList;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
             bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[560px] rounded-2xl px-5 py-5 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg)', minHeight: '420px' }}
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
        <h2
          className="text-center text-[18px] font-bold "
          style={{ color: 'var(--title)' }}
        >
          Edit User
        </h2>

        {/* Tabs */}
        <div className="flex mx-auto w-full items-center justify-center   my-3 bg-[var(--modal-button-tab)] rounded-[5px]">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-5 py-1 text-sm font-medium transition whitespace-nowrap"
              style={
                activeTab === i
                  ? {
                    background: 'var(--submit-button-bg)',
                    color: '#000000',
                    borderRadius: '3px',
                  }
                  : {
                    color: 'var(--text-color)',
                    background: 'transparent',
                    borderRadius: '0px',
                  }
              }
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-[220px]">
          {/* Tab: Add User */}
          {activeTab === 0 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">

              {/* First Name */}
              <div className="flex flex-col gap-1">
                <FormLabel required>First Name</FormLabel>
                <TextInput
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                />
              </div>

              {/* User Name */}
              <div className="flex flex-col gap-1">
                <FormLabel required>User Name</FormLabel>
                <TextInput
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  placeholder="Enter User Name"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <FormLabel required>Last Name</FormLabel>
                <TextInput
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-1">
                <FormLabel required>Mobile Number</FormLabel>
                <TextInput
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                />
              </div>

              {/* Email ID */}
              <div className="flex flex-col gap-1">
                <FormLabel required>Email ID</FormLabel>
                <TextInput
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
              </div>

              {/* Is Active */}
              {/* Is Active */}
              <div className="flex items-center gap-3 pt-5 mt-3">
                <FormLabel required>Is Active</FormLabel>
                <CheckboxInput
                  checked={form.isActive}
                  onChange={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                />
              </div>

            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-2">
              <FormLabel required>Select Business Unit</FormLabel>
              <div className="w-[250px]">
                <SelectInput
                  value={form.businessUnit}
                  onChange={(e) => setForm((prev) => ({ ...prev, businessUnit: e.target.value }))}
                  placeholder="Select Business Unit"
                />
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="flex flex-col gap-2">
              <FormLabel required>Select Plant</FormLabel>
              <div className="w-[250px]">
                <SelectInput
                  isMulti
                  options={PLANT_OPTIONS}
                  value={form.plant}
                  onChange={(selected) => setForm((prev) => ({ ...prev, plant: selected }))}
                  placeholder="Select Plant"
                />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="flex flex-col gap-2">
              <FormLabel required>Select Role</FormLabel>
              <div className="w-[250px]">
                <SelectInput
                  isMulti
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={(selected) => setForm((prev) => ({ ...prev, role: selected }))}
                  placeholder="Select Role"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end items-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-80"
            style={{
              border: '1.5px solid var(--button-border)',
              background: 'var(--button-bg)',
              color: 'var(--text-color)',
            }}
          >
            Close
          </button>
          <SubmitButton />
        </div>
      </div>
    </div>
  )
}

export default EditUserModal