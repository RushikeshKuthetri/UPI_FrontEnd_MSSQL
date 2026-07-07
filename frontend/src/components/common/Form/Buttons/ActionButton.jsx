import React from "react";

const ActionButton = ({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5
        px-3 py-1
        rounded-md
        text-sm font-medium
        text-white
        transition hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        background: "var(--submit-button-bg)",
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
};

export default ActionButton;