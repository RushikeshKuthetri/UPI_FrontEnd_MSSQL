"use client";

export default function RadioButton({
  label,
  value,
  selected,
  onChange,
  description,
}) {
  const isActive = selected === value;

  return (
    <label
      className={`
         flex items-center gap-3   cursor-pointer
        transition-all duration-200     
      `}
    >
      {/* Hidden native radio */}
      <input
        type="radio"
        value={value}
        checked={isActive}
        onChange={() => onChange(value)}
        className="hidden"
      />

      {/* Custom Radio Circle */}
      <div
        className={`
           h-4 w-4 rounded-full border flex justify-center items-center 
          transition-all duration-200
          ${
            isActive
              ? "border-[#FD9F35]"
              : "border-gray-400"
          }
        `}
      >
        {isActive && (
          <div className="h-2.5 w-2.5 rounded-full bg-[#FD9F35] " />
        )}
      </div>

      {/* Text Content */}
      <div>
        <p className="text-[13px] font-semibold ">
          {label}
        </p>

        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}