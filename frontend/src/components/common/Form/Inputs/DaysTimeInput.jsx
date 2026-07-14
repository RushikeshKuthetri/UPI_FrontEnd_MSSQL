import React, { useState } from 'react';
import SelectInput from './SelectInput';
import { ClockIcon } from 'lucide-react';

/* ---------- Time Picker (HH:MM) ---------- */
const TimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [hours, setHours] = useState(
    value ? parseInt(value.split(':')[0]) : null
  );
  const [minutes, setMinutes] = useState(
    value ? parseInt(value.split(':')[1]) : null
  );

  const pad = (n) => String(n).padStart(2, '0');

  const handleSelect = (h, m) => {
    setHours(h);
    setMinutes(m);
    onChange(`${pad(h)}:${pad(m)}`);
    setIsOpen(false);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative w-[90px]">
      {/* Input */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-2 py-[5px] h-[36px] rounded-lg text-[13px] cursor-pointer"
        style={{
          background: 'var(--input-enable-bg)',
          border: '1px solid var(--input-enable-border)',
        }}
      >
        <span className="text-[var(--select-input-value)]">
          {hours !== null && minutes !== null
            ? `${pad(hours)}:${pad(minutes)}`
            : 'hh:mm'}
        </span>
        <ClockIcon size={14} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-[var(--input-enable-bg)] border border-[var(--input-enable-border)] rounded-lg shadow-lg flex overflow-hidden">
          <div
            className="max-h-[150px] overflow-y-auto w-[52px] hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {hourOptions.map((h) => (
              <div
                key={h}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(h, minutes ?? 0)}
                className={`px-3 py-1.5 text-[13px] text-center cursor-pointer transition-colors duration-150 ${
                  hours === h
                    ? 'bg-[#FD9F35] text-white'
                    : 'text-[var(--select-input-value)] hover:bg-[var(--select-input-hover)]'
                }`}
              >
                {pad(h)}
              </div>
            ))}
          </div>

          <div
            className="max-h-[150px] overflow-y-auto border-l border-[var(--input-enable-border)] w-[52px] hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {minuteOptions.map((m) => (
              <div
                key={m}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(hours ?? 0, m)}
                className={`px-3 py-1.5 text-[13px] text-center cursor-pointer transition-colors duration-150 ${
                  minutes === m
                    ? 'bg-[#FD9F35] text-white'
                    : 'text-[var(--select-input-value)] hover:bg-[var(--select-input-hover)]'
                }`}
              >
                {pad(m)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Main Days + Time Component ---------- */
const DaysTimeInput = ({
  label,
  required,
  value = { days: '', time: '' },
  onChange,
  error,
}) => {
  const DAY_OPTIONS = [
    { label: '0 Day', value: '0' },
    { label: '1 Day', value: '1' },
    { label: '2 Days', value: '2' },
    { label: '3 Days', value: '3' },
    { label: '4 Days', value: '4' },
    { label: '5 Days', value: '5' },
  ];

  const handleDaysChange = (e) => {
    onChange({ ...value, days: e.target.value });
  };

  const handleTimeChange = (time) => {
    onChange({ ...value, time });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm text-[var(--input-label)] font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        {/* Days Dropdown */}
        <div className="w-[120px]">
          <SelectInput
            options={DAY_OPTIONS}
            value={value.days}
            onChange={handleDaysChange}
            placeholder="Days"
          />
        </div>

        {/* Time Picker */}
        <TimePicker value={value.time} onChange={handleTimeChange} />
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default DaysTimeInput;