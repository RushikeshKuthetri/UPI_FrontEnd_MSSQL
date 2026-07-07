'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import Table1 from '../../components/Common/Table/Table';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import BackButton from '../../components/Common/Form/Buttons/BackButton';
import { Plus, X } from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import api from '../../api/axios';

const EMPTY_BOM = {
  WERKS: '', Resource: '', Material: '', Goods: '',
  Line: '', StorageLocation: '', MovementType: '261', WeighFeeder: '',
};

export default function UpdateBOM() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState([]);
  const [lines, setLines] = useState([]);
  const [resources, setResources] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState({ plantCode: '', line: '', resource: '', material: '' });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_BOM);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
  }, []);

  const loadLines = async (plantCode) => {
    try {
      const { data } = await api.get('/master/lines', { params: { plantCode } });
      setLines(data);
    } catch { setLines([]); }
  };

  const loadResources = async (plantCode, line) => {
    try {
      const { data } = await api.get('/master/resources', { params: { plantCode, line } });
      setResources(data);
    } catch { setResources([]); }
  };

  const loadMaterials = async (plantCode, line, resource) => {
    try {
      const { data } = await api.get('/update-bom/materials', { params: { plantCode, line, resource } });
      setMaterials(data);
    } catch { setMaterials([]); }
  };

  const f = (field) => (e) => setFilter((prev) => ({ ...prev, [field]: e.target.value }));
  const fForm = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleReset = () => {
    setFilter({ plantCode: '', line: '', resource: '', material: '' });
    setRows([]);
  };

  const handleSearch = async () => {
    if (!filter.plantCode || !filter.resource || !filter.material) {
      setSnack({ open: true, msg: 'Select Plant, Resource and Material to search', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/update-bom', {
        params: { plantCode: filter.plantCode, resource: filter.resource, material: filter.material },
      });
      setRows(data);
    } catch { 
      setRows([]); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVisibilityToggle = async (row) => {
    try {
      await api.post('/update-bom/visibility', {
        WERKS: row.WERKS, Resource: row.Resource, Material: row.Material,
        Goods: row.Goods, isVisible: !row.isVisible,
      });
      setSnack({ open: true, msg: `Visibility ${!row.isVisible ? 'enabled' : 'disabled'} for ${row.Goods}`, severity: 'success' });
      handleSearch();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Update failed', severity: 'error' });
    }
  };

  const handleSave = async () => {
    const { data: check } = await api.get('/update-bom/check', {
      params: { plant: form.WERKS, resource: form.Resource, material: form.Material, goods: form.Goods },
    });
    if (check.exists) {
      setSnack({ open: true, msg: `BOM item already exists for Goods: ${form.Goods}`, severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await api.post('/update-bom', form);
      setSnack({ open: true, msg: 'BOM item added successfully', severity: 'success' });
      setDialogOpen(false);
      setForm(EMPTY_BOM);
      handleSearch();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Save failed', severity: 'error' });
    } finally { 
      setSaving(false); 
    }
  };

  const columns = [
    { key: 'Goods', label: 'Goods' },
    { 
      key: 'isBaseMaterial', 
      label: 'Base Material',
      center: true,
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={!!row.isBaseMaterial} 
          readOnly 
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
        />
      )
    },
    {
      key: 'isVisible',
      label: 'Visible',
      center: true,
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={!!row.isVisible} 
          onChange={() => handleVisibilityToggle(row)} 
          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer" 
        />
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Update PO BOM" />
      </div>

      <div className="relative z-20 flex w-full flex-wrap items-end justify-start gap-4 px-4 py-4 rounded-xl border border-[var(--form-border)] shadow-sm shrink-0 ">
        <div className="flex flex-col gap-1 w-[200px]">
          <FormLabel required>Select Plant</FormLabel>
          <SelectInput
            options={plants.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode }))}
            value={filter.plantCode}
            onChange={(e) => { f('plantCode')(e); loadLines(e.target.value); }}
            placeholder="Select Plant"
          />
        </div>

        <div className="flex flex-col gap-1 w-[200px]">
          <FormLabel required>Select Line</FormLabel>
          <SelectInput
            options={lines.map(l => ({ label: l.UnitName, value: l.UnitCode }))}
            value={filter.line}
            onChange={(e) => { f('line')(e); loadResources(filter.plantCode, e.target.value); }}
            placeholder="Select Line"
          />
        </div>

        <div className="flex flex-col gap-1 w-[200px]">
          <FormLabel required>Select Resource</FormLabel>
          <SelectInput
            options={resources.map(r => ({ label: r.ResourceCode, value: r.ResourceCode }))}
            value={filter.resource}
            onChange={(e) => { f('resource')(e); loadMaterials(filter.plantCode, filter.line, e.target.value); }}
            placeholder="Select Resource"
          />
        </div>

        <div className="flex flex-col gap-1 w-[200px]">
          <FormLabel required>Select Material</FormLabel>
          <SelectInput
            options={materials.map(m => ({ label: m.Material, value: m.Material }))}
            value={filter.material}
            onChange={f('material')}
            placeholder="Select Material"
          />
        </div>

        <div className="flex items-center gap-2 pb-[2px]">
          <ResetButton onClick={handleReset} />
          <SubmitButton onClick={handleSearch} />
        </div>
      </div>

      <div className="mt-4 mb-2 shrink-0">
        <ActionButton 
          icon={Plus} 
          label="Add BOM Item" 
          disabled={!filter.plantCode || !filter.resource || !filter.material}
          onClick={() => { 
            setForm({ 
              ...EMPTY_BOM, 
              WERKS: filter.plantCode, 
              Line: filter.line, 
              Resource: filter.resource, 
              Material: filter.material 
            }); 
            setDialogOpen(true); 
          }} 
        />
      </div>

      <div className="flex-1 min-h-0 w-full overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">Loading...</div>
        ) : (
          <Table1 columns={columns} data={rows} showPagination={true} defaultRowsPerPage={20} />
        )}
      </div>

      {/* Add BOM Dialog */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDialogOpen(false)}
        >
          <div 
            className="relative w-[600px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col"
            style={{ background: 'var(--modal-bg, #F9FAFB)' }}
          >
            <button
              onClick={() => setDialogOpen(false)}
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
                  placeholder="Enter User Name" 
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
              <BackButton onClick={() => setDialogOpen(false)} label="Close" />
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
      )}

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
}
