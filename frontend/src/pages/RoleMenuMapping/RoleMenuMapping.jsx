import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { Snackbar, Alert } from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

const AVAILABLE_MENUS = [
  'Grade Change', 'Stoppage Entry', 'Meter Reading', 'Process Order Confirm',
  'Stoppage Alert', 'Update PO BOM', 'Enable Manual Upload',
];

export default function RoleMenuMapping() {
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  // Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ RoleId: '', MenuIds: [] });
  const [menuOptions, setMenuOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
    api.get('/roles').then(({ data }) => setRoles(data)).catch(() => {});
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/role-menu');
      setRows(data.grouped || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  const filtered = rows.filter(r =>
    (r.RoleName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setForm({ RoleId: '', MenuIds: [] });
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = async (row) => {
    try {
      const { data } = await api.get(`/role-menu/${row.RoleId}`);
      setForm({ RoleId: row.RoleId, MenuIds: data || [] });
    } catch {
      setForm({ RoleId: row.RoleId, MenuIds: row.Menus?.map(m => m.MenuId) || [] });
    }
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.RoleId) {
      setSnack({ open: true, msg: 'Please select a Role', severity: 'warning' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/role-menu', { RoleId: form.RoleId, MenuIds: form.MenuIds });
      setSnack({ open: true, msg: 'Role Menu Mapping saved successfully', severity: 'success' });
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Save failed', severity: 'error' });
    } finally { setSaving(false); }
  };

  const toggleMenu = (menuTitle) => {
    setForm(prev => {
      const idx = prev.MenuIds.indexOf(menuTitle);
      if (idx > -1) {
        return { ...prev, MenuIds: prev.MenuIds.filter(m => m !== menuTitle) };
      } else {
        return { ...prev, MenuIds: [...prev.MenuIds, menuTitle] };
      }
    });
  };

  const columns = [
    { key: 'srno', label: 'Sr No.', render: (_, __, i) => i + 1 },
    { key: 'RoleName', label: 'Role' },
    {
      key: 'Menus', label: 'Menus',
      render: (val) => (
        <div className="whitespace-normal break-words max-w-[450px]">
          {(val || []).map(m => m.MenuTitle).join(', ')}
        </div>
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
        <Title label="Role Menu Mapping" moduleName="Manage Admin" icon={IoSettingsOutline} />
        {/* <div className="relative w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
       className="w-full h-[36px] pl-8 pr-3 rounded-lg border border-[var(--search-border)] text-sm outline-none bg-[var(--search-bg)] text-[var(--text-color)] placeholder:text-[var(--search-placeholder)]"/>
        </div> */}
        <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
      </div>

      <div className="rounded-xl border border-[var(--card-border-main)] shadow-sm p-2 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-end mb-3">
          <ActionButton icon={Plus} label="Add Role Menu" onClick={handleAdd} />
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
              <Title label={editMode ? "Edit Role Menu Mapping" : "Add Role Menu Mapping"} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <FormLabel required>Select Role</FormLabel>
                <SelectInput
                  options={roles.map(r => ({ label: r.Name, value: r.Id }))}
                  value={form.RoleId}
                  onChange={e => setForm({ ...form, RoleId: e.target.value })}
                  placeholder="Select Role"
                  disabled={editMode}
                />
              </div>

              <div className="flex flex-col gap-1">
                <FormLabel required>Assign Menus</FormLabel>
                <div className="border border-gray-200 rounded-lg p-3 max-h-[250px] overflow-y-auto flex flex-col gap-2">
                  {AVAILABLE_MENUS.map((menu, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={form.MenuIds.includes(idx + 1) || form.MenuIds.includes(menu)}
                        onChange={() => toggleMenu(idx + 1)}
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{menu}</span>
                    </label>
                  ))}
                </div>
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
