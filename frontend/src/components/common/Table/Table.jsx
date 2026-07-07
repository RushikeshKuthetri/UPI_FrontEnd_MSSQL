'use client';
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";

const Table1 = ({
  columns = [],
  data = [],
  renderActions,
  showPagination = true,
  defaultRowsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, rowsPerPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = showPagination ? data.slice(startIndex, startIndex + rowsPerPage) : data;

  return (
    <div className="w-full h-full flex flex-col gap-3 min-h-0">
      {/* Adjust border color according to theme */}
      <div className="w-full overflow-auto rounded-xl border-t border-l border-r border-b border-[var(--form-border)] custom-scrollbar">

        <table className="w-full border-collapse">

          {/* adjust bg color and gradiant accordint to the theme */}
          <thead className="bg-gradient-to-r from-orange-400 to-orange-300 text-black sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col) => {
                const firstVal = data.length > 0 ? data[0][col.key] : null;
                const isNumberColumn = firstVal !== null && firstVal !== '' && !isNaN(Number(firstVal));
                const isSrNo = col.label === 'Sr No.' || col.label === 'Sr. No.';
                const isAction = col.label === 'Action' || col.label === 'Actions';
                const isCenter = isNumberColumn || isAction || col.center;
                return (
                  <th
                    key={col.key}
                    className={`text-[14px] px-2 py-1 font-semibold whitespace-nowrap border-b border-[var(--form-border)] ${isCenter ? 'text-center' : 'text-left'} ${isSrNo ? 'w-[70px]' : ''}`}
                  >
                    {col.label}
                  </th>
                );
              })}

              {renderActions && (
                <th className="text-[14px] px-2 py-1 text-center  font-semibold border-b border-[var(--form-border)]">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* adjust color for table body according to theme */}
          <tbody className="border-b border-[var(--form-border)] ">
            {currentData.map((row, index) => (
              // if want add color for hover effect
              <tr
                key={index}
                className="border-b border-[var(--form-border)]    transition "
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const isNumber = value !== null && value !== '' && !isNaN(Number(value));
                  const isSrNo = col.label === 'Sr No.' || col.label === 'Sr. No.';
                  const isAction = col.label === 'Action' || col.label === 'Actions';
                  const isCenter = isNumber || isAction || col.center;
                  return (
                    <td
                      key={col.key}
                      className={`text-[13px] px-2 py-1 whitespace-nowrap text-sm ${isCenter ? 'text-center' : 'text-left'} ${isSrNo ? 'w-[70px]' : ''}`}
                    >
                      {col.render
                        ? (isAction ? <div className="flex justify-center">{col.render(value, row, startIndex + index)}</div> : col.render(value, row, startIndex + index))
                        : value}
                    </td>
                  );
                })}

                {renderActions && (
                  <td className="px-2 py-1 text-center ">
                    <div className="flex justify-center">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {showPagination && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsChange={setRowsPerPage}
        />
      )}
    </div>
  );
};

export default Table1;
