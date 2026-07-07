
import { CalendarDays, Clock, Eye, EyeOff } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TextInput = ({
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 1,
  isPassword = false,
  disabled,
  type = "text"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = useId();
  const inputRef = useRef(null);


  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;





 
  useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    input.no-password-toggle::-ms-reveal,
    input.no-password-toggle::-ms-clear {
      display: none;
    }

    input.no-password-toggle::-webkit-password-toggle-button {
      visibility: hidden;
      pointer-events: none;
    }

    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator {
      opacity: 0;
      display: none;
    }

    /* ✅ number arrows remove */
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  `;
  document.head.appendChild(style);

  return () => document.head.removeChild(style);
}, []);

  const isDate = type === "date";
  const isTime = type === "time";
  const isNumber = type === "number";
  const hasRightIcon = isPassword || isDate || isTime  || isNumber ;

  const handleKeyDown = (e) => {
  if (isNumber && ["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};

  const handleDateChange = (date) => {
    if (onChange) {
      if (!date) {
        onChange({ target: { name, value: "" } });
        return;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      onChange({ target: { name, value: dateString } });
    }
  };

  const parsedDate = value ? new Date(value) : null;

  return (

    <div className="relative w-full">
      {rows === 1 ? (
        <>
          {isDate ? (
            <div className="relative w-full h-[36px]">
              <DatePicker
                selected={parsedDate}
                onChange={handleDateChange}
                disabled={disabled}
                placeholderText={placeholder || "dd/MM/yyyy"}
                wrapperClassName="w-full h-full"
                className={`w-full h-full p-1 py-2 cursor-pointer rounded-lg !text-[13px] !border !border-[var(--input-enable-border)] text-[var(--picker-text)] focus:outline-none focus:ring-[0.2px] focus:ring-[#767575] placeholder:text-[12px] placeholder:text-[var(--search-placeholder)] pl-2 bg-[var(--input-enable-bg)] transition-all duration-200 ${disabled ? "bg-[var(--input-disable-bg)] cursor-not-allowed" : "bg-[var(--input-enable-bg)]"} pr-10`}
                dateFormat="dd/MM/yyyy"
                name={name}
                id={inputId}
              />
              <CalendarDays
                size={18}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          ) : (
            <>
              <input
                ref={inputRef}
                disabled={disabled}
                id={inputId}
                type={inputType}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                style={
                  isTime
                    ? { colorScheme: "light dark" }
                    : undefined
                }
                className={`w-full p-1 py-2 rounded-lg !text-[13px] !border !border-[var(--input-enable-border)] text-[var(--picker-text)] focus:outline-none focus:ring-[0.2px] focus:ring-[#767575] placeholder:text-[12px] placeholder:text-[var(--search-placeholder)] pl-2 bg-[var(--input-enable-bg)] transition-all duration-200
                  ${disabled ? "bg-[var(--input-disable-bg)] cursor-not-allowed" : "bg-[var(--input-enable-bg)]"}
                  ${hasRightIcon ? "pr-10" : ""}
                  ${isPassword ? "no-password-toggle" : ""}
                `}
              />

              {/* ✅ PASSWORD ICON */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 "
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              )}

              {isTime && (
                <Clock
                  size={18}
                  onClick={() => inputRef.current?.showPicker()}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <textarea
            id={inputId}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            className={`w-full p-2 rounded-lg !text-[13px] !border !border-[var(--input-enable-border)] text-[var(--picker-text)] focus:outline-none focus:ring-[0.2px] focus:ring-[#767575] placeholder:text-[12px] placeholder:text-[var(--search-placeholder)] bg-[var(--input-enable-bg)] resize-none transition-all duration-200
              ${error ? "!border-red-500" : ""}
            `}
          />
        </>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
