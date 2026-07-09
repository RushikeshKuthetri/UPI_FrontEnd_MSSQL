'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import PoDetailsModal from '../../components/Common/Modals/PoDetailsModal';
import { Eye, SquarePen, Undo2 } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Snackbar } from '@mui/material';
import api from '../../api/axios';
import { FaExchangeAlt } from "react-icons/fa";

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export default function ProcessOrder() {
  const yest = getYesterday();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [plants, setPlants] = useState([]);
  const [filters, setFilters] = useState({ postingDate: yest, plantCode: '' });

  const [isPoModalOpen, setIsPoModalOpen] = useState(false);

  // Reversal specific state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [singleRow, setSingleRow] = useState(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => { });
  }, []);



  const handleReset = () => {
    setFilters({ postingDate: yest, plantCode: '' });
    setRows([]);
    setShowTable(false);
  };

  const fetchData = useCallback(async () => {
    if (!filters.postingDate || !filters.plantCode) {
      alert('Please fill in Date and Plant Name');
      return;
    }
    setLoading(true);
    setShowTable(true);
    try {
      let fromDateStr = '';
      let toDateStr = '';
      if (filters.postingDate) {
        const [year, month, day] = filters.postingDate.split('-');
        fromDateStr = `${day}/${month}/${year} 00:00:00`;
        toDateStr = `${day}/${month}/${year} 23:59:59`;
      }

      const apiP = {
        PlantCode: filters.plantCode,
        FromDate: fromDateStr,
        ToDate: toDateStr,
        limit: 200
      };

      const { data } = await api.post('/process-order/list', apiP);
      setRows(data.data || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const openSingleReverse = (row) => {
    setSingleRow(row);
    setReason('');
    setConfirmOpen(true);
  };

  const handleConfirmReverse = async () => {
    setSaving(true);
    try {
      await api.post('/po-reversal/reverse', { Id: singleRow.Id, Reason: reason || 'Manual reversal' });
      setSnack({ open: true, msg: 'Record reversed successfully', severity: 'success' });
      setConfirmOpen(false);
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Reversal failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'Resource', label: 'Resource' },
    { key: 'ProcessOrder', label: 'Process Order', render: (_, r) => r.ProcessOrder || r.OrderNo || '-' },
    { key: 'Material', label: 'Material' },
    { key: 'Operation', label: 'Operation', render: (_, r) => r.Operation || r.Line || '-' },
    { key: 'Yield', label: 'Yield', render: (_, r) => r.Yield || r.Quantity || '-' },
    { key: 'UOM', label: 'UOM' },
    { key: 'ISOUOM', label: 'ISOUOM' },
    { key: 'Unit1', label: 'Unit 1', render: (_, r) => r.Unit1 || r.Goods || '-' },
    { key: 'ISOUnit1', label: 'ISOUnit 1', render: (_, r) => r.ISOUnit1 || '-' },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button className="transition hover:opacity-70 text-[#8A38F5]">
            <SquarePen size={15} strokeWidth={2.5} />
          </button>
          <button className="transition hover:opacity-70 text-[#22b8cf]" onClick={() => setIsPoModalOpen(true)}>
            <Eye size={15} strokeWidth={2.5} />
          </button>
          <button className="transition hover:opacity-70 text-[var(--text-color)]" onClick={() => openSingleReverse(row)} title="Reverse PO">
            <Undo2 size={15} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Process Order Confirm" moduleName="Transaction" icon={FaExchangeAlt} />
      </div>

      <div className="relative z-20 flex w-full flex-wrap items-end justify-start gap-4 px-4 py-4 rounded-xl border border-[var(--form-border)] shadow-sm shrink-0">
        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Select Date</FormLabel>
          <DateTimePicker
            value={filters.postingDate ? new Date(filters.postingDate) : null}
            onChange={(date) => {
              if (date) {
                const d = new Date(date);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                setFilters((f) => ({ ...f, postingDate: d.toISOString().split('T')[0] }));
              } else {
                setFilters((f) => ({ ...f, postingDate: '' }));
              }
            }}
            placeholder="Select Date"
            showTime={false}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Plant Name</FormLabel>
          <SelectInput
            options={plants.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode }))}
            value={filters.plantCode}
            onChange={(e) => setFilters(prev => ({ ...prev, plantCode: e.target.value }))}
            placeholder="Select Plant"
          />
        </div>

        <div className="flex items-center gap-2 pb-[2px]">
          <ResetButton onClick={handleReset} />
          <SubmitButton onClick={fetchData} />
        </div>
      </div>

      {showTable && (
        <>

          <div className="flex-1 min-h-0 w-full mt-3 overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">Loading...</div>
            ) : (
              <Table1 columns={columns} data={rows} showPagination={true} defaultRowsPerPage={20} />
            )}
          </div>
        </>
      )}

      {/* Confirmation Dialog for Reversal */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontSize: '18px', fontWeight: 600 }}>
          Reverse Record
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will mark the selected record as reversed and create a reversal entry. This action cannot be undone.
          </Alert>
          {singleRow && (
            <div className="mb-4 p-3 bg-[var(--input-disable-bg)] text-[var(--text-color)] rounded-md text-[13px] border border-[var(--form-border)]">
              <strong>Plant:</strong> {singleRow.WERKS || singleRow.Plant} | <strong>Resource:</strong> {singleRow.Resource} |
              <strong> Material:</strong> {singleRow.Material} | <strong>Line:</strong> {singleRow.Line || singleRow.Operation} |
              <strong> Qty:</strong> {singleRow.Quantity || singleRow.Yield} {singleRow.UOM}
            </div>
          )}
          <TextField
            fullWidth label="Reason for Reversal" multiline rows={2} size="small"
            value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incorrect quantity posted"
            sx={{
              '& .MuiInputBase-root': { color: 'var(--text-color)', bgcolor: 'var(--input-enable-bg)' },
              '& .MuiInputLabel-root': { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--form-border)' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'var(--text-color)' }}>Cancel</Button>
          <Button variant="contained" color="error" startIcon={<Undo2 size={16} />} onClick={handleConfirmReverse} disabled={saving}>
            {saving ? 'Processing...' : 'Confirm Reversal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Modal */}
      <PoDetailsModal isOpen={isPoModalOpen} onClose={() => setIsPoModalOpen(false)} />

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
}
