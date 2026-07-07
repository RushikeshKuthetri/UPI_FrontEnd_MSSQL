'use client';
import React from "react";
import SingleTimeInput from "./SingleTimeInput";

/* ---------- TimeRangeInput ---------- */
const TimeRangeInput = ({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  errors = {},
  disabled = false,
}) => {
  return (
    <div className="flex items-start gap-2 w-full">
      <SingleTimeInput
        label="Start Time"
        required
        value={fromValue}
        onChange={onFromChange}
        disabled={disabled}
        error={errors.from}
      />
      <SingleTimeInput
        label="End Time"
        required
        value={toValue}
        onChange={onToChange}
        disabled={disabled}
        error={errors.to}
      />
    </div>
  );
};

export default TimeRangeInput;