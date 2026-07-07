import React from "react";

const CheckboxInput = ({  checked, onChange }) => {
  return (
   <div
    onClick={onChange}
    className="w-4 h-4 rounded-[3px] cursor-pointer flex items-center justify-center transition-all duration-200"
    style={{
      background: checked ? '#07c2f5' : 'transparent',
      border: checked ? '1.5px solid #07c2f5' : '1.5px solid var(--form-border)',
    }}
  >
    {checked && (
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
  );
};

export default CheckboxInput;
