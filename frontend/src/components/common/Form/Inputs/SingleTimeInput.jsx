import React, { useEffect, useId, useRef, useState } from "react";
import { ClockIcon } from "lucide-react";

const SingleTimeInput = ({
  value,
  onChange,
  disabled,
  error,
  label,
  required,
}) => {
  const inputId = useId();
  const wrapperRef = useRef(null);

  const selectedHourRef = useRef(null);
  const selectedMinuteRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [hours, setHours] = useState(() => {
    if (value && value.includes(":")) {
      return Number(value.split(":")[0]);
    }
    return null;
  });

  const [minutes, setMinutes] = useState(() => {
    if (value && value.includes(":")) {
      return Number(value.split(":")[1]);
    }
    return null;
  });

  const pad = (n) => String(n).padStart(2, "0");

  // Sync with external value
  useEffect(() => {
    if (value && value.includes(":")) {
      const [h, m] = value.split(":");

      setHours(Number(h));
      setMinutes(Number(m));
    } else {
      setHours(null);
      setMinutes(null);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  // Scroll selected values into view when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        selectedHourRef.current?.scrollIntoView({
          block: "center",
        });

        selectedMinuteRef.current?.scrollIntoView({
          block: "center",
        });
      }, 0);
    }
  }, [isOpen]);

  const handleHourClick = (h) => {
    const m = minutes ?? 0;

    setHours(h);
    setMinutes(m);

    onChange?.(`${pad(h)}:${pad(m)}`);
  };

  const handleMinuteClick = (m) => {
    const h = hours ?? 0;

    setHours(h);
    setMinutes(m);

    onChange?.(`${pad(h)}:${pad(m)}`);
  };

  const displayValue =
    hours !== null && minutes !== null
      ? `${pad(hours)}:${pad(minutes)}`
      : "";

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const minuteOptions = [
    0, 5, 10, 15, 20, 25,
    30, 35, 40, 45, 50, 55,
  ];

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{
        cursor: disabled ? "not-allowed" : "default",
      }}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[var(--input-label)] text-sm font-medium mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* Trigger */}
      <div
        id={inputId}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`
          w-full h-[36px]
          flex items-center justify-between
          px-2 rounded-lg border
          text-[13px]
          transition-all duration-200
          ${
            disabled
              ? "bg-[var(--input-disable-bg)] opacity-60 pointer-events-none"
              : "bg-[var(--input-enable-bg)] cursor-pointer"
          }
          ${
            error
              ? "border-red-500"
              : isOpen
              ? "border-[#888888]"
              : "border-[var(--input-enable-border)]"
          }
        `}
      >
        <span
          className={
            displayValue
              ? "text-[var(--select-input-value)]"
              : "text-[var(--search-placeholder)]"
          }
        >
          {displayValue || "hh:mm"}
        </span>

        <ClockIcon
          className="h-3.5 w-3.5 flex-shrink-0 opacity-50"
          style={{
            color: "var(--select-input-value)",
          }}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute left-0 mt-1 z-50
            bg-[var(--input-enable-bg)]
            border border-[var(--input-enable-border)]
            rounded-lg shadow-lg
            flex overflow-hidden
          "
        >
          {/* Hours */}
          <div
            className="max-h-[180px] overflow-y-auto hide-scrollbar"
            style={{
              width: "52px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {hourOptions.map((h) => (
              <div
                key={h}
                ref={hours === h ? selectedHourRef : null}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleHourClick(h)}
                className={`
                  px-3 py-1.5
                  text-[13px]
                  text-center
                  cursor-pointer
                  transition-colors duration-150
                  ${
                    hours === h
                      ? "bg-[#FD9F35] text-white"
                      : "text-[var(--select-input-value)] hover:bg-[var(--select-input-hover)]"
                  }
                `}
              >
                {pad(h)}
              </div>
            ))}
          </div>

          {/* Minutes */}
          <div
            className="max-h-[180px] overflow-y-auto border-l border-[var(--input-enable-border)] hide-scrollbar"
            style={{
              width: "52px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {minuteOptions.map((m) => (
              <div
                key={m}
                ref={minutes === m ? selectedMinuteRef : null}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleMinuteClick(m)}
                className={`
                  px-3 py-1.5
                  text-[13px]
                  text-center
                  cursor-pointer
                  transition-colors duration-150
                  ${
                    minutes === m
                      ? "bg-[#FD9F35] text-white"
                      : "text-[var(--select-input-value)] hover:bg-[var(--select-input-hover)]"
                  }
                `}
              >
                {pad(m)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default SingleTimeInput;