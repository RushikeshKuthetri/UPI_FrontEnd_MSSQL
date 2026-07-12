import React, { useState } from 'react';
import { X, CloudUpload, TableProperties } from 'lucide-react';

const UploadFileModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onUpload) {
        onUpload(file);
      }
    }
  };

  const handleDownloadSample = () => {
    const headers = ['Resource', 'Stop Time', 'Start Time', 'Material', 'Type', 'Reason', 'Department', 'Equipment', 'Remarks'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Sample_StoppageEntry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[400px] rounded-2xl px-6 py-6 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg, #2A2A2A)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-[18px] font-semibold"
            style={{ color: 'var(--title, #FFF)' }}
          >
            Uploads
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSample}
              className="transition hover:opacity-70 p-1.5 rounded-md var(--input-enable-bg, #1A1A1A) var(--card-subtle, #A0A0A0)"
              title="Download Sample Template"
            >
              <TableProperties size={20} />
            </button>
            <button
              onClick={onClose}
              className="transition hover:opacity-70 var(--card-subtle, #A0A0A0)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className="border border-dashed rounded-xl flex flex-col items-center justify-center p-8 gap-3"
          style={{ borderColor: 'var(--form-border, #4A4A4A)' }}
        >
          <CloudUpload size={40} className="text-[#C4B5FD] mb-2" />
          
          <div className="text-[15px] font-medium" style={{ color: 'var(--title, #FFF)' }}>
            Drag & drop files or Browse 
          </div>
          
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-color, #A0A0A0)' }}>
            Supported formats: .xls, .xlsx
          </div>

          <div className="w-full relative flex items-center border rounded-md px-3 py-2 bg-var(--card-bg)" style={{ borderColor: 'var(--form-border, #4A4A4A)' }}>
            <input 
              type="file" 
              accept=".xls,.xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-3 w-full">
              <span className="bg-[#E5E7EB] text-black text-xs font-semibold px-2 py-1 rounded">
                Choose File
              </span>
              <span className="text-[13px] text-gray-400 truncate">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
