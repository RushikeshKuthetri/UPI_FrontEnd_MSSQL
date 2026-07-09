import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { Snackbar, Alert } from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

const EMPTY_PLANT = { PlantCode: '', PlantName: '', DisplayName: '', BussinesUnitBUCode: '', IsActive: true };

export default function PlantDetails() {
  const [rows, setRows] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

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

  const filtered = rows.filter(r =>
    (r.PlantName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.PlantCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.DisplayName || '').toLowerCase().includes(search.toLowerCase())
  );

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
      setSnack({ open: true, msg: 'Plant Code and Plant Name are required', severity: 'warning' });
      return;
    }
    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/plant-details/${form.PlantCode}`, form);
        setSnack({ open: true, msg: 'Plant updated successfully', severity: 'success' });
      } else {
        await api.post('/plant-details', form);
        setSnack({ open: true, msg: 'Plant created successfully', severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Save failed', severity: 'error' });
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
       <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
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
      {dialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setDialogOpen(false)}>
          <div className="relative w-[550px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
            <button onClick={() => setDialogOpen(false)} className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700">
              <X size={20} />
            </button>
            <div className="flex items-center justify-center mb-6 mt-2">
              <Title label={editMode ? "Edit Plant" : "Add Plant"} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <FormLabel required>Plant Code</FormLabel>
                <TextInput placeholder="Enter Plant Code" value={form.PlantCode}
                  onChange={e => setForm({ ...form, PlantCode: e.target.value })} disabled={editMode} />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel required>Plant Name</FormLabel>
                <TextInput placeholder="Enter Plant Name" value={form.PlantName}
                  onChange={e => setForm({ ...form, PlantName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel>Display Name</FormLabel>
                <TextInput placeholder="Enter Display Name" value={form.DisplayName}
                  onChange={e => setForm({ ...form, DisplayName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel>Business Unit</FormLabel>
                <SelectInput
                  options={businessUnits.map(b => ({ label: `${b.BUCode} - ${b.ShortName || b.BUName}`, value: b.BUCode }))}
                  value={form.BussinesUnitBUCode}
                  onChange={e => setForm({ ...form, BussinesUnitBUCode: e.target.value })}
                  placeholder="Select Business Unit"
                />
              </div>
              <div className="flex items-center gap-2">
                <FormLabel required>Is Active</FormLabel>
                <input type="checkbox" checked={form.IsActive}
                  onChange={e => setForm({ ...form, IsActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
   <button onClick={() => setDialogOpen(false)} className="px-4 py-1.5 rounded-md border border-[var(--form-border)] text-sm font-medium hover:bg-[var(--button-hover-bg)] text-[var(--text-color)] transition">Close</button>              <SubmitButton onClick={handleSave} loading={saving}>Save</SubmitButton>
            </div>
          </div>
        </div>
      )}

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
}
