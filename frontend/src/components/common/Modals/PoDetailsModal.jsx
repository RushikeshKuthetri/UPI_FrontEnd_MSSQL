import React, { useState, useEffect } from 'react';
import { X, Target, FileText, Globe, Folder, Upload, TableProperties, SquarePen, Split, Plus } from 'lucide-react';
import Table1 from '../Table/Table';
import BackButton from '../Form/Buttons/BackButton';
import AddBomItemPOModal from './AddBomItemPOModal';
import SplitBomItemModal from './SplitBomItemModal';
import UploadFileModal from './UploadFileModal';
import NextButton from '../Form/Buttons/NextButton';
import ActionButton from '../Form/Buttons/ActionButton';
import IconButton from '../Form/Buttons/IconButton';
import Title from '../TitleAndLabel/Title';
import api from '../../../api/axios';


const PoDetailsModal = ({ isOpen, onClose, isUploadEnabled, selectedRow }) => {
  const [isAddBomItemOpen, setIsAddBomItemOpen] = useState(false);
  const [isSplitBomItemOpen, setIsSplitBomItemOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [splitRow, setSplitRow] = useState(null);

  const fetchDetails = async () => {
    if (!selectedRow) return;
    setLoading(true);
    try {
      const params = {
        plantCode: selectedRow.WERKS || selectedRow.Plant || '',
        resource: selectedRow.Resource || '',
        material: selectedRow.Material || '',
        postingDate: selectedRow.PostingDate || '',
      };
      const { data } = await api.get('/process-order/details', { params });
      setDetailsData(data.data || []);
    } catch (error) {
      console.error("Error fetching details", error);
      setDetailsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedRow) {
      fetchDetails();
    } else {
      setDetailsData([]);
    }
  }, [isOpen, selectedRow]);

  if (!isOpen) return null;

  const columns = [
    { key: 'material', label: 'Material' },
    { key: 'storageLocation', label: 'Storage Location' },
    { key: 'movtType', label: 'Movt Type' },
    { key: 'batch', label: 'Batch' },
    { key: 'qc', label: 'QC %' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'correction', label: 'Correction' },
    { key: 'correctWf', label: 'Correct W.F' },
    { key: 'moist', label: 'Moist %' },
    { key: 'finalQuantity', label: 'Final Quantity %' },
    { key: 'uom', label: 'UOM' },
    { key: 'isoUom', label: 'ISO UOM' },
    { key: 'unit1', label: 'Unit 1' },
    { key: 'isoUnit1', label: 'ISO Unit 1' },
    { key: 'availableStock', label: 'Available Stock' },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (_, row) => row.ConfirmationText || row.Remarks || row.remarks || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-3">
          <button 
            className="text-[#8A38F5] hover:opacity-70 transition"
            onClick={() => {
              setEditingRow(row);
              setIsAddBomItemOpen(true);
            }}
          >
            <SquarePen size={15} strokeWidth={2.5} />
          </button>
          <button 
            className="text-[#20C997] hover:opacity-70 transition"
            onClick={() => {
              setSplitRow(row);
              setIsSplitBomItemOpen(true);
            }}
          >
            <Split size={15} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-[95vw] max-w-[1400px] max-h-[95vh] overflow-y-auto rounded-2xl px-6 py-6 shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg, #F9FAFB)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5  rounded-full"></div>

            <Title label={"PO Details:"} />
          </div>
          <button
            onClick={onClose}
            className="transition hover:opacity-70"
          >
            <X size={20} />
          </button>
        </div>

        {/* PO Info Card */}
        <div
          className="rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between mb-6 shadow-sm gap-y-4"
          style={{ background: 'var(--card-bg, #FFF)', borderColor: 'var(--form-border, #E5E7EB)' }}
        >
          {/* Item 1 */}
          <div className="flex items-center gap-4 px-2 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#FD6E41]" style={{ background: 'rgba(253, 110, 65, 0.1)' }}>
              <Target size={20} />
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-color, #6B7280)' }}>Process Order No.</div>
              <div className="font-semibold text-[13px]" style={{ color: 'var(--title, #000)' }}>{selectedRow?.ProcessOrder || selectedRow?.OrderNo || '-'}</div>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px" style={{ background: 'var(--form-border, #E5E7EB)' }}></div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 px-2 flex-1 min-w-[150px]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#F59E0B]" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-color, #6B7280)' }}>Order Quality</div>
              <div className="font-semibold text-[13px]" style={{ color: 'var(--title, #000)' }}>{selectedRow?.Quantity || selectedRow?.Yield || '-'} {selectedRow?.UOM || ''}</div>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px" style={{ background: 'var(--form-border, #E5E7EB)' }}></div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 px-2 flex-1 min-w-[150px]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#3B82F6]" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Globe size={20} />
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-color, #6B7280)' }}>Resource</div>
              <div className="font-semibold text-[13px]" style={{ color: 'var(--title, #000)' }}>{selectedRow?.Resource || '-'}</div>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px" style={{ background: 'var(--form-border, #E5E7EB)' }}></div>

          {/* Item 4 */}
          <div className="flex items-center gap-4 px-2 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#10B981]" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Folder size={20} />
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-color, #6B7280)' }}>Material</div>
              <div className="font-semibold text-[13px]" style={{ color: 'var(--title, #000)' }}>{selectedRow?.Material || '-'}</div>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px" style={{ background: 'var(--form-border, #E5E7EB)' }}></div>

          {/* Item 5 */}
          <div className="flex items-center gap-4 px-2 flex-1 min-w-[150px]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#F59E0B]" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-color, #6B7280)' }}>Posting Date</div>
              <div className="font-semibold text-[13px]" style={{ color: 'var(--title, #000)' }}>
                {(selectedRow?.PostingDate || selectedRow?.CreatedOn) ? new Date(selectedRow.PostingDate || selectedRow.CreatedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Add Material & Tools Row */}
        <div className="flex justify-between items-center mb-4">
          <ActionButton icon={Plus} label="Add Material" onClick={() => {
            setEditingRow(null);
            setIsAddBomItemOpen(true);
          }} />
          <div className="flex items-center gap-4 var(--submit-button-bg)">
            {isUploadEnabled && (
              <IconButton icon={Upload} onClick={() => setIsUploadModalOpen(true)} tooltip="Upload Excel" />
            )}
            {/* <IconButton icon={TableProperties} onClick={() => alert("Table Properties clicked")} tooltip="Table Properties" /> */}
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-grow w-full overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-32">Loading...</div>
          ) : (
            <Table1 columns={columns} data={[...detailsData].reverse()} />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <BackButton onClick={onClose} label="  Skip and Close" />
          <NextButton onClick={onClose} label="Validate and Close" className='' />
        </div>

      </div>

      <AddBomItemPOModal isOpen={isAddBomItemOpen} onClose={() => setIsAddBomItemOpen(false)} onAddSuccess={fetchDetails} selectedRow={selectedRow} editingRow={editingRow} />
      <SplitBomItemModal isOpen={isSplitBomItemOpen} onClose={() => setIsSplitBomItemOpen(false)} onAddSuccess={fetchDetails} selectedRow={splitRow} />
      <UploadFileModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
};

export default PoDetailsModal;
