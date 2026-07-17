import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormLabel from '../TitleAndLabel/InputLabel';
import TextInput from '../Form/Inputs/TextInput';
import DateTimePicker from '../Form/Inputs/DatePicker';
import BackButton from '../Form/Buttons/BackButton';
import NextButton from '../Form/Buttons/NextButton';
import Title from '../TitleAndLabel/Title';
import api from '../../../api/axios';

const AddBomItemPOModal = ({ isOpen, onClose, onAddSuccess, selectedRow, editingRow }) => {
  const [form, setForm] = useState({
    processOrderNo: '',
    material: '',
    resource: '',
    plant: '',
    postingDate: null,
    bomMaterials: '',
    movtType: '',
    storageLocation: '',
    batch: '',
    weighfeeder: '',
    remarks: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editingRow) {
        setForm({
          processOrderNo: selectedRow?.ProcessOrder || selectedRow?.OrderNo || '',
          material: editingRow.material || '',
          resource: selectedRow?.Resource || '',
          plant: selectedRow?.WERKS || selectedRow?.Plant || '',
          postingDate: selectedRow?.PostingDate || null,
          bomMaterials: editingRow.unit1 || '',
          movtType: editingRow.movtType || '',
          storageLocation: editingRow.storageLocation || '',
          batch: editingRow.batch || '',
          weighfeeder: editingRow.correctWf !== undefined ? String(editingRow.correctWf) : '',
          remarks: editingRow.ConfirmationText || editingRow.remarks || editingRow.Remarks || '',
        });
      } else if (selectedRow) {
        setForm({
          processOrderNo: selectedRow.ProcessOrder || selectedRow.OrderNo || '',
          material: selectedRow.Material || '',
          resource: selectedRow.Resource || '',
          plant: selectedRow.WERKS || selectedRow.Plant || '',
          postingDate: selectedRow.PostingDate || null,
          bomMaterials: '',
          movtType: '',
          storageLocation: '',
          batch: '',
          weighfeeder: '',
          remarks: '',
        });
      }
    }
  }, [isOpen, selectedRow, editingRow]);

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, postingDate: date }));
    if (errors.postingDate) {
      setErrors(prev => ({ ...prev, postingDate: '' }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.processOrderNo) newErrors.processOrderNo = 'Process Order No. is required';
    if (!form.material) newErrors.material = 'Material is required';
    if (!form.resource) newErrors.resource = 'Resource is required';
    if (!form.plant) newErrors.plant = 'Plant is required';
    if (!form.bomMaterials) newErrors.bomMaterials = 'BOM Materials is required';
    if (!form.movtType) newErrors.movtType = 'Movt Type is required';
    if (!form.storageLocation) newErrors.storageLocation = 'Storage Location is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          StorageLocation: form.storageLocation,
          Plant: form.plant,
          BatchName: form.batch,
          MovtTypeBom: form.movtType,
          Resource: form.resource,
          Material: form.material,
          PostingDate: form.postingDate,
          BOMName: form.bomMaterials,
          Weighfeeder: form.weighfeeder,
          ConfirmationText: form.remarks,
          line: form.processOrderNo
        };

        if (editingRow) {
          payload.recordId = editingRow.recordId;
          await api.put('/process-order/bom-item', payload);
          alert('BOM Item updated successfully');
        } else {
          await api.post('/process-order/bom-item', payload);
          alert('BOM Item added successfully');
        }
        
        if (typeof onAddSuccess === 'function') {
          onAddSuccess();
        }
        onClose();
      } catch (error) {
        console.error('Failed to save BOM item:', error);
        const msg = error.response?.data?.message || 'Failed to save BOM item';
        alert(msg);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[500px] max-w-[95vw] rounded-2xl px-6 py-6 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg, #F9FAFB)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition hover:opacity-70"

        >
          <X size={20} />
        </button>

        <div className='flex items-center justify-center mb-4'>
          <Title label={"Add BOM Item"} />
        </div>


        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col">
            <FormLabel required>Process Order No.</FormLabel>
            <TextInput
              name="processOrderNo"
              value={form.processOrderNo}
              onChange={handleChange}
              placeholder="Enter User Name"
              error={errors.processOrderNo}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Material</FormLabel>
            <TextInput
              name="material"
              value={form.material}
              onChange={handleChange}
              placeholder="Enter User ID"
              error={errors.material}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Resource</FormLabel>
            <TextInput
              name="resource"
              value={form.resource}
              onChange={handleChange}
              placeholder="Enter Contact No"
              error={errors.resource}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Plant</FormLabel>
            <TextInput
              name="plant"
              value={form.plant}
              onChange={handleChange}
              placeholder="Enter SMS Limit"
              error={errors.plant}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel>Posting Date</FormLabel>
            <DateTimePicker
              value={form.postingDate}
              onChange={handleDateChange}
              placeholder="dd/mm/yyyy"
              showTime={false}
              dateFormat="dd/MM/yyyy"
              error={errors.postingDate}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>BOM Materials</FormLabel>
            <TextInput
              name="bomMaterials"
              value={form.bomMaterials}
              onChange={handleChange}
              placeholder="Enter BOM Materials"
              error={errors.bomMaterials}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Movt Type</FormLabel>
            <TextInput
              type="number"
              name="movtType"
              value={form.movtType}
              onChange={handleChange}
              placeholder="Enter Movt Type"
              error={errors.movtType}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel required>Storage Location</FormLabel>
            <TextInput
              name="storageLocation"
              value={form.storageLocation}
              onChange={handleChange}
              placeholder="Enter Storage Location"
              error={errors.storageLocation}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel>Batch</FormLabel>
            <TextInput
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="Enter Batch"
              error={errors.batch}
            />
          </div>

          <div className="flex flex-col">
            <FormLabel>Weighfeeder</FormLabel>
            <TextInput
              name="weighfeeder"
              value={form.weighfeeder}
              onChange={handleChange}
              placeholder="Enter Weighfeeder"
              error={errors.weighfeeder}
            />
          </div>

          <div className="flex flex-col col-span-2">
            <FormLabel>Remarks</FormLabel>
            <TextInput
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Enter Remarks"
              error={errors.remarks}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <BackButton onClick={onClose} label="Close" />
          <NextButton onClick={handleSave} label="Save" className='' />
        </div>
      </div>
    </div>
  );
};

export default AddBomItemPOModal;
