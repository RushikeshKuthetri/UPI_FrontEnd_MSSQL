'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import IconButton from '../../components/Common/Form/Buttons/IconButton';
import Table1 from '../../components/Common/Table/Table';
import { PersonStanding, SendHorizontal, Sigma, SquarePen, Upload, Check, X } from 'lucide-react';
import api from '../../api/axios';
import { FaExchangeAlt } from "react-icons/fa";

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const EMPTY_FORM = {
  WERKS: '', MeterId: '', MeterReading: '', MeterNo: '', Descr: '',
  Line: '', WorkCenterLocation: '', PostingDate: getYesterday(),
};

export default function MeterReading() {
  const yest = getYesterday();
  const fileRef = useRef();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [plants, setPlants] = useState([]);
  const [lines, setLines] = useState([]);
  const [filters, setFilters] = useState({ postingDate: yest, plantCode: '', line: '' });

  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
  }, []);

  const activePlant = filters.plantCode;
  useEffect(() => {
    if (!activePlant) { setLines([]); return; }
    api.get('/stoppage-alert/lines', { params: { plantCode: activePlant } })
      .then(({ data }) => setLines(data)).catch(() => setLines([]));
  }, [activePlant]);

  const handleReset = () => {
    setFilters({ postingDate: yest, plantCode: '', line: '' });
    setRows([]);
    setShowTable(false);
  };

  const fetchData = useCallback(async () => {
    if (!filters.postingDate || !filters.plantCode || !filters.line) {
      alert('Please fill in Date, Plant Name, and Line');
      return;
    }
    setLoading(true);
    setShowTable(true);
    try {
      const apiP = { ...filters, startDate: filters.postingDate, endDate: filters.postingDate, limit: 200 };
      const { data } = await api.get('/meter-reading/list', { params: apiP });
      setRows(data.data || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSendToSAP = async () => {
    alert('SAP WSDL service not configured in this environment');
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/meter-reading/upload', fd);
      alert(data.message);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleSaveEdit = async (row) => {
    try {
      setSaving(true);
      await api.post('/meter-reading/manual', {
        ...row,
        MeterReading: editValue
      });
      setEditingRowId(null);
      fetchData();
    } catch (err) {
      console.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'MeterId', label: 'Meter ID' },
    { key: 'Descr', label: 'Description' },
    { key: 'MeterNo', label: 'Meter Number' },
    { 
      key: 'MeterReading', 
      label: 'Meter Reading',
      render: (val, row) => {
        if (editingRowId === row.MeterId) {
          return (
            <input 
              type="number" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              className="border border-[var(--form-border)] bg-[var(--search-bg)] text-[var(--text-color)] rounded px-2 py-1 w-24 text-sm outline-none"
              autoFocus
            />
          );
        }
        return val;
      }
    },
    { key: 'ManualUploadReason', label: 'Manual Upload Reason', render: (_, row) => row.ManualUploadReason || '' },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => {
        if (editingRowId === row.MeterId) {
          return (
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => handleSaveEdit(row)} 
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition hover:bg-green-600/10 p-1.5 rounded-full flex items-center justify-center"
                title="Save"
              >
                <Check size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setEditingRowId(null)} 
                className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition hover:bg-red-600/10 p-1.5 rounded-full flex items-center justify-center"
                title="Cancel"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          );
        }
        return (
          <button 
            onClick={() => { setEditingRowId(row.MeterId); setEditValue(row.MeterReading || ''); }}
            className="transition hover:opacity-70" style={{ color: '#8A38F5' }}
          >
            <SquarePen size={16} strokeWidth={2.5} />
          </button>
        );
      },
    },
    {
      key: 'sapStatus',
      label: 'SAP status',
      render: (_, row) => (
        <span className="text-sm text-[var(--text-color)]">
          {row.IsTransferred ? 'Uploaded' : 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Meter Reading" moduleName="Transaction" icon={FaExchangeAlt} />
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
            onChange={(e) => setFilters(prev => ({ ...prev, plantCode: e.target.value, line: '' }))}
            placeholder="Select Plant"
          />
        </div>

        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Select Line</FormLabel>
          <SelectInput
            options={lines.map(l => ({ label: l.UnitName || l.UnitCode, value: l.UnitCode }))}
            value={filters.line}
            onChange={(e) => setFilters(prev => ({ ...prev, line: e.target.value }))}
            placeholder="Select Line"
          />
        </div>

        <div className="flex items-center gap-2 pb-[2px]">
          <ResetButton onClick={handleReset} />
          <SubmitButton onClick={fetchData} />
        </div>
      </div>

      {showTable && (
        <>
          <div className="flex mt-3 items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ActionButton icon={SendHorizontal} label="Send to SAP" onClick={handleSendToSAP} />
            </div>

            <div className="flex items-center gap-4 mr-2">
              <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden
                onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
              <IconButton icon={Upload} tooltip="Upload Excel" onClick={handleUploadClick} />
              <IconButton icon={PersonStanding} tooltip="Run of Job" />
              <IconButton icon={Sigma} tooltip="Sum" />
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full overflow-x-auto mt-2">
            {loading ? (
              <div className="flex items-center justify-center h-40">Loading...</div>
            ) : (
              <Table1 columns={columns} data={rows} showPagination={true} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
