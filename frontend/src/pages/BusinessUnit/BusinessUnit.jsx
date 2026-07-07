import React, { useState, useEffect } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import { Plus, SquarePen, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { Snackbar, Alert } from '@mui/material';

export default function BusinessUnit() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

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
    <div className="w-full h-full flex flex-col px-2 py-2">


      <div className="flex items-center justify-between mb-4">
        <Title label="Business Unit" />
        <div className="relative w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-[36px] pl-8 pr-3 rounded-lg border border-gray-300 text-sm outline-none bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-end mb-4">
          <ActionButton icon={Plus} label="Add Business Unit" onClick={handleAdd} />
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
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setDialogOpen(false)}
        >
          <div className="relative w-[500px] max-w-[95vw] rounded-2xl px-8 py-6 shadow-2xl flex flex-col" style={{ background: 'var(--modal-bg, #F9FAFB)' }}>
            <button onClick={() => setDialogOpen(false)} className="absolute top-4 right-4 transition hover:opacity-70 text-gray-700">
              <X size={20} />
            </button>

            <div className="flex items-center justify-center mb-6 mt-2">
              <Title label={editMode ? "Edit Business Unit" : "Add Business Unit"} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <FormLabel required>BU Code</FormLabel>
                <TextInput
                  placeholder="Enter BU Code"
                  value={form.BUCode}
                  onChange={e => setForm({ ...form, BUCode: e.target.value })}
                  disabled={editMode}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel required>Short Name</FormLabel>
                <TextInput
                  placeholder="Enter Short Name"
                  value={form.ShortName}
                  onChange={e => setForm({ ...form, ShortName: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FormLabel>BU Name</FormLabel>
                <TextInput
                  placeholder="Enter BU Name"
                  value={form.BUName}
                  onChange={e => setForm({ ...form, BUName: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDialogOpen(false)} className="px-4 py-1.5 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">Close</button>
              <SubmitButton onClick={() => {
                setSnack({ open: true, msg: editMode ? 'Business Unit updated' : 'Business Unit added', severity: 'success' });
                setDialogOpen(false);
                fetchData();
              }}>Save</SubmitButton>
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
