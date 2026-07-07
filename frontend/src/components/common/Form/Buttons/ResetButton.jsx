import { RefreshCcw } from "lucide-react";
import React from "react";

const ResetButton = ({
  label = "Reset",
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
        px-4 py-[6px]
        rounded-lg
        text-sm font-medium
        transition hover:opacity-80
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        border: "1.5px solid var(--button-border)",
        background: "var(--button-bg)",
        color: "var(--text-color)",
      }}
    >
      <RefreshCcw size={14} />
      {label}
    </button>
  );
};

export default ResetButton;