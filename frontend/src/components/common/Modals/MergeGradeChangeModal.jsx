import React from 'react';
import FormLabel from '../../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../../components/Common/Form/Inputs/SelectInput';

export default function MergeGradeChangeModal({
  isOpen,
  onClose,
  selectedRows,
  mergeMaterial,
  setMergeMaterial,
  doMerge
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[400px] rounded-2xl p-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--modal-bg)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--title)' }}>Select Material for Merged Record</h2>
        <p className="text-sm" style={{ color: 'var(--text-color)' }}>The two selected records have different materials. Choose which material to keep:</p>
        <div className="flex flex-col gap-1">
          <FormLabel>Material</FormLabel>
          <SelectInput options={selectedRows.map(r => ({ label: r.Material, value: r.Material }))} value={mergeMaterial} onChange={(e) => setMergeMaterial(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--form-border)', color: 'var(--text-color)' }}>Cancel</button>
          <button onClick={() => doMerge(mergeMaterial)} className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white">Merge</button>
        </div>
      </div>
    </div>
  );
}
