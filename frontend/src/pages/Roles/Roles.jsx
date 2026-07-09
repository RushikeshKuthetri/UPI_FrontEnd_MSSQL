import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import { Plus, SquarePen, Trash2, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { Snackbar, Alert } from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

export default function Roles() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  // Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ Name: '', Description: '', IsActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/roles');
      setRows(data);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  const filtered = rows.filter(r =>
    (r.Name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.Description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setForm({ Name: '', Description: '', IsActive: true });
    setEditMode(false);
    setEditId(null);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setForm({ Name: row.Name || '', Description: row.Description || '', IsActive: !!row.IsActive });
    setEditMode(true);
    setEditId(row.Id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.Name) {
      setSnack({ open: true, msg: 'Role Name is required', severity: 'warning' });
      return;
    }
    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/roles/${editId}`, form);
        setSnack({ open: true, msg: 'Role updated successfully', severity: 'success' });
      } else {
        await api.post('/roles', form);
        setSnack({ open: true, msg: 'Role created successfully', severity: 'success' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Save failed', severity: 'error' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/roles/${id}`);
      setSnack({ open: true, msg: 'Role deleted', severity: 'success' });
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns = [
    { key: 'srno', label: 'Sr No.', render: (_, __, i) => i + 1 },
    { key: 'Name', label: 'Role Name' },
    { key: 'Description', label: 'Description' },
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
        <div className="flex gap-2 justify-center">
          <button onClick={() => handleEdit(row)} className="transition hover:opacity-70" style={{ color: '#8A38F5' }}>
            <SquarePen size={16} strokeWidth={2.5} />
          </button>
          <button onClick={() => handleDelete(row.Id)} className="transition hover:opacity-70 text-red-500">
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col ">


      <div className="flex items-center justify-between mb-2">
        <Title label="Manage Roles" moduleName="Manage Admin" icon={IoSettingsOutline} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
      </div>

      <div className=" rounded-xl border border-[var(--card-border-main)] shadow-sm p-2 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-end mb-3">
          <ActionButton icon={Plus} label="Add Role" onClick={handleAdd} />
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
          <div className="relative w-[500px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
            <button onClick={() => setDialogOpen(false)} className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700">
              <X size={20} />
            </button>
            <div className="flex items-center justify-center mb-6 mt-2">
              <Title label={editMode ? "Edit Role" : "Add Role"} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <FormLabel required>Role Name</FormLabel>
                <TextInput placeholder="Enter Role Name" value={form.Name}
                  onChange={e => setForm({ ...form, Name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel required>Description</FormLabel>
                <div className="relative">
                  <textarea
                    value={form.Description}
                    onChange={e => setForm({ ...form, Description: e.target.value.slice(0, 10000) })}
                    placeholder="Enter Description here..."
                    rows={4}
                    className="w-full rounded-lg border border-[var(--input-enable-border)] bg-[var(--input-enable-bg)] px-3 py-2 text-sm outline-none resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {form.Description.length}/10000
                  </span>
                </div>
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
