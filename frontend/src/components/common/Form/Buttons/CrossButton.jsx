import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

const CrossButton = ({ onClick, loading = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border border-[#00ffcc] bg-slate-900/50 hover:bg-red-500/20 hover:border-red-400 transition-all duration-200 flex items-center justify-center ${className}`}
      disabled={loading}
    >
      <XCircleIcon className="w-7 h-7 text-red-400" />
    </button>
  );
};

export default CrossButton;
