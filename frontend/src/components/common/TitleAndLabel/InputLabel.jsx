import React from "react";

const FormLabel = ({ children, required = false }) => {
  return (
    <label className="block text-sm text-[var(--input-label)] font-medium  mb-1">
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
};

export default FormLabel;
