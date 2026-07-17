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
import AddUpdateBOMModal from '../../components/common/Modals/AddUpdateBOMModal';
import { Plus, X } from 'lucide-react';
import api from '../../api/axios';
import { FaExchangeAlt } from "react-icons/fa";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

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
  const [searchQuery, setSearchQuery] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_BOM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => { });
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
    setSearchQuery('');
    setRows([]);
  };

  const handleSearch = async () => {
    if (!filter.plantCode || !filter.resource || !filter.material) {
      alert('Select Plant, Resource and Material to search');
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
      alert(`Visibility ${!row.isVisible ? 'enabled' : 'disabled'} for ${row.Goods}`);
      handleSearch();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleSave = async () => {
    const { data: check } = await api.get('/update-bom/check', {
      params: { plant: form.WERKS, resource: form.Resource, material: form.Material, goods: form.Goods },
    });
    if (check.exists) {
      alert(`BOM item already exists for Goods: ${form.Goods}`);
      return;
    }

    setSaving(true);
    try {
      await api.post('/update-bom', form);
      alert('BOM item added successfully');
      setDialogOpen(false);
      setForm(EMPTY_BOM);
      handleSearch();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
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
          disabled
          className="w-4 h-4 text-gray-400 border-gray-300 rounded focus:ring-gray-400 cursor-not-allowed opacity-50"
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

  const filteredRows = rows.filter(row =>
    !searchQuery || row.Goods?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Update PO BOM" moduleName="Transaction" icon={FaExchangeAlt} />
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

      <div className="mt-2 mb-2 shrink-0 flex justify-between items-center">
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
        {/* <div className="w-[300px]">
          <TextInput
            placeholder="Search Goods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Goods..." />
      </div>

      <div className="flex-1 min-h-0 w-full overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">Loading...</div>
        ) : (
          <Table1 columns={columns} data={filteredRows} showPagination={true} defaultRowsPerPage={20} />
        )}
      </div>

      {/* Add BOM Dialog */}
      <AddUpdateBOMModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        form={form}
        fForm={fForm}
        plants={plants}
        saving={saving}
        handleSave={handleSave}
      />
    </div>
  );
}
