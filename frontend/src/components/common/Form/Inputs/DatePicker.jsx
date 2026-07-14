import React from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  error = "",
  showTime = true,
  dateFormat,
  timeIntervals = 1,
  maxDate = new Date(),
  minDate,
  className = "",
}) => {
  // Set default dateFormat based on showTime prop
  const finalDateFormat = dateFormat || (showTime ? "d/MM/yyyy h:mm aa" : "dd/MM/yyyy");
  const handleDateChange = (date) => {
    if (maxDate && date > maxDate) return;

    onChange(date);
  };

  return (
    <div className="relative w-full">
      <div
        className={`
          w-full h-[36px] rounded-lg !border
          !border-[var(--input-enable-border)]
          bg-[var(--input-enable-bg)]
          px-2 flex items-center relative
          ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }
        `}
      >
        <DatePicker
          selected={value}
          onChange={handleDateChange}
          placeholderText={placeholder}
          wrapperClassName="w-full h-full"
          className={`
            w-full h-full px-2 py-2 pr-10 text-[13px]
            outline-none bg-transparent
            text-[var(--text-color)] cursor-pointer
            ${className}
          `}
          showTimeSelect={showTime}
          dateFormat={finalDateFormat}
          timeIntervals={timeIntervals}
          readOnly={disabled}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          showMonthDropdown
          showYearDropdown
        />

        {/* Calendar Icon */}
        <div className="absolute right-3 pointer-events-none">
          <CalendarDays
            size={16}
            className="text-[var(--search-placeholder)]"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default DateTimePicker;