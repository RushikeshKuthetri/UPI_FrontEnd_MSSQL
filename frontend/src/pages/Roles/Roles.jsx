import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import RoleModal from '../../components/common/Modals/RoleModal';
import { Plus, SquarePen, Trash2, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

export default function Roles() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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

  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = typeof search === 'string' ? search.toLowerCase() : '';
    return (r.Name || '').toLowerCase().includes(q) ||
           (r.Description || '').toLowerCase().includes(q);
  });

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
      alert('Role Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/roles/${editId}`, form);
        alert('Role updated successfully');
      } else {
        await api.post('/roles', form);
        alert('Role created successfully');
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/roles/${id}`);
      alert('Role deleted');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
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
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
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
      <RoleModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editMode={editMode}
        form={form}
        setForm={setForm}
        saving={saving}
        handleSave={handleSave}
      />

    </div>
  );
}
