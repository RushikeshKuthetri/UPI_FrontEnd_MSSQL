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
import ReverseRecordModal from '../../components/common/Modals/ReverseRecordModal';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import BackButton from '../../components/Common/Form/Buttons/BackButton';
import { Eye, SquarePen, Undo2, Check, X } from 'lucide-react';
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
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  // Inline edit state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => { });
  }, []);

  useEffect(() => {
    if (filters.plantCode && filters.postingDate) {
      api.get(`/manual-upload/check?moduleName=ProcessOrder&plantCode=${filters.plantCode}&date=${filters.postingDate}`)
        .then(({ data }) => setIsUploadEnabled(data.enabled))
        .catch(() => setIsUploadEnabled(false));
    } else {
      setIsUploadEnabled(false);
    }
  }, [filters.plantCode, filters.postingDate]);



  const handleReset = () => {
    setFilters({ postingDate: yest, plantCode: '' });
    setRows([]);
    setShowTable(false);
    setEditingIndex(null);
  };

  const fetchData = useCallback(async () => {
    if (!filters.postingDate || !filters.plantCode) {
      alert('Please fill in Date and Plant Name');
      return;
    }
    setLoading(true);
    setShowTable(true);
    setEditingIndex(null);
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
      alert('Record reversed successfully');
      setConfirmOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Reversal failed');
    } finally {
      setSaving(false);
    }
  };

  // --- Inline Edit Handlers ---
  const handleEditClick = (row, index) => {
    setEditingIndex(index);
    setEditValues({
      Operation: row.Operation || row.Line || '',
      Yield: row.Yield || row.Quantity || '',
      UOM: row.UOM || '',
      ISOUOM: row.ISOUOM || '',
      Unit1: row.Unit1UOM || row.Unit1 || row.Goods || '',
      ISOUnit1: row.Unit1ISO || row.ISOUnit1 || '',
      Remarks: row.ConfirmationText || row.Remarks || '',
    });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValues({});
  };

  const handleEditSave = async (row, index) => {
    setEditSaving(true);
    try {
      const payload = {
        Id: row.Id,
        Operation: editValues.Operation !== null && editValues.Operation !== undefined ? String(editValues.Operation) : '',
        Yield: editValues.Yield ? Number(editValues.Yield) : null,
        UOM: editValues.UOM,
        ISOUOM: editValues.ISOUOM,
        Unit1: editValues.Unit1,
        ISOUnit1: editValues.ISOUnit1,
        Remarks: editValues.Remarks,
      };
      await api.put('/process-order/update', payload);
      alert('Record updated successfully.');
      setEditingIndex(null);
      setEditValues({});
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setEditSaving(false);
    }
  };

  // Inline edit input style
  const inlineInputStyle = {
    width: '100%',
    minWidth: '60px',
    padding: '4px 8px',
    fontSize: '13px',
    border: '1.5px solid var(--form-border)',
    borderRadius: '6px',
    outline: 'none',
    background: 'var(--input-enable-bg, #fff)',
    color: 'var(--text-color, #000)',
    transition: 'border-color 0.2s',
  };

  const renderEditableCell = (field, widthClass = 'w-[90px]', type = 'text') => (
    <input
      type={type}
      value={editValues[field] ?? ''}
      onChange={(e) => handleEditChange(field, e.target.value)}
      style={inlineInputStyle}
      className={`${widthClass} focus:border-[#8A38F5]`}
      autoFocus={field === 'Operation'}
    />
  );

  const UOM_OPTIONS = ['MT', 'KWH', 'L'];

  const renderEditableSelect = (field, widthClass = 'w-[90px]', label = '') => (
    <select
      value={editValues[field] ?? ''}
      onChange={(e) => handleEditChange(field, e.target.value)}
      style={inlineInputStyle}
      className={`${widthClass} focus:border-[#8A38F5]`}
    >
      <option value="">-- Select {label} --</option>
      {UOM_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  const columns = [
    { key: 'Resource', label: 'Resource' },
    { key: 'ProcessOrder', label: 'Process Order', render: (_, r) => r.ProcessOrder || r.OrderNo || '-' },
    { key: 'Material', label: 'Material' },
    {
      key: 'Operation', label: 'Operation',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableCell('Operation', 'w-[80px]', 'number')
          : (r.Operation || r.Line || '-'),
    },
    {
      key: 'Yield', label: 'Yield',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableCell('Yield', 'w-[80px]', 'number')
          : (r.Yield || r.Quantity || '-'),
    },
    {
      key: 'UOM', label: 'UOM',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableSelect('UOM', 'w-[100px]', 'UOM')
          : (r.UOM || '-'),
    },
    {
      key: 'ISOUOM', label: 'ISOUOM',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableSelect('ISOUOM', 'w-[100px]', 'ISO UOM')
          : (r.ISOUOM || '-'),
    },
    {
      key: 'Unit1', label: 'Unit 1',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableSelect('Unit1', 'w-[100px]', 'Unit 1')
          : (r.Unit1UOM || r.Unit1 || r.Goods || '-'),
    },
    {
      key: 'ISOUnit1', label: 'ISOUnit 1',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableSelect('ISOUnit1', 'w-[100px]', 'ISO Unit 1')
          : (r.Unit1ISO || r.ISOUnit1 || '-'),
    },
    {
      key: 'Remarks', label: 'Remarks',
      render: (_, r, idx) =>
        editingIndex === idx
          ? renderEditableCell('Remarks', 'w-[100px]', 'text')
          : (r.ConfirmationText || r.Remarks || '-'),
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row, idx) =>
        editingIndex === idx ? (
          <div className="flex items-center gap-3">
            <button
              className="transition hover:opacity-70 text-[#10B981]"
              onClick={() => handleEditSave(row, idx)}
              disabled={editSaving}
              title="Save"
            >
              {editSaving ? (
                <span className="inline-block w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={16} strokeWidth={2.5} />
              )}
            </button>
            <button
              className="transition hover:opacity-70 text-[#EF4444]"
              onClick={handleEditCancel}
              disabled={editSaving}
              title="Cancel"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              className="transition hover:opacity-70 text-[#8A38F5]"
              onClick={() => handleEditClick(row, idx)}
              disabled={editingIndex !== null}
              title="Edit"
            >
              <SquarePen size={15} strokeWidth={2.5} />
            </button>
            <button className="transition hover:opacity-70 text-[#22b8cf]" onClick={() => { setSingleRow(row); setIsPoModalOpen(true); }}>
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
      <ReverseRecordModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        singleRow={singleRow}
        reason={reason}
        setReason={setReason}
        saving={saving}
        handleConfirmReverse={handleConfirmReverse}
      />

      {/* View Details Modal */}
      <PoDetailsModal isOpen={isPoModalOpen} onClose={() => setIsPoModalOpen(false)} isUploadEnabled={isUploadEnabled} selectedRow={singleRow} />
    </div>
  );
}

