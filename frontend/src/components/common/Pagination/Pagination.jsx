import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsChange,
  rowsOptions = [5, 10, 20],
  showRowsPerPage = true,
}) => {
  if (currentPage === undefined || totalPages === undefined) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
  <div className="flex px-2 items-center justify-between  w-full flex-wrap">
    
   
    {showRowsPerPage ? (
      <div className="text-sm flex items-center gap-2 text-[12px]">
        Rows per page :
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
        //   bg- color for row per page--------------
          className=" rounded-md px-0.5 text-black border border-[#FD6E41] bg-[var(--card-border)] outline-none"
        >
          {rowsOptions.map((num) => (
            <option key={num} value={num} className="text-[12px]">
              {num}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <div /> 
    )}

    {/* change text color according to the theme */}
    <div className="flex items-center gap-3  ml-auto text-[12px]">
      
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-1 rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-medium whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-1 rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  </div>
);
;
};

export default Pagination;
