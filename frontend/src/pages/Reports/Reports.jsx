import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, MenuItem, TextField, Button, Paper, CircularProgress,
} from '@mui/material';
import { BarChart, SwapHoriz, PauseCircle, Construction, Speed, Assignment, Tune } from '@mui/icons-material';
import api from '../../api/axios';

const MODULES = [
  { key: 'grade-change', label: 'Grade Change', icon: <SwapHoriz />, color: '#fe8f12' },
  { key: 'stoppages', label: 'Stoppages', icon: <PauseCircle />, color: '#d32f2f' },
  { key: 'equipment-standby', label: 'Equipment Standby', icon: <Construction />, color: '#f57c00' },
  { key: 'meter-reading', label: 'Meter Reading', icon: <Speed />, color: '#388e3c' },
  { key: 'process-order', label: 'Process Order', icon: <Assignment />, color: '#7b1fa2' },
  { key: 'process-parameter', label: 'Process Parameter', icon: <Tune />, color: '#00838f' },
];

export default function Reports() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [filters, setFilters] = useState({ plantCode: '', startDate: '', endDate: '' });
  const [plants, setPlants] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
  }, []);

  const fetchReport = async (mod) => {
    if (!mod) return;
    setLoading(true);
    try {
      const { data: result } = await api.get(`/${mod.key}/list`, {
        params: { page: 1, limit: 200, ...filters },
      });
      setData(result.data || []);
    } catch { setData([]); }
    finally { setLoading(false); }
  };

  const handleModuleSelect = (mod) => {
    setSelectedModule(mod);
    setData([]);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Reports</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {MODULES.map((mod) => (
          <Grid item xs={6} sm={4} md={2} key={mod.key}>
            <Card
              elevation={selectedModule?.key === mod.key ? 4 : 1}
              sx={{ border: selectedModule?.key === mod.key ? `2px solid ${mod.color}` : '2px solid transparent' }}
            >
              <CardActionArea onClick={() => handleModuleSelect(mod)} sx={{ p: 1.5, textAlign: 'center' }}>
                <Box sx={{ color: mod.color, mb: 0.5 }}>{mod.icon}</Box>
                <Typography variant="caption" fontWeight={600}>{mod.label}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedModule && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField select label="Plant" size="small" sx={{ minWidth: 140 }}
            value={filters.plantCode}
            onChange={(e) => setFilters((f) => ({ ...f, plantCode: e.target.value }))}>
            <MenuItem value="">All Plants</MenuItem>
            {plants.map((p) => <MenuItem key={p.PlantCode} value={p.PlantCode}>{p.PlantName || p.PlantCode}</MenuItem>)}
          </TextField>
          <TextField label="From Date" type="date" size="small" InputLabelProps={{ shrink: true }}
            value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
          <TextField label="To Date" type="date" size="small" InputLabelProps={{ shrink: true }}
            value={filters.endDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
          <Button variant="contained" startIcon={<BarChart />} onClick={() => fetchReport(selectedModule)}>
            Generate Report
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : data.length > 0 ? (
        <Paper elevation={2} sx={{ overflowX: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>{selectedModule?.label} — {data.length} records</Typography>
            <Chip label={`${data.length} rows`} size="small" color="primary" />
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  {columns.slice(0, 12).map((c) => (
                    <th key={c} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #ddd' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    {columns.slice(0, 12).map((c) => (
                      <td key={c} style={{ padding: '6px 12px', borderBottom: '1px solid #eee' }}>
                        {typeof row[c] === 'boolean' ? (row[c] ? 'Yes' : 'No') : row[c]?.toString?.()?.split('T')[0] || row[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      ) : selectedModule ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>Select filters and click "Generate Report"</Typography>
      ) : null}
    </Box>
  );
}
