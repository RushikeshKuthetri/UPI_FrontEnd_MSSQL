'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Title from '../../components/Common/TitleAndLabel/Title';
import FormLabel from '../../components/Common/TitleAndLabel/InputLabel';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import DateTimePicker from '../../components/Common/Form/Inputs/DatePicker';
import ResetButton from '../../components/Common/Form/Buttons/ResetButton';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import ActionButton from '../../components/Common/Form/Buttons/ActionButton';
import Table1 from '../../components/Common/Table/Table';
import { Plus, SquarePen } from 'lucide-react';
import api from '../../api/axios';
import AddNewModal from '../../components/Common/Modals/AddNewModal';

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const EMPTY_FORM = {
  ID: '0', WERKS: '', Line: '', Resource: '',
  StopDate: '', StopTime: '',
  ExpectedDowntime: '', ExpectedDowntimeDays: '0',
  BreakdownFIR: '', StartDate: '', StartTime: '',
  ActualDowntime: '', ActualDowntimeDays: '0',
  RootCauseForStoppage: '', ReasonForStoppage: '',
  StockPosition: '', StockPositionQty: '0',
  StoppageType: '', ImpactOnDispatched: '',
};

export default function StoppageAlert() {
  const yest = getYesterday();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  
  const [plants, setPlants] = useState([]);
  const [lines, setLines] = useState([]);
  const [stoppageTypes, setStoppageTypes] = useState([]);
  const [resources, setResources] = useState([]);
  const [reasons, setReasons] = useState([]);

  const [filters, setFilters] = useState({ postingDate: yest, plantCode: '', line: '' });
  const [cluster, setCluster] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
    api.get('/stoppage-alert/clusters').then(() => {}).catch(() => {});
    api.get('/stoppages/types').then(({ data }) => setStoppageTypes(data)).catch(() => {});
  }, []);

  const activePlant = filters.plantCode;
  useEffect(() => {
    if (!activePlant) { setLines([]); setCluster(''); setResources([]); setReasons([]); return; }
    api.get('/stoppage-alert/lines', { params: { plantCode: activePlant } })
      .then(({ data }) => setLines(data)).catch(() => setLines([]));
    api.get('/stoppage-alert/cluster-by-plant', { params: { plantCode: activePlant } })
      .then(({ data }) => setCluster(data.ClusterCode || '')).catch(() => setCluster(''));
    api.get('/master/resources', { params: { plantCode: activePlant } })
      .then(({ data }) => setResources(data)).catch(() => setResources([]));
    api.get('/master/reasons', { params: { plantCode: activePlant } })
      .then(({ data }) => setReasons(data)).catch(() => setReasons([]));
  }, [activePlant]);

  const handleReset = () => {
    setFilters({ postingDate: '', plantCode: '', line: '' });
    setRows([]);
    setShowTable(false);
  };

  const fetchData = async () => {
    if (!filters.postingDate || !filters.plantCode || !filters.line) {
      alert('Please fill in all required fields (Date, Plant Name, and Line)');
      return;
    }
    setLoading(true);
    setShowTable(true);
    try {
      const { data } = await api.get('/stoppage-alert', { params: filters });
      setRows(data);
    } catch { 
      setRows([]); 
    } finally { 
      setLoading(false); 
    }
  };

  const openNew = () => {
    setInitialData({ ...EMPTY_FORM, WERKS: filters.plantCode, Line: filters.line });
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setInitialData({
      ...EMPTY_FORM, ...row,
      ID: String(row.ID || '0'),
      StopDate: row.StopDate || '',
      StartDate: row.StartDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (payload) => {
    try {
      await api.post('/stoppage-alert/save', payload);
      alert('Stoppage alert saved successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const columns = [
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <button className="transition hover:opacity-70 text-orange-500" onClick={() => openEdit(row)}>
          <SquarePen size={16} strokeWidth={2.5} />
        </button>
      ),
    },
    { key: 'ResourceText', label: 'Resource', render: (_, r) => r.ResourceText || r.ARBPL },
    { key: 'StopDate', label: 'Stop Date', render: (_, r) => (r.StopDate || '').split('T')[0] },
    { key: 'StopTime', label: 'Stop Time' },
    { key: 'StoppageReasonText', label: 'Stoppage Reason', render: (_, r) => r.StoppageReasonText || r.ReasonForStoppage },
    { key: 'StockPosition', label: 'Stack Position', render: (_, r) => r.StockPosition || '-' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Title label="Stoppage Alert" />
      </div>

      <div className="relative z-20 flex w-full flex-wrap items-end justify-start gap-4 px-4 py-3.5 rounded-xl border border-[var(--form-border)] shrink-0">
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
        
        {cluster && (
          <div className="ml-auto text-sm font-semibold text-[var(--title)] mb-2">
            Cluster : {cluster}
          </div>
        )}
      </div>

      {showTable && (
        <>
          <div className="flex my-3 items-center justify-start gap-2 shrink-0">
            <ActionButton icon={Plus} label="Add new" onClick={openNew} />
          </div>

          <div className="flex-1 min-h-0 w-full overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">Loading...</div>
            ) : (
              <Table1 columns={columns} data={rows} showPagination={true} />
            )}
          </div>
        </>
      )}

      <AddNewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={initialData}
        onSave={handleSaveModal}
        lines={lines}
        resources={resources}
        stoppageTypes={stoppageTypes}
        reasons={reasons}
      />
    </div>
  );
}
