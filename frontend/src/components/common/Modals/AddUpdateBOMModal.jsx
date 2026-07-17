import React from 'react';
import { X } from 'lucide-react';
import Title from '../TitleAndLabel/Title';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import TextInput from '../Form/Inputs/TextInput';
import BackButton from '../Form/Buttons/BackButton';
import SubmitButton from '../Form/Buttons/SubmitButton';

export default function AddUpdateBOMModal({
  isOpen,
  onClose,
  form,
  fForm,
  plants,
  saving,
  handleSave
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[600px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg, #F9FAFB)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700"
        >
          <X size={20} />
        </button>

        <div className='flex items-center justify-center mb-6 mt-2'>
          <Title label="Add BOM Item" />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1">
            <FormLabel required>Resource</FormLabel>
            <TextInput
              placeholder="Enter User Name"
              value={form.Resource}
              readOnly={true}
              className="bg-gray-50 text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Material</FormLabel>
            <TextInput
              placeholder="Enter User ID"
              value={form.Material}
              readOnly={true}
              className="bg-gray-50 text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Movt Type</FormLabel>
            <TextInput
              placeholder="Enter Contact No"
              type="number"
              value={form.MovementType}
              onChange={fForm('MovementType')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Line</FormLabel>
            <TextInput
              placeholder="Enter Line"
              value={form.Line}
              readOnly={true}
              className="bg-gray-50 text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Plant</FormLabel>
            <SelectInput
              options={plants.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode }))}
              value={form.WERKS}
              disabled={true}
              className="bg-gray-50 text-gray-500"
              placeholder="Select Plant"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>BOM Material</FormLabel>
            <TextInput
              placeholder="Enter BOM Materials"
              value={form.Goods}
              onChange={fForm('Goods')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Weighfeeder</FormLabel>
            <TextInput
              type={'number'}
              placeholder="Enter Weighfeeder"
              value={form.WeighFeeder}
              onChange={fForm('WeighFeeder')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Storage Location</FormLabel>
            <TextInput
              placeholder="Enter Storage Location"
              value={form.StorageLocation}
              onChange={fForm('StorageLocation')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <BackButton onClick={onClose} label="Close" />
          <SubmitButton
            onClick={handleSave}
            disabled={saving || !form.Goods}
            loading={saving}
          >
            Save
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
