"use client";

import React from "react";
import Select from "react-select";

const SelectInput = ({
  options = [],
  onChange,
  value,
  error,
  disabled = false,
  placeholder = "Select option",
  isInline = false,
  isMulti = false,
  compact = false, // NEW PROP
  menuPortalTarget =
    typeof document !== "undefined"
      ? document.body
      : null,
}) => {
  // Convert value(s) to react-select format { label, value }
  const toOption = (val) => options.find((o) => o.value === val) || null;

  const selectValue = isMulti
    ? (Array.isArray(value) ? value.map(toOption).filter(Boolean) : [])
    : (toOption(value) || null);

  const handleChange = (selected) => {
    if (isMulti) {
      onChange(selected ? selected.map((o) => o.value) : []);
    } else {
      onChange({ target: { value: selected ? selected.value : "" } });
    }
  };

  const customStyles = {
   control: (base, state) => ({
  ...base,
  backgroundColor:
    "var(--input-enable-bg)",
  borderColor: error
    ? "#ef4444"
    : state.isFocused
    ? "#888888"
    : "var(--input-enable-border)",
  borderRadius: "0.5rem",
  boxShadow: "none",

  minHeight: compact
    ? "30px"
    : "36px",

  height: compact
    ? "30px"
    : "36px",

  padding: isInline
    ? "0"
    : compact
    ? "0 0 0 1px"
    : "0 0 0 1px",

  fontSize: compact
    ? "12px"
    : "13px",

  cursor: disabled
    ? "not-allowed"
    : "text",

  opacity: disabled ? 0.6 : 1,

  "&:hover": {
    borderColor:
      state.isFocused
        ? "#888888"
        : "var(--input-enable-border)",
  },
}),

   valueContainer: (base) => ({
  ...base,
  padding: compact
    ? "0 4px"
    : isInline
    ? "0 4px"
    : "2px 4px",

  gap: "4px",
  flexWrap: isInline
    ? "nowrap"
    : "wrap",
}),

   input: (base) => ({
  ...base,
  color:
    "var(--select-input-value)",
  fontSize: compact
    ? "12px"
    : "13px",
  margin: 0,
  padding: 0,
}),

   placeholder: (base) => ({
  ...base,
  color:
    "var(--search-placeholder)",
  fontSize: compact
    ? "12px"
    : "13px",
}),

   singleValue: (base) => ({
  ...base,
  color:
    "var(--select-input-value)",
  fontSize: compact
    ? "12px"
    : "13px",
}),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "var(--select-input)",
      borderRadius: "6px",
      margin: "1px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "var(--select-input-value)",
      fontSize: "12px",
      padding: "1px 4px",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "var(--select-input-value)",
      borderRadius: "0 6px 6px 0",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "transparent",
        opacity: 0.7,
      },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "var(--input-enable-bg)",
      border: "1px solid var(--input-enable-border)",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      overflow: "hidden",
      zIndex: 50,
    }),

    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: "192px",
    }),

   option: (base, state) => ({
  ...base,
  backgroundColor: state.isSelected
    ? "#FD9F35" // selected option bg
    : state.isFocused
    ? "var(--select-input-hover)"
    : "transparent",

  color: state.isSelected
    ? "#fff" // selected text white
    : "var(--select-input-value)",

  fontSize: "13px",
  cursor: "pointer",
  padding: "8px 12px",

  "&:active": {
    backgroundColor: "#FD9F35",
  },
}),

    indicatorSeparator: () => ({ display: "none" }),  // removes the "|" divider

    clearIndicator: (base) => ({
      ...base,
      color: "var(--select-input-value)",
      opacity: 0.5,
      cursor: "pointer",
      padding: "0 4px",
      "&:hover": { opacity: 1 },
    }),

   dropdownIndicator: (
  base,
  state
) => ({
  ...base,
  color:
    "var(--search-placeholder)",
  padding: compact
    ? "0 4px"
    : "0 6px",

  transition:
    "transform 300ms ease-in-out",

  transform:
    state.selectProps.menuIsOpen
      ? "rotate(180deg)"
      : "rotate(0deg)",
}),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="relative w-full">
      <Select
        options={options}
        value={selectValue}
        onChange={handleChange}
        isMulti={isMulti}
        isDisabled={disabled}
        placeholder={placeholder}
        isSearchable
        isClearable={isMulti}
        styles={customStyles}
        classNamePrefix="rs"
        menuPosition="absolute"
        menuPortalTarget={menuPortalTarget}
        noOptionsMessage={() => "No options found"}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SelectInput;