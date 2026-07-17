import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import IconButton from '../../components/Common/Form/Buttons/IconButton';
import CheckboxInput from '../../components/Common/Form/Inputs/CheckboxInput';
import TextInput from '../../components/Common/Form/Inputs/TextInput';
import Table1 from '../../components/Common/Table/Table';
import Pagination from '../../components/Common/Pagination/Pagination';
import UploadFileModal from '../../components/Common/Modals/UploadFileModal';
import AddGradeChangeModal from '../../components/common/Modals/AddGradeChangeModal';
import EditGradeChangeModal from '../../components/common/Modals/EditGradeChangeModal';
import MergeGradeChangeModal from '../../components/common/Modals/MergeGradeChangeModal';
import OpenEventsModal from '../../components/common/Modals/OpenEventsModal';
import ShiftDurationModal from '../../components/common/Modals/ShiftDurationModal';
import { CalendarCheck, Check, ClockFading, Merge, PersonStanding, SendHorizontal, SquarePen, Upload, X, Download, Plus } from 'lucide-react';
import api from '../../api/axios';
import { FaExchangeAlt } from "react-icons/fa";

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function fmtTime(val) {
  if (!val) return '';
  if (typeof val === 'string' && val.includes('T')) return val.substring(11, 19);
  return String(val).substring(0, 8);
}

const EMPTY_EDIT = {
  PlantCode: '', ResourceCode: '', PostingDate: '', OriginalStartTime: '',
  StartTime: '', StopTime: '', Material: '', GRUND: '', Remarks: '',
};

export default function GradeChange() {
  const yest = getYesterday();
  const fileRef = useRef();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ plantCode: '', postingDate: yest, line: '' });
  const [plants, setPlants] = useState([]);
  const [lines, setLines] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [resourceDuration, setResourceDuration] = useState([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [saving, setSaving] = useState(false);
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    PlantCode: '', ResourceName: '', Line: '', Material: '', StartTime: null, EndTime: null
  });
  const [addFormLines, setAddFormLines] = useState([]);

  const [openEventsOpen, setOpenEventsOpen] = useState(false);
  const [openEventsRows, setOpenEventsRows] = useState([]);
  const [openEventsLoading, setOpenEventsLoading] = useState(false);

  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeMaterial, setMergeMaterial] = useState('');

  const [shiftDurationModalOpen, setShiftDurationModalOpen] = useState(false);
  const [shiftDurationData, setShiftDurationData] = useState([]);
  const [shiftDurationLoading, setShiftDurationLoading] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode })))).catch(() => { });
    api.get('/grade-change/reasons').then(({ data }) => setReasons(data.map(r => ({ label: `${r.GRUND} – ${r.GRDTX}`, value: r.GRUND })))).catch(() => { });
  }, []);

  useEffect(() => {
    if (filters.plantCode && filters.postingDate) {
      api.get(`/manual-upload/check?moduleName=GradeChange&plantCode=${filters.plantCode}&date=${filters.postingDate}`)
        .then(({ data }) => setIsUploadEnabled(data.enabled))
        .catch(() => setIsUploadEnabled(false));
    } else {
      setIsUploadEnabled(false);
    }
  }, [filters.plantCode, filters.postingDate]);

  useEffect(() => {
    if (filters.plantCode) {
      api.get('/grade-change/lines', { params: { plantCode: filters.plantCode } })
        .then(({ data }) => setLines(data.map(l => ({ label: l, value: l }))))
        .catch(() => setLines([]));
    } else {
      setLines([]);
      setFilters((f) => ({ ...f, line: '' }));
    }
  }, [filters.plantCode]);

  const fetchData = useCallback(async (currentFilters) => {
    const f = currentFilters || filters;
    setLoading(true);
    setSelected(new Set());
    try {
      const apiParams = { ...f, startDate: f.postingDate, endDate: f.postingDate };
      const [listRes, rdRes] = await Promise.all([
        api.get('/grade-change/list', { params: apiParams }),
        api.get('/grade-change/resource-duration', { params: apiParams }),
      ]);
      setRows(listRes.data.data || []);
      setResourceDuration(rdRes.data || []);
    } catch {
      setRows([]);
      setResourceDuration([]);
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
    setResourceDuration([]);
    setSelected(new Set());
  };

  const handleToggleSelect = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelected((prev) =>
      prev.size === rows.length && rows.length > 0 ? new Set() : new Set(rows.map((_, i) => i))
    );
  };

  const selectedRows = [...selected].map((i) => rows[i]);

  const handleEdit = (row) => {
    const st = fmtTime(row.StartTime);
    const et = fmtTime(row.StopTime);
    setEditForm({
      PlantCode: row.PlantCode,
      ResourceCode: row.ResourceCode,
      PostingDate: (row.PostingDate || '').split('T')[0],
      OriginalStartTime: st,
      StartTime: st.substring(0, 5),
      StopTime: et.substring(0, 5),
      Material: row.Material || '',
      GRUND: row.GRUND || '',
      Remarks: row.Remarks || '',
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put('/grade-change/update', editForm);
      alert('Record updated successfully.');
      setEditOpen(false);
      fetchData();
    } catch (err) {
      // alert(err.response?.data?.message || 'Update failed');
      console.log("err", err)
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!addForm.PlantCode || !addForm.ResourceName || !addForm.Material || !addForm.Line || !addForm.StartTime || !addForm.EndTime) {
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
      const { data } = await api.post('/grade-change/create-from-ws', payload);
      alert(data.message || 'Record inserted successfully');
      setAddOpen(false);
      setAddForm({ PlantCode: '', ResourceName: '', Line: '', Material: '', StartTime: null, EndTime: null });
      fetchData();
    } catch (err) {
      // alert(err.response?.data?.message || 'Insert failed');
      console.log("err", err)
    } finally {
      setSaving(false);
    }
  };

  const handleMerge = () => {
    if (selected.size !== 2) {
      alert('Select exactly 2 records to merge.');
      return;
    }
    const [r1, r2] = selectedRows;
    if (r1.ResourceCode !== r2.ResourceCode) {
      alert('Both records must be for the same resource');
      return;
    }
    if (r1.Material !== r2.Material) {
      setMergeMaterial(r1.Material);
      setMergeDialogOpen(true);
    } else {
      doMerge(r1.Material);
    }
  };

  const doMerge = async (material) => {
    const normalizedRecords = selectedRows.map((r) => ({
      ...r,
      StartTime: fmtTime(r.StartTime),
      StopTime: fmtTime(r.StopTime),
      PostingDate: (r.PostingDate || '').split('T')[0],
    }));
    try {
      await api.post('/grade-change/merge', { records: normalizedRecords, material });
      alert('Records merged successfully');
      setMergeDialogOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Merge failed');
    }
  };

  const apiFilters = () => ({ ...filters, startDate: filters.postingDate, endDate: filters.postingDate });

  const handleSendToSAP = async () => {
    try {
      await api.post('/grade-change/send-to-sap', apiFilters());
      alert('Data sent to SAP successfully');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Send to SAP failed');
    }
  };

  const handleRunAfJob = async () => {
    try {
      const { data } = await api.post('/grade-change/run-af-job', apiFilters());
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
      const { data } = await api.get('/grade-change/open-events', { params: apiFilters() });
      setOpenEventsRows(data || []);
    } catch {
      setOpenEventsRows([]);
    } finally {
      setOpenEventsLoading(false);
    }
  };

  const handleShiftDuration = async () => {
    if (selected.size === 0) {
      alert('Select records for Shift Duration');
      return;
    }
    const serialNumbers = selectedRows.map(r => r.SerialNumber || r.SerialNumberActual).filter(Boolean);
    if (serialNumbers.length === 0) {
      alert('Selected records do not have SerialNumbers');
      return;
    }
    setShiftDurationLoading(true);
    setShiftDurationModalOpen(true);
    try {
      const payload = {
        SerialNumberCsv: serialNumbers.join(','),
        Line: filters.line,
        PlantCode: filters.plantCode,
        postdate: filters.postingDate,
      };
      const { data } = await api.post('/grade-change/shift-duration/calculate', payload);
      setShiftDurationData(data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Shift Duration Calculation failed');
      setShiftDurationModalOpen(false);
    } finally {
      setShiftDurationLoading(false);
    }
  };

  const handleSaveShiftDuration = async () => {
    if (shiftDurationData.length === 0) return;
    setSaving(true);
    try {
      await api.post('/grade-change/shift-duration/save', { data: shiftDurationData });
      alert('Grade Time Shift Duration updated Successfully');
      setShiftDurationModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/grade-change/upload', fd);
      alert(data.message);
      setIsUploadModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/grade-change/template', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'GradeChange_Upload_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Download failed');
    }
  };

  const columns = [
    {
      key: 'selected',
      label: (
        <CheckboxInput
          checked={rows.length > 0 && selected.size === rows.length}
          onChange={handleToggleAll}
        />
      ),
      render: (_, row, idx) => (
        <CheckboxInput
          checked={selected.has(idx)}
          onChange={() => handleToggleSelect(idx)}
        />
      ),
    },
    { key: 'ResourceCode', label: 'Resource' },
    { key: 'Material', label: 'Material' },
    { key: 'StartTime', label: 'Start Time', render: (val) => fmtTime(val) },
    { key: 'StopTime', label: 'Stop Time', render: (val) => fmtTime(val) },
    { key: 'Duration', label: 'Duration' },
    { key: 'GRUND', label: 'Reason' },
    { key: 'Remarks', label: 'Remarks' },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <button
          className="transition hover:opacity-70"
          style={{ color: '#8A38F5' }}
          onClick={() => handleEdit(row)}
        >
          <SquarePen size={16} strokeWidth={2.5} />
        </button>
      ),
    },
    {
      key: 'SAPStatus',
      label: 'SAP status',
      render: (value) => (
        <span className="text-sm" style={{ color: 'var(--text-color)' }}>
          {value === 'S' ? 'Uploaded' : (value || '—')}
        </span>
      ),
    },
  ];

  const resourceColumns = [
    { key: 'Resource', label: 'Resource', center: true },
    { key: 'TotalDuration', label: 'Total Duration', center: true },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Grade Change" moduleName="Transaction" icon={FaExchangeAlt} />
      </div>

      {/* Filters */}
      <div className="relative z-20 flex w-full flex-wrap items-end justify-start gap-4 px-4 py-4 rounded-xl border border-[var(--form-border)]  shadow-sm shrink-0">
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
            options={plants}
            value={filters.plantCode}
            onChange={(e) => setFilters(f => ({ ...f, plantCode: e.target.value, line: '' }))}
            placeholder="Select Plant"
          />
        </div>

        <div className="flex flex-col gap-1 w-[230px]">
          <FormLabel required>Select Line</FormLabel>
          <SelectInput
            options={lines}
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
          <label className="text-[var(--text-color)] text-sm font-medium">
            {selected.size} items selected
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 mr-2">
          <IconButton icon={ClockFading} tooltip="Shift Duration" onClick={handleShiftDuration} />
          <IconButton icon={Merge} tooltip="Merge" onClick={handleMerge} />
          {isUploadEnabled && (
            <IconButton icon={Upload} tooltip="Upload" onClick={() => setIsUploadModalOpen(true)} />
          )}
          <IconButton icon={CalendarCheck} tooltip="Open Event" onClick={handleOpenEvents} />
        </div>
      </div>

      <div className="flex flex-col w-full mt-2 rounded-lg  overflow-hidden flex-1 min-h-0">
        <Table1 columns={columns} data={rows} showPagination={true} defaultRowsPerPage={10} />
      </div>

      {resourceDuration.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-2 shrink-0">
          <label className="font-semibold text-[var(--text-color)] mb-1">Resource Wise Duration</label>
          <div className="overflow-x-auto w-full mb-4 ">
            <Table1 columns={resourceColumns} data={resourceDuration} />
          </div>
        </div>
      )}

      {/* Upload Modal (Using dummy file handling logic connected to our actual handleUpload) */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
      <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />

      {/* Refactored Modals */}
      <AddGradeChangeModal
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

      <EditGradeChangeModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        reasons={reasons}
        handleSaveEdit={handleSaveEdit}
        saving={saving}
      />

      <MergeGradeChangeModal
        isOpen={mergeDialogOpen}
        onClose={() => setMergeDialogOpen(false)}
        selectedRows={selectedRows}
        mergeMaterial={mergeMaterial}
        setMergeMaterial={setMergeMaterial}
        doMerge={doMerge}
      />

      <OpenEventsModal
        isOpen={openEventsOpen}
        onClose={() => setOpenEventsOpen(false)}
        openEventsLoading={openEventsLoading}
        openEventsRows={openEventsRows}
      />

      <ShiftDurationModal
        isOpen={shiftDurationModalOpen}
        onClose={() => setShiftDurationModalOpen(false)}
        shiftDurationLoading={shiftDurationLoading}
        shiftDurationData={shiftDurationData}
        handleSaveShiftDuration={handleSaveShiftDuration}
        saving={saving}
      />
    </div>
  );
}
