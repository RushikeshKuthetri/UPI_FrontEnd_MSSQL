import React from "react";

const SubmitButton = ({
  children = "Submit",
  onClick,
  type = "submit",
  loading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    //   change the bg color for the submit button according to the theme
      className={` px-3 py-1 rounded-md border border-[var(--button-border)] bg-[var(--submit-button-bg)] hover:bg-[var(--submit-button-hover-bg)] text-[#111111] font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-95 ${className}
      `}
    >
      {loading ? "Submitting..." : children}
    </button>
  );
};

export default SubmitButton;
