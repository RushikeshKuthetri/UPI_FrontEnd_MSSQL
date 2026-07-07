'use client';
import React, { useEffect, useId, useRef, useState } from "react";
import { ClockIcon } from "lucide-react";

const TimeInput = ({
  value,
  onChange,
  disabled = false,
  error,
  placeholder = "hh:mm",
}) => {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  const [hours, setHours] = useState(() => value ? parseInt(value.split(":")[0]) : null);
  const [minutes, setMinutes] = useState(() => value ? parseInt(value.split(":")[1]) : null);

  useEffect(() => {
    if (value) {
      setHours(parseInt(value.split(":")[0]));
      setMinutes(parseInt(value.split(":")[1]));
    } else {
      setHours(null);
      setMinutes(null);
    }
  }, [value]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  const handleHourClick = (h) => {
    setHours(h);
    const m = minutes ?? 0;
    setMinutes(m);
    onChange({ target: { value: `${pad(h)}:${pad(m)}` } });
  };

  const handleMinuteClick = (m) => {
    const h = hours ?? 0;
    setHours(h);
    setMinutes(m);
    onChange({ target: { value: `${pad(h)}:${pad(m)}` } });
  };

  const displayValue = hours !== null && minutes !== null
    ? `${pad(hours)}:${pad(minutes)}`
    : "";

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ cursor: disabled ? "not-allowed" : "default" }}
    >
      {/* TRIGGER */}
      <div
        onClick={() => { if (!disabled) setIsOpen((prev) => !prev); }}
        className={`
          w-full flex items-center justify-between
          px-2 py-[4px] rounded-lg border
          text-[13px] cursor-pointer
          transition-all duration-200
          ${disabled
            ? "bg-[var(--input-disable-bg)] opacity-60 pointer-events-none"
            : "bg-[var(--input-enable-bg)]"
          }
          ${error
            ? "border-red-500"
            : isFocused || isOpen
              ? "border-[#888888]"          
              : "border-[var(--input-enable-border)]"
          }
        `}
      >
        <span className={
          displayValue
            ? "text-[var(--select-input-value)]"
            : "text-[var(--search-placeholder)]"
        }>
          {displayValue || placeholder}
        </span>
        <ClockIcon
          className="h-3 w-3 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "var(--select-input-value)" }}
        />
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="
          absolute z-50 mt-1 left-0
          bg-[var(--input-enable-bg)]
          border border-[var(--input-enable-border)]
          rounded-lg shadow-lg overflow-hidden
          flex
        ">
          {/* HOURS */}
          <div className="flex flex-col border-r border-[var(--input-enable-border)]">
            <div className="py-1 text-[11px] text-[var(--search-placeholder)] border-b border-[var(--input-enable-border)] text-center">
              HH
            </div>
            <ul
              className="overflow-y-auto max-h-[180px] hide-scrollbar"
              style={{ width: "52px", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {hourOptions.map((h) => (
                <li
                  key={h}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleHourClick(h)}
                  className={`
                    py-1.5 text-[13px] text-center cursor-pointer
                    transition-colors duration-150
                    text-[var(--select-input-value)]
                    ${hours === h
                      ? "bg-[var(--select-input)]"
                      : "hover:bg-[var(--select-input-hover)]"
                    }
                  `}
                >
                  {pad(h)}
                </li>
              ))}
            </ul>
          </div>

          {/* MINUTES */}
          <div className="flex flex-col">
            <div className="py-1 text-[11px] text-[var(--search-placeholder)] border-b border-[var(--input-enable-border)] text-center">
              MM
            </div>
            <ul
              className="overflow-y-auto max-h-[180px] hide-scrollbar"
              style={{ width: "52px", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {minuteOptions.map((m) => (
                <li
                  key={m}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleMinuteClick(m)}
                  className={`
                    py-1.5 text-[13px] text-center cursor-pointer
                    transition-colors duration-150
                    text-[var(--select-input-value)]
                    ${minutes === m
                      ? "bg-[var(--select-input)]"
                      : "hover:bg-[var(--select-input-hover)]"
                    }
                  `}
                >
                  {pad(m)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TimeInput;