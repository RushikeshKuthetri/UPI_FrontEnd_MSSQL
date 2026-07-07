'use client';
import React, { useId, useState } from "react";

const DateRangeInput = ({ fromValue, toValue, onFromChange, onToChange, errors = {}, disabled = false }) => {
  const fromId = useId();
  const toId = useId();
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);

  return (
    <>
   <style>{`
  input.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
  filter: var(--calendar-icon-filter, none);
}
  input.date-input::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
  input.date-input::-webkit-datetime-edit {
    color: var(--search-placeholder);
  }
  input.date-input::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
`}</style>

      <div className="flex items-center gap-2 ">

        {/* FROM */}
        <div className="relative w-full">
          <label
            htmlFor={fromId}
            className="block text-sm font-medium mb-1"
          >
            Start Date 
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id={fromId}
            type="date"
            disabled={disabled}
            value={fromValue}
            onChange={(e) => onFromChange(e.target.value)}
            onFocus={() => setFromFocused(true)}
            onBlur={() => setFromFocused(false)}
            className={`
              date-input w-full px-2 py-[4px] text-[13px]
              rounded-lg border
              bg-[var(--input-enable-bg)]
              text-[var(--select-input-value)]
              focus:outline-none
              transition-all duration-200
              ${disabled
    ? "bg-[var(--input-disable-bg)] cursor-not-allowed opacity-60"
    : "bg-[var(--input-enable-bg)]"
  }
              ${errors.from
                ? "border-red-500"
                : fromFocused
                  ? "border-[#888888] ring-1 ring-[#888888]"
                  : "border-[var(--input-enable-border)]"
              }
            `}
          />
          {errors.from && (
            <p className="text-red-400 text-xs mt-1">{errors.from}</p>
          )}
        </div>

       

        {/* TO */}
        <div className="relative w-full">
           <label
            htmlFor={fromId}
            className="block text-sm font-medium mb-1"
          >
            End Date 
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id={toId}
            type="date"
            disabled={disabled}
            value={toValue}
            onChange={(e) => onToChange(e.target.value)}
            onFocus={() => setToFocused(true)}
            onBlur={() => setToFocused(false)}
            className={`
              date-input w-full px-2 py-[4px] text-[13px]
              rounded-lg border
              bg-[var(--input-enable-bg)]
              text-[var(--select-input-value)]
              focus:outline-none
              transition-all duration-200
              ${disabled
    ? "bg-[var(--input-disable-bg)] cursor-not-allowed opacity-60"
    : "bg-[var(--input-enable-bg)]"
  }
              ${errors.to
                ? "border-red-500"
                : toFocused
                  ? "border-[#888888] ring-1 ring-[#888888]"
                  : "border-[var(--input-enable-border)]"
              }
            `}
          />
          {errors.to && (
            <p className="text-red-400 text-xs mt-1">{errors.to}</p>
          )}
        </div>

      </div>
    </>
  );
};

export default DateRangeInput;