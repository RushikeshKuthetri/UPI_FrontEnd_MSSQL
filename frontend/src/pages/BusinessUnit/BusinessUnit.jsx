import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import BusinessUnitModal from '../../components/common/Modals/BusinessUnitModal';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { IoSettingsOutline } from "react-icons/io5";
import SearchBar from '../../components/Common/SearchBar/SearchBar';

export default function BusinessUnit() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ BUCode: '', ShortName: '', BUName: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/business-units');
      setRows(data);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  const filtered = rows.filter(r =>
    (r.BUCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.ShortName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setForm({ BUCode: '', ShortName: '', BUName: '' });
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setForm({ BUCode: row.BUCode, ShortName: row.ShortName || '', BUName: row.BUName || '' });
    setEditMode(true);
    setDialogOpen(true);
  };

  const columns = [
    { key: 'srno', label: 'Sr No.', render: (_, __, i) => i + 1 },
    { key: 'BUCode', label: 'BU Code' },
    { key: 'ShortName', label: 'Short Name' },
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
        <Title label="Business Unit" moduleName="Manage Admin" icon={IoSettingsOutline} />
       {/* <SearchBar value={search} onChange={setSearch} placeholder="Search..." /> */}
      </div>

      <div className=" rounded-xl shadow-sm  flex-1 min-h-0 flex flex-col">
        {/* <div className="flex justify-end mb-4">
          <ActionButton icon={Plus} label="Add Business Unit" onClick={handleAdd} />
        </div> */}

        <div className="flex-1 min-h-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">Loading...</div>
          ) : (
            <Table1 columns={columns} data={filtered} showPagination={true} defaultRowsPerPage={20} />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <BusinessUnitModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editMode={editMode}
        form={form}
        setForm={setForm}
        fetchData={fetchData}
      />
    </div>
  );
}
