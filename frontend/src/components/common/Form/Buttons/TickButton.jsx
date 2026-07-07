import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const TickButton = ({ onClick, loading = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border border-[#00ffcc] bg-slate-900/50 hover:bg-green-500/20 hover:border-green-400 transition-all duration-200 flex items-center justify-center ${className}`}
      disabled={loading}
    >
      <CheckCircleIcon className="w-7 h-7 text-green-400" />
    </button>
  );
};

export default TickButton;
