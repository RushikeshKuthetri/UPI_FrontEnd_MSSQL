import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import RoleMenuMappingModal from '../../components/common/Modals/RoleMenuMappingModal';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
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

  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = typeof search === 'string' ? search.toLowerCase() : '';
    return (r.RoleName || '').toLowerCase().includes(q);
  });

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
      alert('Please select a Role');
      return;
    }
    setSaving(true);
    try {
      await api.post('/role-menu', { RoleId: form.RoleId, MenuIds: form.MenuIds });
      alert('Role Menu Mapping saved successfully');
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
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
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
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
      <RoleMenuMappingModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editMode={editMode}
        roles={roles}
        form={form}
        setForm={setForm}
        AVAILABLE_MENUS={AVAILABLE_MENUS}
        toggleMenu={toggleMenu}
        saving={saving}
        handleSave={handleSave}
      />

    </div>
  );
}
