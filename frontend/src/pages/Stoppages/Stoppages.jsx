import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import IconButton from '../../components/Common/Form/Buttons/IconButton';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import BackButton from '../../components/Common/Form/Buttons/BackButton';
import NextButton from '../../components/Common/Form/Buttons/NextButton';
import Table1 from '../../components/Common/Table/Table';
import UploadFileModal from '../../components/Common/Modals/UploadFileModal';
import AddStoppageModal from '../../components/common/Modals/AddStoppageModal';
import EditStoppageModal from '../../components/common/Modals/EditStoppageModal';
import SplitStoppageModal from '../../components/common/Modals/SplitStoppageModal';
import OpenEventsStoppageModal from '../../components/common/Modals/OpenEventsStoppageModal';
import SearchBar from '../../components/Common/SearchBar/SearchBar';
import { CalendarCheck, ClockFading, SendHorizontal, Split, SquarePen, Upload, X, Trash2, Plus, PersonStanding } from 'lucide-react';
import api from '../../api/axios';
import { FaExchangeAlt } from "react-icons/fa";

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export default function Stoppages() {
  const yest = getYesterday();
  const fileRef = useRef();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ plantCode: '', postingDate: yest, line: '' });
  const [search, setSearch] = useState('');
  const [plants, setPlants] = useState([]);
  const [lines, setLines] = useState([]);
  const [types, setTypes] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [depts, setDepts] = useState([]);
  const [selected, setSelected] = useState(new Set());

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    WERKS: '', ARBPL: '', Line: '', Material: '', StartTime: null, EndTime: null
  });
  const [addFormLines, setAddFormLines] = useState([]);

  const [openEventsOpen, setOpenEventsOpen] = useState(false);
  const [openEventsRows, setOpenEventsRows] = useState([]);
  const [openEventsLoading, setOpenEventsLoading] = useState(false);

  const [splitOpen, setSplitOpen] = useState(false);
  const [splitRow, setSplitRow] = useState(null);
  const [splitEntries, setSplitEntries] = useState([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => { });
    api.get('/stoppages/types').then(({ data }) => setTypes(data)).catch(() => { });
    api.get('/stoppages/reasons').then(({ data }) => setReasons(data)).catch(() => { });
    api.get('/stoppages/departments').then(({ data }) => setDepts(data)).catch(() => { });
  }, []);

  useEffect(() => {
    if (filters.plantCode && filters.postingDate) {
      api.get(`/manual-upload/check?moduleName=Stoppages&plantCode=${filters.plantCode}&date=${filters.postingDate}`)
        .then(({ data }) => setIsUploadEnabled(data.enabled))
        .catch(() => setIsUploadEnabled(false));
    } else {
      setIsUploadEnabled(false);
    }
  }, [filters.plantCode, filters.postingDate]);

  useEffect(() => {
    if (filters.plantCode) {
      api.get('/stoppages/lines', { params: { plantCode: filters.plantCode } })
        .then(({ data }) => setLines(data))
        .catch(() => setLines([]));
    } else {
      setLines([]);
      setFilters((f) => ({ ...f, line: '' }));
    }
  }, [filters.plantCode]);

  const apiParams = (f) => {
    const src = f || filters;
    return { ...src, startDate: src.postingDate, endDate: src.postingDate };
  };

  const fetchData = useCallback(async (f) => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data } = await api.get('/stoppages/list', { params: apiParams(f) });
      setRows(data.data || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearch = () => {
    if (!filters.plantCode || !filters.line) {
      alert("Please select Plant and Line");
      return;
    }
    fetchData(filters);
  };

  const handleReset = () => {
    setFilters({ plantCode: '', postingDate: yest, line: '' });
    setRows([]);
    setSelected(new Set());
    setSearch('');
  };

  const displayedRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.ARBPL, r.MATNR, r.StartTime, r.StopTime, r.Duration,
      r.StoppageType, r.GRUND, r.ABTNR, r.EQUNR, r.Remarks]
        .some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }, [rows, search]);

  const handleToggleSelect = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelected((prev) =>
      prev.size === displayedRows.length && displayedRows.length > 0 ? new Set() : new Set(displayedRows.map((_, i) => i))
    );
  };

  const handleEdit = (row) => {
    setEditForm({
      WERKS: row.WERKS,
      ARBPL: row.ARBPL,
      PostingDate: (row.PostingDate || '').split('T')[0],
      StartTime: row.StartTime,
      MATNR: row.MATNR || '',
      StoppageType: row.StoppageType || '',
      GRUND: row.GRUND || '',
      ABTNR: row.ABTNR || '',
      EQUNR: row.EQUNR || '',
      Remarks: row.Remarks || '',
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put('/stoppages/update', editForm);
      alert('Record updated successfully.');
      setEditOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!addForm.WERKS || !addForm.ARBPL || !addForm.Line || !addForm.StartTime || !addForm.EndTime) {
      alert('Please fill out all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...addForm,
        StartTime: addForm.StartTime.toISOString(),
        EndTime: addForm.EndTime.toISOString(),
      };
      const { data } = await api.post('/stoppages/create-from-ws', payload);
      alert(data.message || 'Record inserted successfully');
      setAddOpen(false);
      setAddForm({ WERKS: '', ARBPL: '', Line: '', Material: '', StartTime: null, EndTime: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Insert failed');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenSplit = (row) => {
    if (row.StopTime === '23:59:59' || row.StopTime === '00:00:00') {
      alert('Cannot split open events');
      return;
    }
    setSplitRow(row);
    const st = (row.StartTime || '00:00:00').substring(0, 5);
    setSplitEntries([
      { startTime: st, endTime: '' },
      { startTime: '', endTime: '' },
    ]);
    setSplitOpen(true);
  };

  const handleSplitEndChange = (idx, val) => {
    setSplitEntries((prev) => {
      const next = prev.map((e, i) => (i === idx ? { ...e, endTime: val } : e));
      if (idx < next.length - 1) next[idx + 1] = { ...next[idx + 1], startTime: val };
      return next;
    });
  };

  const handleAddSplitRow = () => {
    const last = splitEntries[splitEntries.length - 1];
    setSplitEntries((prev) => [...prev, { startTime: last.endTime || '', endTime: '' }]);
  };

  const handleDeleteSplitRow = (idx) => {
    if (splitEntries.length <= 2) return;
    setSplitEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const calcDur = (start, end) => {
    if (!start || !end) return '';
    const toSecs = (t) => { const p = t.split(':').map(Number); return (p[0] || 0) * 3600 + (p[1] || 0) * 60; };
    const diff = toSecs(end) - toSecs(start);
    if (diff <= 0) return '';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  };

  const handleSaveSplit = async () => {
    const last = splitEntries[splitEntries.length - 1];
    const origStop = (splitRow.StopTime || '').substring(0, 5);
    if (!last.endTime) { alert('Please fill in all end times'); return; }
    if (last.endTime !== origStop) {
      alert(`Last split end time must match original stop time (${origStop})`);
      return;
    }
    for (const e of splitEntries) {
      if (!e.startTime || !e.endTime) { alert('All start and end times must be filled'); return; }
    }
    setSaving(true);
    try {
      await api.post('/stoppages/split', {
        WERKS: splitRow.WERKS,
        ARBPL: splitRow.ARBPL,
        PostingDate: splitRow.PostingDate,
        OrigStartTime: splitRow.StartTime,
        OrigStopTime: splitRow.StopTime,
        splits: splitEntries,
      });
      alert(`Record split into ${splitEntries.length} entries`);
      setSplitOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Split failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToSAP = async () => {
    if (!filters.plantCode || !filters.line) {
      alert('Please select Plant and Line before sending to SAP');
      return;
    }
    try {
      await api.post('/stoppages/send-to-sap', apiParams());
      alert('Stoppages sent to SAP successfully');
      fetchData();
    } catch (err) {
      const errs = err.response?.data?.errors;
      alert(errs ? errs.join(' | ') : (err.response?.data?.message || 'Send to SAP failed'));
    }
  };

  const handleRunAfJob = async () => {
    try {
      const { data } = await api.post('/stoppages/run-af-job', apiParams());
      alert(data.message);
      setTimeout(() => fetchData(), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'AF Job failed');
    }
  };

  const handleOpenEvents = async () => {
    setOpenEventsOpen(true);
    setOpenEventsLoading(true);
    try {
      const { data } = await api.get('/stoppages/open-events', { params: apiParams() });
      setOpenEventsRows(data || []);
    } catch {
      setOpenEventsRows([]);
    } finally {
      setOpenEventsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/stoppages/upload', fd);
      alert(data.message);
      setIsUploadModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const columns = [
    { key: 'ARBPL', label: 'Resource' },
    { key: 'StopTime', label: 'Stop Time' },
    { key: 'StartTime', label: 'Start Time' },
    { key: 'Duration', label: 'Duration' },
    { key: 'MATNR', label: 'Material' },
    { key: 'StoppageType', label: 'Type' },
    { key: 'GRUND', label: 'Reason' },
    { key: 'ABTNR', label: 'Department' },
    { key: 'EQUNR', label: 'Equipment' },
    { key: 'Remarks', label: 'Remarks', render: (val) => <div className="max-w-[120px] truncate" title={val}>{val}</div> },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button className="transition hover:opacity-70 text-orange-500" onClick={() => handleEdit(row)}>
            <SquarePen size={16} strokeWidth={2.5} />
          </button>
          <button
            className={`transition hover:opacity-70 ${row.StopTime === '23:59:59' || row.StopTime === '00:00:00' ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600'}`}
            onClick={() => handleOpenSplit(row)}
            disabled={row.StopTime === '23:59:59' || row.StopTime === '00:00:00'}
          >
            <Split size={16} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
    {
      key: 'SAPStatus',
      label: 'SAP Status',
      render: (_, row) => (
        <span className={`text-[12px] px-2 py-0.5 rounded-full ${row.SAPStatus === 'S' || row.IsTransferred ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
          {row.SAPStatus === 'S' || row.IsTransferred ? 'Uploaded' : 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Stoppage Entry" moduleName="Transaction" icon={FaExchangeAlt} />
      </div>

      {/* Filter Card */}
      <div className="relative z-20 flex w-full flex-wrap items-end justify-start gap-4 px-4 py-4 rounded-xl border border-[var(--form-border)] shadow-sm shrink-0">
        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Select Date</FormLabel>
          <DateTimePicker
            value={filters.postingDate ? new Date(filters.postingDate) : null}
            onChange={(date) => {
              const d = new Date(date);
              d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
              setFilters((f) => ({ ...f, postingDate: d.toISOString().split('T')[0] }));
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
            onChange={(e) => setFilters(f => ({ ...f, plantCode: e.target.value, line: '' }))}
            placeholder="Select Plant"
          />
        </div>

        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Select Line</FormLabel>
          <SelectInput
            options={lines.map(l => ({ label: l.Descr || l.UnitCode, value: l.UnitCode }))}
            value={filters.line}
            onChange={(e) => setFilters(f => ({ ...f, line: e.target.value }))}
            placeholder="Select Line"
          />
        </div>

        <div className="flex items-center gap-2 pb-[2px]">
          <ResetButton onClick={handleReset} />
          <SubmitButton onClick={handleSearch} />
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between mt-2 shrink-0">
        <div className="flex items-center justify-start gap-3">
          <ActionButton icon={SendHorizontal} label="Send to SAP" onClick={handleSendToSAP} />
          <ActionButton icon={Plus} label="Add Record" onClick={() => setAddOpen(true)} />
        </div>

        <div className="flex items-center justify-end gap-4 mr-2">
          {/* Using SearchBar for table filtering */}
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in table..."
          />

          {/* <IconButton icon={Split} tooltip="Split" onClick={() => {
            alert("Please use the split button located on the specific row you wish to split.");
          }} /> */}
          {isUploadEnabled && (
            <IconButton icon={Upload} tooltip="Upload" onClick={() => setIsUploadModalOpen(true)} />
          )}
        </div>
      </div>

      <div className="flex flex-col w-full mt-2 rounded-lg overflow-hidden flex-1 min-h-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
        ) : (
          <Table1 columns={columns} data={displayedRows} showPagination={true} defaultRowsPerPage={10} />
        )}
      </div>

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
      <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />

      <AddStoppageModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        addForm={addForm}
        setAddForm={setAddForm}
        plants={plants}
        addFormLines={addFormLines}
        setAddFormLines={setAddFormLines}
        handleAddSubmit={handleAddSubmit}
        saving={saving}
      />

      <EditStoppageModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        types={types}
        reasons={reasons}
        depts={depts}
        handleSaveEdit={handleSaveEdit}
        saving={saving}
      />

      <SplitStoppageModal
        isOpen={splitOpen}
        onClose={() => setSplitOpen(false)}
        splitRow={splitRow}
        splitEntries={splitEntries}
        handleSplitEndChange={handleSplitEndChange}
        calcDur={calcDur}
        handleDeleteSplitRow={handleDeleteSplitRow}
        handleAddSplitRow={handleAddSplitRow}
        handleSaveSplit={handleSaveSplit}
        saving={saving}
      />

      <OpenEventsStoppageModal
        isOpen={openEventsOpen}
        onClose={() => setOpenEventsOpen(false)}
        openEventsLoading={openEventsLoading}
        openEventsRows={openEventsRows}
      />
    </div>
  );
}
