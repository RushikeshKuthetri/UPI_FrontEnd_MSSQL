// import { Search } from "lucide-react";

// export default function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
//   return (
//     <div className={`w-fit ${className}`}>
//       <div className="flex items-center rounded-md px-2 transition-colors duration-300 bg-[var(--search-bg)] border border-[var(--search-border)]">
//         <Search size={18} className="mr-2" style={{ color: "var(--search-placeholder)" }} />        
//         <input
//           type="text"
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="bg-transparent outline-none w-full placeholder-[var(--search-placeholder)] py-1.5 text-sm"
//         />
//       </div>
//     </div>
//   );
// } 


import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", width = "w-[180px]" }) => {
  return (
    <div className="flex items-center py-0.5 bg-[var(--search-bg)] !border !border-[var(--input-enable-border)] rounded-md px-3 shadow-sm">
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