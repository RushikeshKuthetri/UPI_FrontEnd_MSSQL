import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import Table1 from '../../components/Common/Table/Table';
import PlantDetailsModal from '../../components/common/Modals/PlantDetailsModal';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

const EMPTY_PLANT = { PlantCode: '', PlantName: '', DisplayName: '', BussinesUnitBUCode: '', IsActive: true };

export default function PlantDetails() {
  const [rows, setRows] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(EMPTY_PLANT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
    api.get('/business-units').then(({ data }) => setBusinessUnits(data)).catch(() => { });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/plant-details');
      setRows(data);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = typeof search === 'string' ? search.toLowerCase() : '';
    return (r.PlantName || '').toLowerCase().includes(q) ||
           (r.PlantCode || '').toLowerCase().includes(q) ||
           (r.DisplayName || '').toLowerCase().includes(q);
  });

  const handleAdd = () => {
    setForm(EMPTY_PLANT);
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setForm({
      PlantCode: row.PlantCode,
      PlantName: row.PlantName || '',
      DisplayName: row.DisplayName || '',
      BussinesUnitBUCode: row.BussinesUnitBUCode || '',
      IsActive: row.IsActive !== undefined ? !!row.IsActive : true,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.PlantCode || !form.PlantName) {
      alert('Plant Code and Plant Name are required');
      return;
    }
    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/plant-details/${form.PlantCode}`, form);
        alert('Plant updated successfully');
      } else {
        await api.post('/plant-details', form);
        alert('Plant created successfully');
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'srno', label: 'Sr No.', render: (_, __, i) => i + 1 },
    { key: 'PlantName', label: 'Plant Name' },
    { key: 'DisplayName', label: 'Display Name' },
    { key: 'BussinesUnitBUCode', label: 'Business Unit' },
    {
      key: 'IsActive', label: 'Is Active',
      render: (val) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'action', label: 'Action', center: true,
      render: (_, row) => (
        <button onClick={() => handleEdit(row)} className="transition hover:opacity-70" style={{ color: '#8A38F5' }}>
          <SquarePen size={16} strokeWidth={2.5} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col ">

      <div className="flex items-center justify-between mb-2">
        <Title label="Plant Details" moduleName="Manage Admin" icon={IoSettingsOutline} />
       <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      </div>

      <div className=" rounded-xl border border-[var(--card-border-main)] shadow-sm p-2 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-end mb-3">
          <ActionButton icon={Plus} label="Add Plant" onClick={handleAdd} />
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">Loading...</div>
          ) : (
            <Table1 columns={columns} data={filtered} showPagination={true} defaultRowsPerPage={20} />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <PlantDetailsModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editMode={editMode}
        form={form}
        setForm={setForm}
        businessUnits={businessUnits}
        handleSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
