import React, { useEffect, useState } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import Table1 from '../../components/Common/Table/Table';
import { Edit } from 'lucide-react';
import api from '../../api/axios';
import { Snackbar, Alert } from '@mui/material';
import { FaExchangeAlt } from "react-icons/fa";

const MODULES = ['GradeChange', 'Stoppages', 'EquipmentStandby', 'MeterReading', 'ProcessOrder', 'ProcessParameter'];

export default function ManualUpload() {
  const [requests, setRequests] = useState([]);
  const [plants, setPlants] = useState([]);

  const [form, setForm] = useState({ ModuleName: '', PlantCode: '', FromDate: null, ToDate: null, Remark: '' });
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => { });
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    api.get('/manual-upload').then(({ data }) => {
      const transformed = data.map(r => ({
        ...r,
        IsApprovedStatus: String(r.IsApproved).trim() === '1' ? 'Approved' : String(r.IsApproved).trim() === '0' ? 'Rejected' : 'Pending'
      }));
      setRequests(transformed);
    }).catch(() => { });
  };

  const handleSubmit = async () => {
    if (!form.ModuleName || !form.PlantCode || !form.FromDate || !form.ToDate || !form.Remark) {
      setSnack({ open: true, msg: 'Please fill all required fields', severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await api.post('/manual-upload/request', {
        ModuleName: form.ModuleName,
        PlantCode: form.PlantCode,
        FromDate: form.FromDate,
        ToDate: form.ToDate,
        Reason: form.Remark
      });
      setSnack({ open: true, msg: 'Manual upload request submitted', severity: 'success' });
      setForm({ ModuleName: '', PlantCode: '', FromDate: null, ToDate: null, Remark: '' });
      fetchRequests();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Submission failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const [editingRow, setEditingRow] = useState(null);

  const handleEdit = (row) => {
    setEditingRow(row);
  };

  const handleApprove = async (row) => {
    try {
      await api.post('/manual-upload/approve', { PlantCode: row.PlantCode, ModuleName: row.ModuleName });
      setSnack({ open: true, msg: 'Request approved', severity: 'success' });
      setEditingRow(null);
      fetchRequests();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Approval failed', severity: 'error' });
    }
  };

  const handleReject = async (row) => {
    try {
      await api.post('/manual-upload/reject', { PlantCode: row.PlantCode, ModuleName: row.ModuleName });
      setSnack({ open: true, msg: 'Request rejected', severity: 'success' });
      setEditingRow(null);
      fetchRequests();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Rejection failed', severity: 'error' });
    }
  };

  const columns = [
    {
      key: 'FromDate',
      label: 'From date',
      render: (val) => val ? new Date(val).toLocaleDateString('en-GB') : ''
    },
    {
      key: 'ToDate',
      label: 'To Date',
      render: (val) => val ? new Date(val).toLocaleDateString('en-GB') : ''
    },
    {
      key: 'ModuleName',
      label: 'Module Name'
    },
    {
      key: 'PlantCode',
      label: 'Plant'
    },
    {
      key: 'IsApprovedStatus',
      label: 'Approve Status'
    },
    {
      key: 'Action',
      label: 'Action',
      center: true,
      render: (_, row) => {
        // Simple heuristic to identify a row uniquely
        const isEditing = editingRow &&
          editingRow.PlantCode === row.PlantCode &&
          editingRow.ModuleName === row.ModuleName &&
          editingRow.FromDate === row.FromDate;

        if (isEditing) {
          return (
            <div className="flex gap-2 justify-center">
              <button onClick={() => handleApprove(row)} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition">
                Approve
              </button>
              <button onClick={() => handleReject(row)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition">
                Reject
              </button>
            </div>
          );
        }

        // Hide Edit button if it's already approved
        if (String(row.IsApproved).trim() === '1') {
          return null;
        }

        return (
          <button onClick={() => handleEdit(row)} className="text-purple-500 hover:text-purple-700 transition">
            <Edit size={16} />
          </button>
        );
      }
    }
  ];

  return (
    <div className="w-full h-full flex flex-col ">
      <Title label="Enable Manual Upload" className="mb-6" moduleName="Transaction" icon={FaExchangeAlt} />
      <div className="rounded-[12px] border p-6 mb-6 mt-2" style={{ background: 'var(--bg-main-container)', borderColor: 'var(--form-border)' }}>


        <div className="grid grid-cols-4 gap-6 mb-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Select Module</FormLabel>
            <SelectInput
              options={MODULES.map(m => ({ label: m, value: m }))}
              value={form.ModuleName}
              onChange={(e) => setForm({ ...form, ModuleName: e.target.value })}
              placeholder="Select Module"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>Plant Name</FormLabel>
            <SelectInput
              options={plants.map(p => ({ label: p.PlantName || p.PlantCode, value: p.PlantCode }))}
              value={form.PlantCode}
              onChange={(e) => setForm({ ...form, PlantCode: e.target.value })}
              placeholder="Select Plant"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>From Date</FormLabel>
            <DateTimePicker
              value={form.FromDate}
              onChange={(d) => setForm({ ...form, FromDate: d })}
              placeholder="dd/mm/yyyy"
              showTime={false}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              maxDate={new Date()}
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel required>To Date</FormLabel>
            <DateTimePicker
              value={form.ToDate}
              onChange={(d) => setForm({ ...form, ToDate: d })}
              placeholder="dd/mm/yyyy"
              showTime={false}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <FormLabel required>Remark</FormLabel>
          <div className="relative">
            <textarea
              className="w-full rounded-md p-3 text-sm focus:outline-none min-h-[120px] resize-none"
              style={{
                border: '1px solid var(--input-enable-border)',
                backgroundColor: 'var(--input-enable-bg)',
                color: 'var(--text-color)',
              }}
              placeholder="Enter Remark here..."
              value={form.Remark}
              onChange={(e) => setForm({ ...form, Remark: e.target.value.slice(0, 10000) })}
            ></textarea>
            <span className="absolute bottom-3 right-3 text-xs" style={{ color: 'var(--search-placeholder)' }}>
              {form.Remark.length} / 10000
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <SubmitButton onClick={handleSubmit} disabled={saving} loading={saving}>
            Submit
          </SubmitButton>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full overflow-x-auto ">
        <Table1 columns={columns} data={requests} showPagination={true} />
      </div>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
}
