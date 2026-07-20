'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormLabel from '../TitleAndLabel/InputLabel';
import SelectInput from '../Form/Inputs/SelectInput';
import DaysTimeInput from '../Form/Inputs/DaysTimeInput';
import DateTimePicker from '../Form/Inputs/DatePicker';
import TextInput from '../Form/Inputs/TextInput';
import SingleTimeInput from '../Form/Inputs/SingleTimeInput';
import NextButton from '../Form/Buttons/NextButton';
import BackButton from '../Form/Buttons/BackButton';
import Title from '../TitleAndLabel/Title';

const AddNewModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  lines = [],
  resources = [],
  stoppageTypes = [],
  reasons = [],
}) => {

  const [timeRange, setTimeRange] = useState({ from: '', to: '' });
  const [stopDate, setStopDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState('');

  const [reason, setReason] = useState('');
  const [rootCause, setRootCause] = useState('');

  const [downtime, setDowntime] = useState({ days: '', time: '' });
  const [startDowntime, setStartDowntime] = useState({ days: '', time: '' });

  const [line, setLine] = useState('');
  const [resource, setResource] = useState('');
  const [stoppageType, setStoppageType] = useState('');
  const [impact, setImpact] = useState('');
  const [stockPosition, setStockPosition] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setLine(initialData.Line || '');
      setResource(initialData.Resource || '');
      setStopDate(initialData.StopDate ? new Date(initialData.StopDate) : null);
      setTimeRange({ from: initialData.StartTime || '', to: initialData.StopTime || '' });
      setStoppageType(initialData.StoppageType || '');
      setImpact(initialData.ImpactOnDispatched || '');
      setDowntime({ days: initialData.ExpectedDowntimeDays || '', time: initialData.ExpectedDowntime || '' });
      setStockPosition(initialData.StockPosition || '');
      setReason(initialData.ReasonForStoppage || '');

      setStartDate(initialData.StartDate ? new Date(initialData.StartDate) : null);
      setStartTime(initialData.StartTime || '');
      setStartDowntime({ days: initialData.ActualDowntimeDays || '', time: initialData.ActualDowntime || '' });
      setRootCause(initialData.RootCauseForStoppage || '');
    } else if (isOpen && !initialData) {
      // Reset form on new
      setLine(''); setResource(''); setStopDate(null); setTimeRange({ from: '', to: '' });
      setStoppageType(''); setImpact(''); setDowntime({ days: '', time: '' });
      setStockPosition(''); setReason('');
      setStartDate(null); setStartTime(''); setStartDowntime({ days: '', time: '' }); setRootCause('');
    }
  }, [isOpen, initialData]);

   const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleSave = () => {
    const newErrors = {};

    if (!line) newErrors.line = "Line is required";
    if (!resource) newErrors.resource = "Resource is required";
    if (!stopDate) newErrors.stopDate = "Stop date is required";
    if (!timeRange.from) newErrors.timeRangeFrom = "Start time is required";
    if (!timeRange.to) newErrors.timeRangeTo = "End time is required";
    if (!stoppageType) newErrors.stoppageType = "Stoppage type is required";
    if (!impact) newErrors.impact = "Impact is required";
    if (!downtime.days || !downtime.time) newErrors.downtime = "Expected downtime is required";
    if (!stockPosition) newErrors.stockPosition = "Stock position is required";
    if (!reason.trim()) newErrors.reason = "Reason for stoppage is required";

    if (initialData?.ID !== '0' && initialData?.ID) {
      if (!startDate) newErrors.startDate = "Start date is required";
      if (!startTime) newErrors.startTime = "Start time is required";
      if (!startDowntime.days || !startDowntime.time) newErrors.startDowntime = "Expected downtime is required";
      if (!rootCause.trim()) newErrors.rootCause = "Root cause is required";
    }

    setErrors(newErrors);


   


    if (Object.keys(newErrors).length === 0) {
      const payload = {
        ID: initialData?.ID || '0',
        WERKS: initialData?.WERKS || '',
        Line: line,
        Resource: resource,
        StopDate: stopDate ? formatDate(stopDate) : '',
        StartTime: timeRange.from,
        StopTime: timeRange.to,
        StoppageType: stoppageType,
        ImpactOnDispatched: impact,
        ExpectedDowntimeDays: downtime.days,
        ExpectedDowntime: downtime.time,
        StockPosition: stockPosition,
        ReasonForStoppage: reason,
        StartDate: startDate ? formatDate(startDate) : '',
        ActualDowntimeDays: startDowntime.days,
        ActualDowntime: startDowntime.time,
        RootCauseForStoppage: rootCause,
      };
      console.log("Payload is being passed is =============================>",)
      onSave(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl px-6 py-5 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg, #f4f4f4)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:opacity-70"
          style={{ color: 'var(--card-subtle)' }}
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center mb-4">
          <Title label={"Stoppage Alert Information"} className="mb-4" />
        </div>

        <h3 className="text-[14px] font-semibold mb-2 " style={{ color: 'var(--title)' }}>
          Stop Information :
        </h3>

        <div className="grid grid-cols-3 gap-x-5 gap-y-3 mb-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Line</FormLabel>
            <SelectInput
              placeholder="Select Line"
              options={lines.map(l => ({ label: l.UnitName || l.UnitCode, value: l.UnitCode }))}
              value={line}
              onChange={(e) => setLine(e.target.value)}
              error={errors.line}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Resource</FormLabel>
            <SelectInput
              placeholder="Select Resource"
              options={resources.map(r => ({ label: r.ResourceCode, value: r.ResourceCode }))}
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              error={errors.resource}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Stop Date</FormLabel>
            <DateTimePicker
              value={stopDate}
              onChange={setStopDate}
              showTime={false}
              placeholder="dd/MM/yyyy"
              error={errors.stopDate}
              maxDate={new Date(new Date().getFullYear() + 10, 11, 31)}
              minDate={new Date()}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Start Time</FormLabel>
            <SingleTimeInput
              value={timeRange.from}
              onChange={(val) => setTimeRange((prev) => ({ ...prev, from: val }))}
              error={errors.timeRangeFrom}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>End Time</FormLabel>
            <SingleTimeInput
              value={timeRange.to}
              onChange={(val) => setTimeRange((prev) => ({ ...prev, to: val }))}
              error={errors.timeRangeTo}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Stoppage Type</FormLabel>
            <SelectInput
              placeholder="Select Stoppage Type"
              options={stoppageTypes.map(s => ({ label: `${s.StoppageType} - ${s.Descr}`, value: s.StoppageType }))}
              value={stoppageType}
              onChange={(e) => setStoppageType(e.target.value)}
              error={errors.stoppageType}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Impact on Dispatch</FormLabel>
            <SelectInput
              placeholder="Select Impact in Dispatch"
              options={[{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }]}
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              error={errors.impact}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Expected Downtime</FormLabel>
            <DaysTimeInput
              value={downtime}
              onChange={(val) => {
                setDowntime(val);
                if (errors.downtime) setErrors(prev => ({ ...prev, downtime: null }));
              }}
              error={errors.downtime}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Stock Position</FormLabel>
            <SelectInput
              placeholder="Select Stock Position"
              options={[{ label: 'Full', value: 'Full' }, { label: 'Empty', value: 'Empty' }, { label: 'Partial', value: 'Partial' }]}
              value={stockPosition}
              onChange={(e) => setStockPosition(e.target.value)}
              error={errors.stockPosition}
            />
          </div>
        </div>

        <div className="mb-4">
          <FormLabel required>Reason for Stoppage</FormLabel>
          <div className="relative">
            <TextInput
              rows={3}
              value={reason}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setReason(e.target.value);
                  if (errors.reason) setErrors(prev => ({ ...prev, reason: null }));
                }
              }}
              placeholder="Enter Reason for Stoppage..."
              error={errors.reason}
            />
            <span className="absolute bottom-2 right-3 text-[11px]" style={{ color: 'var(--search-placeholder)' }}>
              {reason.length} / 1000
            </span>
          </div>
        </div>

        <h3 className="text-[14px] font-semibold mb-2" style={{ color: 'var(--title)' }}>
          Start Information :
        </h3>

        <div className="grid grid-cols-3 gap-x-5 gap-y-3 mb-4">
          <div className="flex flex-col gap-1">
            <FormLabel required>Start Date</FormLabel>
            <DateTimePicker
              value={startDate}
              onChange={setStartDate}
              showTime={false}
              placeholder="dd/MM/yyyy"
              error={errors.startDate}
              maxDate={new Date(new Date().getFullYear() + 10, 11, 31)}
                minDate={new Date()}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Start Time</FormLabel>
            <SingleTimeInput
              value={startTime}
              onChange={setStartTime}
              error={errors.startTime}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel required>Expected Downtime</FormLabel>
            <DaysTimeInput
              value={startDowntime}
              onChange={(val) => {
                setStartDowntime(val);
                if (errors.startDowntime) setErrors(prev => ({ ...prev, startDowntime: null }));
              }}
              error={errors.startDowntime}
            />
          </div>
        </div>

        <div className="mb-5">
          <FormLabel required>Root Cause for Stoppage</FormLabel>
          <div className="relative">
            <TextInput
              rows={3}
              value={rootCause}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setRootCause(e.target.value);
                  if (errors.rootCause) setErrors(prev => ({ ...prev, rootCause: null }));
                }
              }}
              placeholder="Root Cause for Stoppage..."
              error={errors.rootCause}
            />
            <span className="absolute bottom-2 right-3 text-[11px]" style={{ color: 'var(--search-placeholder)' }}>
              {rootCause.length} / 1000
            </span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <BackButton onClick={onClose} label="Close" />
          <NextButton onClick={handleSave} label="Save" />
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;