import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import DateTimePicker from '../Form/Inputs/DatePicker';
import BackButton from '../Form/Buttons/BackButton';
import NextButton from '../Form/Buttons/NextButton';
import Title from '../TitleAndLabel/Title';
import api from '../../../api/axios';

const SplitBomItemModal = ({ isOpen, onClose, onAddSuccess, selectedRow }) => {
  const [form, setForm] = useState({
    processOrderNo: '',
    resource: '',
    postingDate: null,
    movtType: '',
    oldBatch: '',
    moisture: '',
    material: '',
    plant: '',
    bomMaterials: '',
    storageLocation: '',
    totalQuantity: '',
    newBatchName: '',
    splitQuantity: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && selectedRow) {
      setForm({
        processOrderNo: selectedRow.ProcessOrder || selectedRow.OrderNo || selectedRow.Line || '',
        resource: selectedRow.Resource || '',
        postingDate: selectedRow.PostingDate ? new Date(selectedRow.PostingDate) : null,
        movtType: selectedRow.MovementType || selectedRow.movtType || '',
        oldBatch: selectedRow.Batch || selectedRow.batch || '',
        moisture: selectedRow.Moisture || selectedRow.moisture || '0',
        material: selectedRow.Material || selectedRow.material || '',
        plant: selectedRow.WERKS || selectedRow.Plant || selectedRow.plant || '',
        bomMaterials: selectedRow.Goods || selectedRow.unit1 || selectedRow.bomMaterials || '',
        storageLocation: selectedRow.StorageLocation || selectedRow.storageLocation || '',
        totalQuantity: selectedRow.Quantity || selectedRow.quantity || '0',
        newBatchName: '',
        splitQuantity: '',
      });
      setErrors({});
    }
  }, [isOpen, selectedRow]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.newBatchName) newErrors.newBatchName = 'New Batch Name is required';
    if (!form.splitQuantity) newErrors.splitQuantity = 'Split Quantity is required';
    else if (parseFloat(form.splitQuantity) <= 0) newErrors.splitQuantity = 'Must be greater than 0';
    else if (parseFloat(form.splitQuantity) >= parseFloat(form.totalQuantity)) newErrors.splitQuantity = 'Split Quantity must be less than Total Quantity';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSaving(true);
      try {
        const payload = {
          recordId: selectedRow.recordId || selectedRow.Id,
          newBatchName: form.newBatchName,
          splitQuantity: form.splitQuantity
        };

        await api.post('/process-order/bom-item/split', payload);
        alert('BOM Item split successfully');
        
        if (typeof onAddSuccess === 'function') {
          onAddSuccess();
        }
        onClose();
      } catch (error) {
        console.error('Failed to split BOM item:', error);
        alert('Failed to split BOM item');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[750px] max-w-[95vw] rounded-2xl px-6 py-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--modal-bg, #F9FAFB)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition hover:opacity-70"
        >
          <X size={20} />
        </button>

        <div className='flex items-center justify-center mb-6'>
          <Title label={"Break Entry"} />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* <div className="flex flex-col">
              <FormLabel>Process Order No.</FormLabel>
              <TextInput value={form.processOrderNo} readOnly disabled />
            </div> */}

            {/* <div className="flex flex-col">
              <FormLabel>Resource</FormLabel>
              <TextInput value={form.resource} readOnly disabled />
            </div> */}

            {/* <div className="flex flex-col">
              <FormLabel>Posting Date</FormLabel>
              <DateTimePicker
                value={form.postingDate}
                showTime={false}
                dateFormat="dd/MM/yyyy"
                disabled
              />
            </div> */}

            <div className="flex flex-col">
              <FormLabel>Movt Type</FormLabel>
              <TextInput value={form.movtType} readOnly disabled />
            </div>

            <div className="flex flex-col">
              <FormLabel>Batch</FormLabel>
              <TextInput value={form.oldBatch} readOnly disabled />
            </div>

            <div className="flex flex-col">
              <FormLabel>Moisture</FormLabel>
              <TextInput value={form.moisture} readOnly disabled />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <FormLabel>Material</FormLabel>
              <TextInput value={form.material} readOnly disabled />
            </div>

            {/* <div className="flex flex-col">
              <FormLabel>Plant</FormLabel>
              <TextInput value={form.plant} readOnly disabled />
            </div> */}

            <div className="flex flex-col">
              <FormLabel>BOM Name</FormLabel>
              <TextInput value={form.bomMaterials} readOnly disabled />
            </div>

            <div className="flex flex-col">
              <FormLabel>Storage Location</FormLabel>
              <TextInput value={form.storageLocation} readOnly disabled />
            </div>

            <div className="flex flex-col">
              <FormLabel>Total Quantity</FormLabel>
              <TextInput value={form.totalQuantity} readOnly disabled />
            </div>
          </div>
        </div>

        <hr className="my-6 border-[var(--border-color,#E5E7EB)]" />

        <div className="grid grid-cols-2 gap-x-8">
          <div className="flex flex-col">
            <FormLabel required>New Batch Name</FormLabel>
            <TextInput
              name="newBatchName"
              value={form.newBatchName}
              onChange={handleChange}
              placeholder="Enter New Batch Name"
              error={errors.newBatchName}
              style={{ border: '2px solid #79c699' }}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Split Quantity</FormLabel>
            <div className="flex gap-2">
              <div className="flex-1">
                <TextInput
                  type="number"
                  name="splitQuantity"
                  value={form.splitQuantity}
                  onChange={handleChange}
                  placeholder="Enter Quantity"
                  error={errors.splitQuantity}
                  style={{ border: '2px solid #79c699' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <BackButton onClick={onClose} label="Close" />
          <NextButton onClick={handleSave} label={saving ? "Saving..." : "Save"} disabled={saving} />
        </div>
      </div>
    </div>
  );
};

export default SplitBomItemModal;
