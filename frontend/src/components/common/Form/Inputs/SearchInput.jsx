import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", width = "w-[180px]" }) => {
  return (
    <div className="flex items-center bg-[var(--search-bg)] !border !border-[var(--input-enable-border)] rounded-md px-3 shadow-sm">
      <Search size={16} className="text-gray-400 mr-2 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-transparent outline-none ${width} text-sm text-[var(--text-color)] placeholder-[var(--search-placeholder)]`}
      />
    </div>
  );
};

export default SearchBar;