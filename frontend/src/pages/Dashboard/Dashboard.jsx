import React, { useState, useEffect, useMemo } from 'react';
import Cards from '../../components/Common/Cards/Cards';
import { CheckCircle, User, Users } from 'lucide-react';
import Table1 from '../../components/Common/Table/Table';
import SearchInput from '../../components/Common/Form/Inputs/SearchInput';
import SelectInput from '../../components/Common/Form/Inputs/SelectInput';
import api from '../../api/axios';

function fmtDate(val) {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} 12:00:00 AM`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    api.get('/users/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setStats({ hits: {}, moduleSummary: [] }))
      .finally(() => setLoading(false));
  }, []);

  const { hits = {}, moduleSummary = [] } = stats || {};

  const filtered = useMemo(() => {
    if (!search.trim()) return moduleSummary;
    const q = search.toLowerCase();
    return moduleSummary.filter((r) =>
      Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }, [moduleSummary, search]);

  const columns = [
    { key: 'Date', label: 'Date', render: (val) => fmtDate(val) },
    { key: 'Module', label: 'Module' },
    { key: 'Plant', label: 'Plant' },
    { key: 'LiveEntry', label: 'Live Entry (From OSIPI)' },
    { key: 'ManualEntry', label: 'Manual Entry' },
    { key: 'TotalEntry', label: 'Total Entry' },
    { key: 'Uploaded', label: 'Uploaded' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* ── 4 Separate Hit Counter Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Cards
          title="No. of Hits"
          value={(hits['Hits'] || 0).toLocaleString()}
          color="#FF9402"
          bgShade="#FEFAF4"
          darkBg="linear-gradient(180deg, #302F2F 55.09%, #382E22 100%)"
          icon={<User size={18} />}
        />
        <Cards
          title="Hits MTD"
          value={(hits['MTDHits'] || 0).toLocaleString()}
          color="#3CCE49"
          bgShade="#FEFAF4"
          darkBg="linear-gradient(180deg, #302F2F 0%, #1D2B20 100%)"
          icon={<CheckCircle size={18} />}
        />
        <Cards
          title="Unique User Hits"
          value={(hits['UniqueTotal'] || 0).toLocaleString()}
          color="#F14B44"
          bgShade="#FEFAF4"
          darkBg="linear-gradient(180deg, #302F2F 55.09%, #382E22 100%)"
          icon={<Users size={18} />}
        />
        <Cards
          title="Unique User MTD"
          value={(hits['UniqueMTD'] || 0).toLocaleString()}
          color="#319AFE"
          bgShade="#FEFAF4"
          darkBg="linear-gradient(180deg, #302F2F 0%, #1D2B20 100%)"
          icon={<Users size={18} />}
        />
      </div>

      {/* ── Module Wise Data Summary ── */}
      <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--form-border)] overflow-hidden flex flex-col">
        {/* Yellow header banner */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-300 px-4 py-3 rounded-t-lg">
          <h3 className="text-[14px] font-semibold text-black m-0">Module wise data summary</h3>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap justify-between items-center px-4 py-3 gap-4 border-b border-[var(--form-border)]">
          <div className="w-24">
            <SelectInput
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
          </div>
          <div className="w-64">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-2 overflow-auto">
          <Table1 
            columns={columns} 
            data={filtered} 
            showPagination={true}
          />
        </div>
      </div>
    </div>
  );
}
